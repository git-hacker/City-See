using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CitySee.Core.Interface
{
    public interface IPluginConfigStorage
    {

        /// <summary>
        /// 获取插件配置
        /// </summary>
        /// <typeparam name="TConfig"></typeparam>
        /// <param name="pluginId"></param>
        /// <returns></returns>
        Task<ResponseMessage<TConfig>> GetConfig<TConfig>(string pluginId);

        /// <summary>
        /// 保存插件配置
        /// </summary>
        /// <typeparam name="TConfig"></typeparam>
        /// <param name="config"></param>
        /// <returns></returns>
        Task<ResponseMessage> SaveConfig<TConfig>(string pluginId, TConfig config);

        /// <summary>
        /// 删除插件配置
        /// </summary>
        /// <param name="pluginId"></param>
        /// <returns></returns>
        Task<ResponseMessage> DeleteConfig(string pluginId);
    }
}
