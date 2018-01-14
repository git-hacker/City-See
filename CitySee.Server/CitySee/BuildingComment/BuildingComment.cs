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
    public class BuildingComment : IPlugin
    {
        public string PluginID => "0b3dfdec-f9d4-4a00-8595-1cfb875b79c4";

        public string PluginName => "building comment";

        public string Description => "building comment server";

        public int Order => 0;

        public Task<ResponseMessage> Init(CitySeeContext context)
        {
            context.Services.AddDbContext<BuildingCommentDbContext>(options => { options.UseMySql(context.ConnectionString); }, ServiceLifetime.Scoped);
            context.Services.AddScoped<CommentManager>();
            context.Services.AddScoped<ICommentStore, CommentStore>();
            context.Services.AddScoped<Store.IGiveLikeStore, GiveLikeStore>();
            context.Services.AddScoped<CommentReplyManager>();
            context.Services.AddScoped<ICommentReplyStore, CommentReplyStore>();
            context.Services.AddScoped<BuildingManager>();
            context.Services.AddScoped<IBuildingStore, BuildingStore>();
            return Task.FromResult(new ResponseMessage());
        }

        public Task OnMainConfigChanged(CitySeeContext context, CitySeeConfig newConfig)
        {
            return Task.CompletedTask;
        }

        public Task<ResponseMessage> Start(CitySeeContext context)
        {
            return Task.FromResult(new ResponseMessage());
        }
    }
}
