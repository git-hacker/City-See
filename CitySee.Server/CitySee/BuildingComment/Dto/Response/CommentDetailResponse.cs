using System;
using System.Collections.Generic;
using System.Text;

namespace BuildingComment.Dto.Response
{
    public class CommentDetailResponse
    {
        public string Id { get; set; }
        
        public string CustomerId { get; set; }
        
        public DateTime CreateTime { get; set; }
        
        public string Content { get; set; }
        
        public string ToCustomerId { get; set; }
        
        public string UserName { get; set; }
        
        public string ToCustomerName { get; set; }

    }
}
