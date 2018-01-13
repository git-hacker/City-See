using CitySee.Core.Plugin;
using System;
using CitySee.Core;
using System.Threading.Tasks;

namespace ImageServer
{
    public class ImageServer : IPlugin
    {
        public string PluginID => "5119eee1-b567-4d2b-975a-d1f817b8e574";

        public string PluginName => "Image Upload";

        public string Description => "Image Upload Server";

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
