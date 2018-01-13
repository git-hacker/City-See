using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CitySee.Core.Plugin
{
    public abstract class PluginBase<TConfig> : PluginBase, IPluginConfig
        where TConfig : class
    {

        protected virtual Task<ResponseMessage> ConfigChanged(CitySeeContext context, TConfig newConfig)
        {
            return Task.FromResult(new ResponseMessage());
        }

        protected abstract TConfig GetDefaultConfig(CitySeeContext context);

        public Type ConfigType
        {
            get
            {
                return typeof(TConfig);
            }
        }

        public TConfig GetConfig()
        {
            TConfig cfg = CitySeeContext.Current.PluginConfigStorage.GetConfig<TConfig>(this.PluginID).Result.Extension;
            if (cfg == null)
            {
                cfg = GetDefaultConfig(CitySeeContext.Current);
            }

            return cfg;
        }

        public async Task<bool> SaveConfig(TConfig cfg)
        {
            var r = await CitySeeContext.Current.PluginConfigStorage.SaveConfig<TConfig>(this.PluginID, cfg);
            return r.Code == "0";
        }

        Task<bool> IPluginConfig.SaveConfig(object cfg)
        {
            return SaveConfig(cfg as TConfig);
        }

        public async Task<bool> DeleteConfig()
        {
            var r = await CitySeeContext.Current.PluginConfigStorage.DeleteConfig(this.PluginID);

            return r.Code == "0";

        }

        public async Task<object> GetConfig(CitySeeContext context)
        {
            var r = await CitySeeContext.Current.PluginConfigStorage.GetConfig<TConfig>(this.PluginID);
            TConfig c = null;
            if (r.Code == "0")
            {
                c = r.Extension;
            }
            if (c == null)
            {
                c = GetDefaultConfig(context);
            }

            return c;

        }

        Task<ResponseMessage> IPluginConfig.ConfigChanged(CitySeeContext context, object newConfig)
        {
            return ConfigChanged(context, newConfig as TConfig);
        }

        object IPluginConfig.GetDefaultConfig(CitySeeContext context)
        {
            return GetDefaultConfig(context);
        }
    }
}
