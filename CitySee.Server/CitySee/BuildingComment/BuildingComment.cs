using CitySee.Core.Plugin;
using System;
using CitySee.Core;
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
            throw new NotImplementedException();
        }

        public Task OnMainConfigChanged(CitySeeContext context, CitySeeConfig newConfig)
        {
            throw new NotImplementedException();
        }

        public Task<ResponseMessage> Start(CitySeeContext context)
        {
            throw new NotImplementedException();
        }
    }
}
