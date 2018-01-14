using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace BuildingComment.Dto.Request
{
    public class CommentReplyRequest
    {
        /// <summary>
        /// Id
        /// </summary>
        [StringLength(127, ErrorMessage = "Id超出最大字符串长度")]
        public string Id { get; set; }

        /// <summary>
        /// Id
        /// </summary>
        [MaxLength(127, ErrorMessage = "评论Id超出最大字符串长度")]
        public string CommentId { get; set; }

        /// <summary>
        /// 用户Id
        /// </summary>
        [MaxLength(127, ErrorMessage = "用户Id超出最大字符串长度")]
        public string CustomerId { get; set; }

        /// <summary>
        /// 内容
        /// </summary>
        public string Content { get; set; }

        /// <summary>
        /// 用户Id
        /// </summary>
        [MaxLength(127, ErrorMessage = "回复Id超出最大字符串长度")]
        public string ToCustomerId { get; set; }

        /// <summary>
        /// 是否匿名
        /// </summary>
        public bool IsAnonymous { get; set; }

        /// <summary>
        /// 上级Id
        /// </summary>
        [MaxLength(127, ErrorMessage = "评论上级Id超出最大字符串长度")]
        public string ParentId { get; set; }
    }
}
