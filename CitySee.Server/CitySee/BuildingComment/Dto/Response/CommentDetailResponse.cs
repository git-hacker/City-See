using System;
using System.Collections.Generic;
using System.Text;

namespace BuildingComment.Dto.Response
{
    public class CommentDetailResponse
    {
        public string Id { get; set; }

        public string BuildingId { get; set; }

        public string Content { get; set; }

        public bool IsAnonymous { get; set; }

        public DateTime CreateTime { get; set; }

        public string BuildingName { get; set; }

        public string UserName { get; set; }

        public string Icon { get; set; }

        public string ToUserName { get; set; }

    }
}
