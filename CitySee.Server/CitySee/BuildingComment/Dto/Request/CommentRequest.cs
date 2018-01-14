using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace BuildingComment.Dto.Request
{
    public class CommentRequest
    {
        /// <summary>
        /// Id
        /// </summary>
        [StringLength(127, ErrorMessage = "评论ID超出长度限制")]
        public string Id { get; set; }

        /// <summary>
        /// 回复建筑Id
        /// </summary>
        [StringLength(127, ErrorMessage = "楼盘ID超出长度限制")]
        public string BuildingId { get; set; }

        /// <summary>
        /// 评论人Id
        /// </summary>
        [StringLength(127, ErrorMessage = "用户ID超出长度限制")]
        public string CustomerId { get; set; }

        /// <summary>
        /// 回复内容
        /// </summary>
        public string Content { get; set; }

        /// <summary>
        /// 是否匿名
        /// </summary>
        public bool IsAnonymous { get; set; }

        public BuildingRequest Building { get; set; }
    }
}
