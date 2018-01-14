using BuildingComment.Model;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace BuildingComment.Dto.Response
{
    public class CommentResponse
    {
        public string Id { get; set; }
        
        public string BuildingId { get; set; }
        
        public string Content { get; set; }
        
        public bool IsAnonymous { get; set; }
        
        public DateTime CreateTime { get; set; }
        
        public string BuildingName { get; set; }
        
        public string UserName { get; set; }
        
        public string Icon { get; set; }
        
        public int ReplyNum { get; set; }
        
        public int LikeNum { get; set; }

        public IEnumerable<CommentReply> CommentReplies { get; set; }
    }
}
