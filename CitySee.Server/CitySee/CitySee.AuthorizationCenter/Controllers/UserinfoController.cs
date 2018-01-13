using AspNet.Security.OAuth.Validation;
using AutoMapper;
using CitySee.AuthorizationCenter.Dto;
using CitySee.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CitySee.AuthorizationCenter.Controllers
{
    [Authorize(AuthenticationSchemes = OAuthValidationDefaults.AuthenticationScheme)]
    [Produces("application/json")]
    [Route("api/userinfos")]
    public class UserinfoController : Controller
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IMapper _mapper;

        public UserinfoController(UserManager<IdentityUser> userManager,
            IMapper mapper)
        {
            _userManager = userManager;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ResponseMessage<UserinfoResponse>> GetUserinfo()
        {
            ResponseMessage<UserinfoResponse> response = new ResponseMessage<UserinfoResponse>();
            try
            {
                var user = await _userManager.GetUserAsync(User);
                if (user == null)
                {
                    response.Code = ResponseCodeDefines.NotFound;
                    response.Message = "user not found";
                }
                var a = _mapper.Map<UserinfoResponse>(user);
                response.Extension = _mapper.Map<UserinfoResponse>(user);
            }
            catch (Exception e)
            {
                response.Code = ResponseCodeDefines.ServiceError;
                response.Message = e.Message;
            }
            return response;
        }

        [HttpPost]
        public async Task<ResponseMessage<IEnumerable<IdentityError>>> PostUserinfo([FromBody]UserinfoRequest userinfoRequest)
        {
            ResponseMessage<IEnumerable<IdentityError>> response = new ResponseMessage<IEnumerable<IdentityError>>();
            if (!ModelState.IsValid)
            {
                response.Code = ResponseCodeDefines.ModelStateInvalid;
                response.Message = ModelState.GetAllErrors();
                return response;
            }
            try
            {
                var user = _mapper.Map<IdentityUser>(userinfoRequest);
                var result = await _userManager.CreateAsync(user);
                if (!result.Succeeded)
                {
                    response.Code = ResponseCodeDefines.ServiceError;
                    response.Message = "inner exceptions";
                    response.Extension = result.Errors;
                }
            }
            catch (Exception e)
            {
                response.Code = ResponseCodeDefines.NotFound;
                response.Message = e.Message;
            }
            return response;
        }

        [HttpPut("{id}")]
        public async Task<ResponseMessage<IEnumerable<IdentityError>>> PutUserinfo([FromRoute]string id, [FromBody]UserinfoRequest userinfoRequest)
        {
            ResponseMessage<IEnumerable<IdentityError>> response = new ResponseMessage<IEnumerable<IdentityError>>();
            if (!ModelState.IsValid)
            {
                response.Code = ResponseCodeDefines.ModelStateInvalid;
                response.Message = ModelState.GetAllErrors();
                return response;
            }
            try
            {
                var user = await _userManager.FindByIdAsync(id);
                if (user == null)
                {
                    response.Code = ResponseCodeDefines.NotFound;
                    response.Message = "user not found";
                }
                user.Email = userinfoRequest.Email;
                user.PhoneNumber = userinfoRequest.PhoneNumber;
                var result = await _userManager.UpdateAsync(user);
                if (!result.Succeeded)
                {
                    response.Code = ResponseCodeDefines.ServiceError;
                    response.Message = "inner excptions";
                    response.Extension = result.Errors;
                }
            }
            catch (Exception e)
            {
                response.Code = ResponseCodeDefines.ServiceError;
                response.Message = e.Message;
            }
            return response;
        }
    }
}
