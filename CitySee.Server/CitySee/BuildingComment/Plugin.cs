using BuildingComment.Manager;
using BuildingComment.Model.Context;
using BuildingComment.Store;
using CitySee.Core;
using CitySee.Core.Plugin;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace BuildingComment
{
    public class Plugin : PluginBase
    {
        public override string PluginID
        {
            get
            {
                return "44E9B98F-9971-4A39-82A6-299E94BE6A54";
            }
        }

        public override string PluginName
        {
            get
            {
                return "评论管理";
            }
        }

        public override string Description
        {
            get
            {
                return "评论管理插件";
            }
        }
        public override Task<ResponseMessage> Init(CitySeeContext context)
        {
            context.Services.AddDbContext<BuildingCommentDbContext>(options => { options.UseMySql(context.ConnectionString); }, ServiceLifetime.Scoped);
            context.Services.AddScoped<CommentManager>();
            context.Services.AddScoped<ICommentStore, CommentStore>();
            context.Services.AddScoped<IGiveLikeStore, GiveLikeStore>();
            return base.Init(context);
        }


        public override Task<ResponseMessage> Start(CitySeeContext context)
        {
            return base.Start(context);
        }

    }
}
