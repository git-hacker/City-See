/*
 * Licensed under the Apache License, Version 2.0 (http://www.apache.org/licenses/LICENSE-2.0)
 * See https://github.com/openiddict/openiddict-core for more information concerning
 * the license and the contributors participating to this project.
 */

using AspNet.Security.OpenIdConnect.Primitives;
using CitySee.Core;
using Microsoft.AspNetCore.Mvc;

namespace AuthorizationCenter.Controllers
{
    public class ErrorController : Controller
    {
        [HttpGet, HttpPost, Route("~/error")]
        public string Error(OpenIdConnectResponse response)
        {
            if (response == null)
            {
                return "error";
            }
            return JsonHelper.ToJson(response);
        }
    }
}