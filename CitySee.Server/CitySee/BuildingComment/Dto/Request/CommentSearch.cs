using BuildingComment.Dto.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace BuildingComment.Dto.Request
{
    public class CommentSearch : PageCondition
    {
        public List<string> Buildings { get; set; }
    }
}
