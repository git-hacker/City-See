using AspNet.Security.OAuth.Validation;
using AutoMapper;
using CitySee.AuthorizationCenter.Model;
using CitySee.Core;
using CitySee.Core.Plugin;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.ApplicationParts;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using NLog.Extensions.Logging;
using OpenIddict.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CitySee.AuthorizationCenter
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }
        private static CitySeeContextImpl citySeeContext = null;

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var configuration = new ConfigurationBuilder()
                .AddJsonFile("Config.json")
                .AddEnvironmentVariables()
                .Build();
            services.AddSingleton<IConfigurationRoot>(configuration);
            services.AddMvc();

            services.AddDbContext<CitySeeDbContext>(options =>
            {
                options.UseMySql(configuration["Data:DefaultConnection:ConnectionString"]);
                options.UseOpenIddict();
            });

            services.AddIdentity<IdentityUser, IdentityRole>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequiredLength = 6;
                options.Password.RequireLowercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;

            }).AddEntityFrameworkStores<CitySeeDbContext>().AddDefaultTokenProviders();

            services.AddAuthentication().AddOAuthValidation();

            // Register the OpenIddict services.
            services.AddOpenIddict(options =>
            {
                // Register the Entity Framework stores.
                options.AddEntityFrameworkCoreStores<CitySeeDbContext>();
                options.AddMvcBinders();
                // Enable the authorization, logout, token and userinfo endpoints.
                options.EnableAuthorizationEndpoint("/connect/authorize")
                       .EnableLogoutEndpoint("/connect/logout")
                       .EnableTokenEndpoint("/connect/token");
                // Note: the Mvc.Client sample only uses the code flow and the password flow, but you
                // can enable the other flows if you need to support implicit or client credentials.
                options.AllowAuthorizationCodeFlow()
                       .AllowPasswordFlow()
                       .AllowRefreshTokenFlow()
                       .AllowImplicitFlow()
                       .AllowClientCredentialsFlow();
                options.SetRefreshTokenLifetime(TimeSpan.FromHours(48));
                // Make the "client_id" parameter mandatory when sending a token request.
                options.RequireClientIdentification();
                // When request caching is enabled, authorization and logout requests
                // are stored in the distributed cache by OpenIddict and the user agent
                // is redirected to the same page with a single parameter (request_id).
                // This allows flowing large OpenID Connect requests even when using
                // an external authentication provider like Google, Facebook or Twitter.
                options.EnableRequestCaching();
                // During development, you can disable the HTTPS requirement.
                options.DisableHttpsRequirement();
                // Note: to use JWT access tokens instead of the default
                //// encrypted format, the following lines are required:
                //options.SetAccessTokenLifetime(TimeSpan.FromSeconds(7200));
                //options.UseJsonWebTokens();
                options.AddEphemeralSigningKey();
            });

            citySeeContext = new CitySeeContextImpl(services);
            citySeeContext.PluginConfigStorage = new DefaultPluginConfigStorage();
            citySeeContext.PluginFactory = new DefaultPluginFactory();
            citySeeContext.ConnectionString = configuration["Data:DefaultConnection:ConnectionString"];
            citySeeContext.FileServerRoot = configuration["FileServerRoot"];

            var environment = services.FirstOrDefault(x => x.ServiceType == typeof(IHostingEnvironment))?.ImplementationInstance;
            var apppart = services.FirstOrDefault(x => x.ServiceType == typeof(ApplicationPartManager))?.ImplementationInstance;
            if (apppart != null)
            {
                ApplicationPartManager apm = apppart as ApplicationPartManager;
                CitySeeContextImpl ac = CitySeeContext.Current as CitySeeContextImpl;
                ac.AdditionalAssembly.ForEach((a) =>
                {
                    apm.ApplicationParts.Add(new AssemblyPart(a));
                });
            }
            bool InitIsOk = citySeeContext.Init().Result;
            services.AddUserDefined();
            
            services.AddAutoMapper();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddDebug();
            if (env.IsDevelopment())
            {
                //开发环境下，日志文件输出到控制台（在VS中的输出中查看）
                loggerFactory.AddConsole(Configuration.GetSection("Logging"));
                app.UseDeveloperExceptionPage();
            }
            else
            {
                //非开发环境下，日志采用NLog输出到指定文件中
                loggerFactory.AddNLog();
            }
            app.UseAuthentication();
            app.UseMvc();
            app.UseCors(options =>
            {
                options.AllowAnyHeader();
                options.AllowAnyMethod();
                options.AllowAnyOrigin();
                options.AllowCredentials();
            });
            app.Use(async (context, next) =>
            {
                if (context.Request.Headers.ContainsKey("X-Forwarded-Proto"))
                {
                    //如果存在SLB，且包含原始请求协议，将请求协议重写为原始协议
                    string proto = context.Request.Headers["X-Forwarded-Proto"].FirstOrDefault();
                    if (!String.IsNullOrEmpty(proto))
                    {
                        context.Request.Scheme = proto;
                    }
                }
                await next();
            });
            app.UseStaticFiles();

            app.UseMvcWithDefaultRoute();

            citySeeContext.Provider = app.ApplicationServices;
            InitializeAsync(app.ApplicationServices, CancellationToken.None).GetAwaiter().GetResult();
        }

        private async Task InitializeAsync(IServiceProvider services, CancellationToken cancellationToken)
        {
            using (var scope = services.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                //var context = scope.ServiceProvider.GetRequiredService<CitySeeDbContext>();
                //await context.Database.EnsureCreatedAsync();

                var applicationmanager = scope.ServiceProvider.GetRequiredService<OpenIddict.Core.OpenIddictApplicationManager<OpenIddictApplication>>();
                var usermanager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();

                if (await applicationmanager.FindByClientIdAsync("citysee", cancellationToken) == null)
                {
                    var application = new OpenIddictApplication
                    {
                        ClientId = "citysee",
                        Type = "confidential",
                        DisplayName = "City_See",
                        PostLogoutRedirectUris = "http://localhost:5001",
                        RedirectUris = "http://localhost:5001/callback"
                    };
                    await applicationmanager.CreateAsync(application, "123456", cancellationToken);
                }
                if (await usermanager.FindByIdAsync("admin") == null)
                {
                    var user = new IdentityUser
                    {
                        Id = "admin",
                        PhoneNumber = "13888888888",
                        UserName = "admin",
                        Email = "chenrongku@163.com"
                    };
                    await usermanager.CreateAsync(user, "123456");
                }

                bool StartIsOk = citySeeContext.Start().Result;



            }

        }
    }
}
