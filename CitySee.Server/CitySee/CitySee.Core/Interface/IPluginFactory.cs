using CitySee.Core.Plugin;
using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace CitySee.Core.Interface
{
    public interface IPluginFactory
    {
        List<Assembly> LoadedAssembly { get; }

        IPlugin GetPlugin(string pluginId);
        PluginItem GetPluginInfo(string pluginId, bool secret = false);
        List<PluginItem> GetPluginList(bool secret = false);
        void Load(string pluginPath);


        Task<bool> Init(CitySeeContext context);

        Task<bool> Start(CitySeeContext context);
        
    }
}
