using System;
using System.Collections.Generic;
using System.Text;

namespace ImageServer
{
    public class ImageServerConfig
    {
        public List<PathItem> PathList { get; set; }
    }

    public class PathItem
    {
        public string LocalPath { get; set; }

        public string Url { get; set; }
    }

}
