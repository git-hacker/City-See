using CitySee.Core.Interface;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CitySee.Core.Plugin
{
    public class DefaultPluginConfigStorage : IPluginConfigStorage
    {
        public Task<ResponseMessage> DeleteConfig(string pluginId)
        {
            ResponseMessage r = new ResponseMessage();
            string cfgFile = GetConfigPath(pluginId);
            if (System.IO.File.Exists(cfgFile))
            {
                try
                {
                    System.IO.File.Delete(cfgFile);
                }
                catch (Exception e)
                {
                    r.Code = "500";
                    r.Message = e.Message;
                }
            }
            return Task.FromResult(r);
        }

        public Task<ResponseMessage<TConfig>> GetConfig<TConfig>(string pluginId)
        {
            ResponseMessage<TConfig> r = new ResponseMessage<TConfig>();
            string cfgFile = GetConfigPath(pluginId);
            if (System.IO.File.Exists(cfgFile))
            {
                try
                {
                    string json = System.IO.File.ReadAllText(cfgFile);
                    TConfig cfg = (TConfig)JsonHelper.ToObject(json, typeof(TConfig));
                    r.Extension = cfg;
                }
                catch (Exception e)
                {
                    r.Code = "500";
                    r.Message = e.Message;
                }
            }
            else
            {
                r.Code = "404";
            }
            return Task.FromResult(r);
        }

        public Task<ResponseMessage> SaveConfig<TConfig>(string pluginId, TConfig config)
        {
            ResponseMessage r = new ResponseMessage();
            string cfgFile = GetConfigPath(pluginId);
            if (config == null)
                return Task.FromResult(r);
            try
            {
                string json = "";
                if (config != null)
                {
                    json = JsonHelper.ToJson(config);
                }

                System.IO.File.WriteAllText(cfgFile, json);
            }
            catch (Exception e)
            {
                r.Code = "500";
                r.Message = e.Message;
            }

            return Task.FromResult(r);
        }


        protected virtual string GetConfigPath(string pluginId)
        {
            string path = System.IO.Path.Combine(AppContext.BaseDirectory, "Config");
            if (!System.IO.Directory.Exists(path))
            {
                System.IO.Directory.CreateDirectory(path);
            }

            return System.IO.Path.Combine(path, (pluginId ?? "none") + ".json");
        }
    }
}
