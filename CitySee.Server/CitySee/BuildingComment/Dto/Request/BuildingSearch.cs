using BuildingComment.Dto.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace BuildingComment.Dto.Request
{
    public class BuildingSearch: PageCondition
    {
        public List<decimal> Longitudes { get; set; }

        public List<decimal> Latitudes { get; set; }
    }
}
