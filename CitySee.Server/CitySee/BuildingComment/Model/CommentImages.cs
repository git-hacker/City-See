using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace BuildingComment.Model
{
    public class CommentImages
    {
        [MaxLength(127)]
        public string CommentId { get; set; }
        [MaxLength(127)]
        public string FileGuid { get; set; }
        [MaxLength(255)]
        public string From { get; set; }
        public int FileType { get; set; }
        public DateTime CreateTime { get; set; }
    }
}
