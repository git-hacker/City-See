using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CitySee.Core.Plugin
{
    public interface IPlugin
    {
        string PluginID { get; }

        string PluginName { get; }

        string Description { get; }

        int Order { get; }


        Task<ResponseMessage> Init(CitySeeContext context);

        Task<ResponseMessage> Start(CitySeeContext context);
        

        Task OnMainConfigChanged(CitySeeContext context, CitySeeConfig newConfig);
    }
}
