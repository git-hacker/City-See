using CitySee.Core.Plugin;
using System;
using CitySee.Core;
using System.Threading.Tasks;

namespace ImageServer
{
    public class ImageServer : IPlugin
    {
        public string PluginID => throw new NotImplementedException();

        public string PluginName => throw new NotImplementedException();

        public string Description => throw new NotImplementedException();

        public int Order => throw new NotImplementedException();

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
