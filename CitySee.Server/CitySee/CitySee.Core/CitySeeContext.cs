using CitySee.Core.Interface;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Reflection;
using System.Threading.Tasks;

namespace CitySee.Core
{
    public class CitySeeContext
    {
        public List<Assembly> AdditionalAssembly { get; set; }

        public IServiceCollection Services { get; protected set; }

        public static CitySeeContext Current { get; private set; }

        public IServiceProvider Provider { get; set; }

        public IPluginConfigStorage PluginConfigStorage { get; set; }

        public IPluginFactory PluginFactory { get; set; }

        public CitySeeConfig Config { get; protected set; }

        public string ConnectionString { get; set; }

        public string FileServerRoot { get; set; }

        public CitySeeContext(IServiceCollection serviceContainer)
        {
            Current = this;
            Services = serviceContainer;
        }
        
        public async virtual Task<bool> Init()
        {
            return true;
        }

        public async virtual Task<bool> Start()
        {
            return true;
        }

    }
}
