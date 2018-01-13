using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;


namespace AuthorizationCenter.Controllers
{
    public abstract class BaseController<TLogger> : Controller
    {
        private ILogger<TLogger> _logger;

        public ILogger<TLogger> Logger
        {
            get
            {
                if (this._logger != null)
                {
                    return this._logger;
                }
                IServiceProvider expr_1B = base.HttpContext.RequestServices;
                this._logger = ((expr_1B != null) ? expr_1B.GetService<ILogger<TLogger>>() : null);
                return this._logger;
            }
        }
    }
}