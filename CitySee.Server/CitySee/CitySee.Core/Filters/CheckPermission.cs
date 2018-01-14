using CitySee.Core.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Primitives;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CitySee.Core.Filters
{
    public class CheckPermissionAttribute : TypeFilterAttribute
    {
        public CheckPermissionAttribute() : base(typeof(CheckPermissionImpl))
        {

        }
        private class CheckPermissionImpl : IAsyncActionFilter
        {
            public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
            {
                if (context?.HttpContext?.User == null)
                {
                    context.Result = new ContentResult()
                    {
                        Content = "用户未登录",
                        StatusCode = 403
                    };
                    return;
                }
                //直接从令牌获取用户信息
                var identity = context.HttpContext.User;


                UserInfo user = null;
                user = new UserInfo()
                {
                    Id = identity.FindFirst("sub")?.Value,
                    UserName = identity.FindFirst("name")?.Value
                };
                //}
                if (user == null)
                {
                    context.Result = new ContentResult()
                    {
                        Content = "当前用户无效",
                        StatusCode = 403,
                    };
                    return;
                }

                context.ActionArguments.Add("UserId", user.Id);
                if (context.ActionArguments.ContainsKey("User"))
                {
                    context.ActionArguments["User"] = user;
                }

                await next();
            }
        }
    }
}
