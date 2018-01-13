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
            });

            services.AddIdentity<IdentityUser, IdentityRole>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequiredLength = 6;
                options.Password.RequireLowercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;

            }).AddEntityFrameworkStores<CitySeeDbContext>().AddDefaultTokenProviders();

            services.AddAuthentication()
                .AddJwtBearer(options =>
                {
                    options.Configuration = new Microsoft.IdentityModel.Protocols.OpenIdConnect.OpenIdConnectConfiguration()
                    {

                    };
                    options.TokenValidationParameters.ValidateAudience = false;
                    options.TokenValidationParameters.ValidateIssuer = false;
                });


            // Register the OpenIddict services.
            services.AddOpenIddict(options =>
            {
                // Register the Entity Framework stores.
                options.AddEntityFrameworkCoreStores<CitySeeDbContext>();
                options.AddMvcBinders();
                // Enable the authorization, logout, token and userinfo endpoints.
                options.EnableAuthorizationEndpoint("/connect/authorize")
                       .EnableLogoutEndpoint("/connect/logout")
                       .EnableTokenEndpoint("/connect/token")
                       .EnableUserinfoEndpoint("/api/userinfo")
                       .EnableIntrospectionEndpoint("/connect/introspect");
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
                // encrypted format, the following lines are required:
                options.SetAccessTokenLifetime(TimeSpan.FromSeconds(3600));
                options.UseJsonWebTokens();
                options.AddEphemeralSigningKey();
            });


            citySeeContext = new CitySeeContextImpl(services);
            citySeeContext.PluginConfigStorage = new DefaultPluginConfigStorage();
            citySeeContext.PluginFactory = new DefaultPluginFactory();

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

            app.UseMvc();

            citySeeContext.Provider = app.ApplicationServices;

            InitializeAsync(app.ApplicationServices, CancellationToken.None).GetAwaiter().GetResult();
        }

        private async Task InitializeAsync(IServiceProvider services, CancellationToken cancellationToken)
        {
            using (var scope = services.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                bool StartIsOk = citySeeContext.Start().Result;

                var context = scope.ServiceProvider.GetRequiredService<CitySeeDbContext>();
                await context.Database.EnsureCreatedAsync();

                
            }

        }
    }
}
