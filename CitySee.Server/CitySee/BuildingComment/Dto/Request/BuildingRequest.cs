using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace BuildingComment.Dto.Request
{
    public class BuildingRequest
    {
        [StringLength(127, ErrorMessage = "建筑ID长度超出限制")]
        public string Id { get; set; }

        public string BuildingName { get; set; }

        public decimal Longitude { get; set; }

        public decimal Latitude { get; set; }

        public string Intro { get; set; }

        public string Icon { get; set; }

    }
}
