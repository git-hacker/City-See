using CitySee.Core;
using CitySee.Core.Plugin;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace CitySee.AuthorizationCenter
{
    public class CitySeeContextImpl : CitySeeContext
    {
        public CitySeeContextImpl(IServiceCollection serviceCollection)
            : base(serviceCollection)
        {
            string pluginConfigPath = System.IO.Path.Combine(AppContext.BaseDirectory, "PluginConfig");
            if (!System.IO.Directory.Exists(pluginConfigPath))
            {
                System.IO.Directory.CreateDirectory(pluginConfigPath);
            }
            string pluginPath = System.IO.Path.Combine(AppContext.BaseDirectory, "Plugin");
            if (!System.IO.Directory.Exists(pluginPath))
            {
                System.IO.Directory.CreateDirectory(pluginPath);
            }
            //所有程序集
            DirectoryLoader dl = new DirectoryLoader();
            List<Assembly> assList = new List<Assembly>();
            var psl = dl.LoadFromDirectory(pluginPath);
            assList.AddRange(psl);
            AdditionalAssembly = assList;
        }


        public async override Task<bool> Init()
        {
            try
            {
                await base.Init();
                string pluginPath = System.IO.Path.Combine(AppContext.BaseDirectory, "Plugin");
                PluginFactory.Load(pluginPath);
                bool isOk = PluginFactory.Init(this).Result;
                return true;
            }
            catch (ReflectionTypeLoadException ex)
            {
                Console.WriteLine("初始化失败：\r\n{0}", ex.ToString());
                //Logger.Error("load exception：\r\n{0}", ex.ToString());
                if (ex.LoaderExceptions != null)
                {
                    foreach (Exception e in ex.LoaderExceptions)
                    {
                        //Logger.Error("{0}", e.ToString());
                    }
                }
                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine("初始化失败：\r\n{0}", ex.ToString());
                //Logger.Error("init exception：\r\n{0}", ex.ToString());
                return false;
            }
        }

        public async override Task<bool> Start()
        {
            await PluginFactory.Start(this);
            return await base.Start();
        }


    }
}
