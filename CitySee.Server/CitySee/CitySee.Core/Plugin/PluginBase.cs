using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CitySee.Core.Plugin
{
    public abstract class PluginBase : IPlugin
    {
        public static readonly int DefaultOrder = 1000;

        public abstract string Description { get; }

        public virtual int Order
        {
            get
            {
                return DefaultOrder;
            }
        }
        public abstract string PluginID { get; }
        public abstract string PluginName { get; }

        public virtual Task<ResponseMessage> Init(CitySeeContext context)
        {
            return Task.FromResult(new ResponseMessage());
        }
        public virtual Task<ResponseMessage> Start(CitySeeContext context)
        {
            return Task.FromResult(new ResponseMessage());
        }
      

        public virtual Task OnMainConfigChanged(CitySeeContext context, CitySeeConfig newConfig)
        {
            return Task.CompletedTask;
        }
    }
}
