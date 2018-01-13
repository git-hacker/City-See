using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CitySee.Core;

namespace CitySee.AuthorizationCenter.Controllers
{
    [Route("api/test")]
    public class CheckController : Controller
    {
        [HttpGet]
        public ResponseMessage Check()
        {
            return new ResponseMessage();
        }


    }
}