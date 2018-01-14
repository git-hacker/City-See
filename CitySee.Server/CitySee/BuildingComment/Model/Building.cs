using System;
using System.Collections.Generic;
using System.Text;

namespace BuildingComment.Model
{
    public class Building
    {
        public string Id { get; set; }

        public string BuildingName { get; set; }

        public decimal Longitude { get; set; }

        public decimal Latitude { get; set; }

        public string Intro { get; set; }

        public string Icon { get; set; }

        public long CommentNum { get; set; }

        public DateTime CreateTime { get; set; }
    }
}
