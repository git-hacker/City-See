using System;
using System.Collections.Generic;
using System.Text;

namespace CitySee.Core.Plugin
{
    public class PluginItem
    {
        public string Name { get; set; }

        public string ID { get; set; }

        public int Order { get; set; }

        public String Description { get; set; }

        public bool IsRunning { get; protected set; }

        public bool InitFail { get; protected set; }

        public bool StartFail { get; protected set; }

        public string Message { get; protected set; }

        public bool HasConfig { get; set; }

        public void CopyFrom(PluginItem pi, bool secret = false)
        {
            this.ID = pi.ID;
            this.Name = pi.Name;
            this.Description = pi.Description;
            this.HasConfig = pi.HasConfig;
            this.IsRunning = pi.IsRunning;
            this.Order = pi.Order;
            this.InitFail = pi.InitFail;
            this.StartFail = pi.StartFail;
            this.Message = pi.Message;
        }

    }
}
