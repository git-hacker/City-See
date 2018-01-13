/*
 * Licensed under the Apache License, Version 2.0 (http://www.apache.org/licenses/LICENSE-2.0)
 * See https://github.com/openiddict/openiddict-core for more information concerning
 * the license and the contributors participating to this project.
 */

using AspNet.Security.OpenIdConnect.Primitives;
using CitySee.Core;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace AuthorizationCenter.Controllers
{
    public class ErrorController : BaseController<ErrorController>
    {
        [HttpGet, HttpPost, Route("~/error")]
        public string Error(OpenIdConnectResponse response)
        {
            if (response == null)
            {
                return "error";
            }
            Logger.LogError(JsonHelper.ToJson(response));
            return JsonHelper.ToJson(response);
        }
    }
}