using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CitySee.Core.Plugin
{
    public interface IPluginConfig
    {
        Type ConfigType { get; }

        Task<object> GetConfig(CitySeeContext context);

        Task<bool> SaveConfig(object cfg);

        object GetDefaultConfig(CitySeeContext context);

        Task<ResponseMessage> ConfigChanged(CitySeeContext context, object newConfig);


    }
}
