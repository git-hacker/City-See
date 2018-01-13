/*
 * Licensed under the Apache License, Version 2.0 (http://www.apache.org/licenses/LICENSE-2.0)
 * See https://github.com/openiddict/openiddict-core for more information concerning
 * the license and the contributors participating to this project.
 */

using AspNet.Security.OpenIdConnect.Extensions;
using AspNet.Security.OpenIdConnect.Primitives;
using AspNet.Security.OpenIdConnect.Server;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using OpenIddict.Core;
using OpenIddict.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;

namespace AuthorizationCenter.Controllers
{
    public class AuthorizationController : Controller
    {
        private readonly OpenIddictApplicationManager<Applications> _applicationManager;
        private readonly IOptions<IdentityOptions> _identityOptions;
        private readonly SignInManager<Users> _signInManager;
        private readonly UserLoginLogManager _userLoginLogManager;
        private readonly UserManager<Users> _userManager;
        private readonly IDistributedCache _cache;
        private readonly ApplicationDbContext _dbContext = null;
        private readonly IConfigurationRoot _config = null;
        private readonly long tokenExpiresIn;
        private readonly ISystemClock _clock;
        private readonly string serviceApiUrl = "";
        private RestClient restClient = null;

        public AuthorizationController(
            OpenIddictApplicationManager<Applications> applicationManager,
            IOptions<IdentityOptions> identityOptions,
            SignInManager<Users> signInManager,
            UserManager<Users> userManager,
            IDistributedCache cache,
            ApplicationDbContext dbContext,
            UserLoginLogManager userLoginLogManager,
            IConfigurationRoot config,
            ISystemClock clock)
        {
            _applicationManager = applicationManager;
            _identityOptions = identityOptions;
            _signInManager = signInManager;
            _userManager = userManager;
            _cache = cache;
            _userLoginLogManager = userLoginLogManager;
            _dbContext = dbContext;
            _config = config;
            string timeStr = _config["TokenExpiresIn"];
            long expiresIn = 0;
            long.TryParse(timeStr ?? "", out expiresIn);
            if (expiresIn <= 0)
            {
                expiresIn = 3600;
            }
            tokenExpiresIn = expiresIn;
            _clock = clock;
            serviceApiUrl = config["ServiceApi"];
            restClient = new RestClient(serviceApiUrl);
        }

        #region Authorization code, implicit and implicit flows
        // Note: to support interactive flows like the code flow,
        // you must provide your own authorization endpoint action:

        [Authorize, HttpGet("~/connect/authorize")]
        public async Task<IActionResult> Authorize(OpenIdConnectRequest request)
        {
            Debug.Assert(request.IsAuthorizationRequest(),
                "The OpenIddict binder for ASP.NET Core MVC is not registered. " +
                "Make sure services.AddOpenIddict().AddMvcBinders() is correctly called.");

            // Retrieve the application details from the database.
            var application = await _applicationManager.FindByClientIdAsync(request.ClientId, HttpContext.RequestAborted);
            if (application == null)
            {
                return View("Error", new ErrorViewModel
                {
                    Error = OpenIdConnectConstants.Errors.InvalidClient,
                    ErrorDescription = "Details concerning the calling client application cannot be found in the database"
                });
            }

            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return View("Error", new ErrorViewModel
                {
                    Error = OpenIdConnectConstants.Errors.ServerError,
                    ErrorDescription = "An internal error has occurred"
                });
            }

            // Create a new authentication ticket.
            var ticket = await CreateTicketAsync(request, user);

            // Returning a SignInResult will ask OpenIddict to issue the appropriate access/identity tokens.
            return SignIn(ticket.Principal, ticket.Properties, ticket.AuthenticationScheme);
            // Flow the request_id to allow OpenIddict to restore
            // the original authorization request from the cache.
            //return View(new AuthorizeViewModel
            //{
            //    ApplicationName = application.DisplayName,
            //    RequestId = request.RequestId,
            //    Scope = request.Scope
            //});
        }
        [Obsolete]
        [Authorize, FormValueRequired("submit.Accept")]
        [HttpPost("~/connect/authorize"), ValidateAntiForgeryToken]
        public async Task<IActionResult> Accept(OpenIdConnectRequest request)
        {
            Debug.Assert(request.IsAuthorizationRequest(),
                "The OpenIddict binder for ASP.NET Core MVC is not registered. " +
                "Make sure services.AddOpenIddict().AddMvcBinders() is correctly called.");

            // Retrieve the profile of the logged in user.
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return View("Error", new ErrorViewModel
                {
                    Error = OpenIdConnectConstants.Errors.ServerError,
                    ErrorDescription = "An internal error has occurred"
                });
            }

            // Create a new authentication ticket.
            var ticket = await CreateTicketAsync(request, user);

            // Returning a SignInResult will ask OpenIddict to issue the appropriate access/identity tokens.
            return SignIn(ticket.Principal, ticket.Properties, ticket.AuthenticationScheme);
        }


        [Obsolete]
        [Authorize, FormValueRequired("submit.Deny")]
        [HttpPost("~/connect/authorize"), ValidateAntiForgeryToken]
        public IActionResult Deny()
        {
            // Notify OpenIddict that the authorization grant has been denied by the resource owner
            // to redirect the user agent to the client application using the appropriate response_mode.
            return Forbid(OpenIdConnectServerDefaults.AuthenticationScheme);
        }

        // Note: the logout action is only useful when implementing interactive
        // flows like the authorization code flow or the implicit flow.

        [HttpGet("~/connect/logout")]
        public IActionResult Logout(OpenIdConnectRequest request)
        {
            Debug.Assert(request.IsLogoutRequest(),
                "The OpenIddict binder for ASP.NET Core MVC is not registered. " +
                "Make sure services.AddOpenIddict().AddMvcBinders() is correctly called.");

            // Flow the request_id to allow OpenIddict to restore
            // the original logout request from the distributed cache.
            return View(new LogoutViewModel
            {
                RequestId = request.RequestId
            });
        }

        [HttpPost("~/connect/logout"), ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            // Ask ASP.NET Core Identity to delete the local and external cookies created
            // when the user agent is redirected from the external identity provider
            // after a successful authentication flow (e.g Google or Facebook).
            await _signInManager.SignOutAsync();

            // Returning a SignOutResult will ask OpenIddict to redirect the user agent
            // to the post_logout_redirect_uri specified by the client application.
            return SignOut(OpenIdConnectServerDefaults.AuthenticationScheme);
        }
        #endregion

        #region Password, authorization code and refresh token flows
        // Note: to support non-interactive flows like password,
        // you must provide your own token endpoint action:

        [HttpPost("~/connect/token"), Produces("application/json")]
        public async Task<IActionResult> Exchange(OpenIdConnectRequest request)
        {
            Debug.Assert(request.IsTokenRequest(),
                "The OpenIddict binder for ASP.NET Core MVC is not registered. " +
                "Make sure services.AddOpenIddict().AddMvcBinders() is correctly called.");

            if (request.IsPasswordGrantType())
            {
                var user = await _userManager.FindByNameAsync(request.Username);
                if (user == null)
                {
                    return BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "用户名或密码错误"
                    });
                }

                // Validate the username/password parameters and ensure the account is not locked out.
                var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: true);
                if (!result.Succeeded)
                {
                    return BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "用户名或密码错误"
                    });
                }

                // Create a new authentication ticket.
                var ticket = await CreateTicketAsync(request, user);

                await _userLoginLogManager.CreateAsync(new UserLoginLog
                {
                    LoginTime = DateTime.Now,
                    TrueName = user.TrueName,
                    UserId = user.Id,
                    UserName = user.UserName,
                    OrganizationId = user.OrganizationId,
                    LoginApplication = request.ClientId,
                    LoginIp = HttpContext.Connection.RemoteIpAddress.ToString(),
                }, CancellationToken.None);

                return SignIn(ticket.Principal, ticket.Properties, ticket.AuthenticationScheme);
            }

            else if (request.IsAuthorizationCodeGrantType() || request.IsRefreshTokenGrantType())
            {
                // Retrieve the claims principal stored in the authorization code/refresh token.
                var info = await HttpContext.AuthenticateAsync(OpenIdConnectServerDefaults.AuthenticationScheme);

                // Retrieve the user profile corresponding to the authorization code/refresh token.
                // Note: if you want to automatically invalidate the authorization code/refresh token
                // when the user password/roles change, use the following line instead:
                // var user = _signInManager.ValidateSecurityStampAsync(info.Principal);
                var user = await _userManager.GetUserAsync(info.Principal);
                if (user == null)
                {
                    return BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "The token is no longer valid."
                    });
                }

                // Ensure the user is still allowed to sign in.
                if (!await _signInManager.CanSignInAsync(user))
                {
                    return BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "The user is no longer allowed to sign in."
                    });
                }

                // Create a new authentication ticket, but reuse the properties stored in the
                // authorization code/refresh token, including the scopes originally granted.
                var ticket = await CreateTicketAsync(request, user, info.Properties);

                await _userLoginLogManager.CreateAsync(new UserLoginLog
                {
                    LoginTime = DateTime.Now,
                    TrueName = user.TrueName,
                    UserId = user.Id,
                    UserName = user.UserName,
                    OrganizationId = user.OrganizationId,
                    LoginApplication = request.ClientId,
                    LoginIp = HttpContext.Connection.RemoteIpAddress.ToString(),
                }, CancellationToken.None);

                return SignIn(ticket.Principal, ticket.Properties, ticket.AuthenticationScheme);
            }
            else if (request.GrantType == "openid")
            {
                var oid = request["openid"];
                if (oid.HasValue)
                {
                    string openId = oid.Value.Value.ToString();
                    string hasOpenid = _cache.GetString(openId);
                    if (hasOpenid == "1")
                    {
                        _cache.Remove(oid.Value.Value.ToString());
                    }
                    else
                    {
                        return BadRequest(new OpenIdConnectResponse
                        {
                            Error = "illegal_request",
                            ErrorDescription = "非法请求"
                        });
                    }

                    var user = _dbContext.Users.Where(x => x.WXOpenId == openId ).FirstOrDefault();
                    if (user == null)
                    {
                        return BadRequest(new OpenIdConnectResponse
                        {
                            Error = "login_error",
                            ErrorDescription = "用户不存在"
                        });
                    }

                    var ticket = await CreateTicketAsync(request, user);

                    await _userLoginLogManager.CreateAsync(new UserLoginLog
                    {
                        LoginTime = DateTime.Now,
                        TrueName = user.TrueName,
                        UserId = user.Id,
                        UserName = user.UserName,
                        OrganizationId = user.OrganizationId,
                        LoginApplication = request.ClientId,
                        LoginIp = HttpContext.Connection.RemoteIpAddress.ToString(),
                    }, CancellationToken.None);

                    return SignIn(ticket.Principal, ticket.Properties, ticket.AuthenticationScheme);

                }


            }
            else if (request.IsClientCredentialsGrantType())
            {
                var application = await _applicationManager.FindByClientIdAsync(request.ClientId, HttpContext.RequestAborted);
                if (application == null)
                {
                    return BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidClient,
                        ErrorDescription = "The client application was not found in the database."
                    });
                }

                // Create a new authentication ticket.
                var ticket = CreateApplicationTicket(request, application);

                return SignIn(ticket.Principal, ticket.Properties, ticket.AuthenticationScheme);
            }
            else if (request.GrantType == "face")
            {

                var faceImage = request["image"];
                var username = request["username"];
                if (faceImage.HasValue && username.HasValue)
                {
                    string image = faceImage.Value.Value.ToString();
                    string uid = username.Value.Value.ToString();

                    BDFaceVerifyRequest faceRequest = new BDFaceVerifyRequest();
                    faceRequest.uid = uid;
                    faceRequest.topNum = 1;
                    faceRequest.image = image;

                    var r = await restClient.Post<ResponseMessage<BDFaceVerifyResponse>>("/baidu/face/verify", faceRequest);
                    if (r.IsSuccess() && r.Extension != null && r.Extension.result != null && r.Extension.result[0] >= 80)
                    {
                        var user = _dbContext.Users.Where(x => x.UserName.ToLower() == uid.ToLower()).FirstOrDefault();
                        var ticket = await CreateTicketAsync(request, user);

                        await _userLoginLogManager.CreateAsync(new UserLoginLog
                        {
                            LoginTime = DateTime.Now,
                            TrueName = user.TrueName,
                            UserId = user.Id,
                            UserName = user.UserName,
                            OrganizationId = user.OrganizationId,
                            LoginApplication = request.ClientId,
                            LoginIp = HttpContext.Connection.RemoteIpAddress.ToString()
                        }, CancellationToken.None);

                        return SignIn(ticket.Principal, ticket.Properties, ticket.AuthenticationScheme);
                    }
                    else
                    {
                        return BadRequest(new OpenIdConnectResponse
                        {
                            Error = OpenIdConnectConstants.Errors.InvalidGrant,
                            ErrorDescription = "人脸认证失败"
                        });
                    }

                }



            }

            return BadRequest(new OpenIdConnectResponse
            {
                Error = OpenIdConnectConstants.Errors.UnsupportedGrantType,
                ErrorDescription = "The specified grant type is not supported."
            });
        }
        #endregion


        private AuthenticationTicket CreateApplicationTicket(OpenIdConnectRequest request, Applications application)
        {
            // Create a new ClaimsIdentity containing the claims that
            // will be used to create an id_token, a token or a code.
            var identity = new ClaimsIdentity(
                OpenIdConnectServerDefaults.AuthenticationScheme,
                OpenIdConnectConstants.Claims.Name,
                OpenIdConnectConstants.Claims.Role);

            // Use the client_id as the subject identifier.
            identity.AddClaim(OpenIdConnectConstants.Claims.Subject, application.ClientId,
                OpenIdConnectConstants.Destinations.AccessToken,
                OpenIdConnectConstants.Destinations.IdentityToken);

            identity.AddClaim(OpenIdConnectConstants.Claims.Name, application.DisplayName,
                OpenIdConnectConstants.Destinations.AccessToken,
                OpenIdConnectConstants.Destinations.IdentityToken);
            identity.AddClaim("grant_type", request.GrantType, 
                OpenIdConnectConstants.Destinations.AccessToken,
                OpenIdConnectConstants.Destinations.IdentityToken);

            // Create a new authentication ticket holding the user identity.
            var ticket = new AuthenticationTicket(
                new ClaimsPrincipal(identity),
                new AuthenticationProperties(),
                OpenIdConnectServerDefaults.AuthenticationScheme);
            ticket.SetAccessTokenLifetime(TimeSpan.FromHours(48));
           
            

            return ticket;
        }


        private async Task<AuthenticationTicket> CreateTicketAsync(
            OpenIdConnectRequest request, Users user,
            AuthenticationProperties properties = null)
        {
            // Create a new ClaimsPrincipal containing the claims that
            // will be used to create an id_token, a token or a code.
            var principal = await _signInManager.CreateUserPrincipalAsync(user);
            //principal.AddIdentity(new ClaimsIdentity(new List<Claim>()
            //{
            //    new Claim("org", user.OrganizationId),
            //    new Claim(System.Security.Claims.ClaimTypes.NameIdentifier, user.Id)
            //}));
            var ci = principal.Identity as ClaimsIdentity;
            ci.AddClaim("org", user.OrganizationId);
            ci.AddClaim(OpenIdConnectConstants.Claims.Subject, user.Id);

            if (properties==null)
            {
                properties = new AuthenticationProperties();
            }
          

            // Create a new authentication ticket holding the user identity.
            var ticket = new AuthenticationTicket(principal, properties,
                OpenIdConnectServerDefaults.AuthenticationScheme);

            if (!request.IsAuthorizationCodeGrantType() && !request.IsRefreshTokenGrantType())
            {
                // Set the list of scopes granted to the client application.
                // Note: the offline_access scope must be granted
                // to allow OpenIddict to return a refresh token.
                ticket.SetScopes(new[]
                {
                    OpenIdConnectConstants.Scopes.OpenId,
                    OpenIdConnectConstants.Scopes.Email,
                    OpenIdConnectConstants.Scopes.Profile,
                    OpenIdConnectConstants.Scopes.OfflineAccess,
                    OpenIddictConstants.Scopes.Roles
                }.Intersect(request.GetScopes()));
            }



            // Note: by default, claims are NOT automatically included in the access and identity tokens.
            // To allow OpenIddict to serialize them, you must attach them a destination, that specifies
            // whether they should be included in access tokens, in identity tokens or in both.

            foreach (var claim in ticket.Principal.Claims)
            {
                // Never include the security stamp in the access and identity tokens, as it's a secret value.
                if (claim.Type == _identityOptions.Value.ClaimsIdentity.SecurityStampClaimType)
                {
                    continue;
                }
                

                var destinations = new List<string>
                {
                    OpenIdConnectConstants.Destinations.AccessToken
                };

                // Only add the iterated claim to the id_token if the corresponding scope was granted to the client application.
                // The other claims will only be added to the access_token, which is encrypted when using the default format.
                if ((claim.Type == OpenIdConnectConstants.Claims.Name && ticket.HasScope(OpenIdConnectConstants.Scopes.Profile)) ||
                    (claim.Type == OpenIdConnectConstants.Claims.Email && ticket.HasScope(OpenIdConnectConstants.Scopes.Email)) ||
                    (claim.Type == OpenIdConnectConstants.Claims.Role && ticket.HasScope(OpenIddictConstants.Claims.Roles)))
                {
                    destinations.Add(OpenIdConnectConstants.Destinations.IdentityToken);
                }

                claim.SetDestinations(destinations);
            }

            return ticket;
        }
    }
}