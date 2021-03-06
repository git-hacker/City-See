﻿using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BuildingComment.Model
{
    /// <summary>
    /// 回复
    /// </summary>
    public class CommentReply
    {
        /// <summary>
        /// Id
        /// </summary>
        [Key]
        [MaxLength(127)]
        public string Id { get; set; }

        /// <summary>
        /// Id
        /// </summary>
        [MaxLength(127)]
        public string CommentId { get; set; }

        /// <summary>
        /// 用户Id
        /// </summary>
        [MaxLength(127)]
        public string CustomerId { get; set; }

        /// <summary>
        /// 创建日期
        /// </summary>
        public DateTime CreateTime { get; set; }

        /// <summary>
        /// 内容
        /// </summary>
        public string Content { get; set; }

        /// <summary>
        /// 回复上级评论ID
        /// </summary>
        public string ParentId { get; set; }

        /// <summary>
        /// 用户Id
        /// </summary>
        [MaxLength(127)]
        public string ToCustomerId { get; set; }

        /// <summary>
        /// 是否匿名
        /// </summary>
        public bool IsAnonymous { get; set; }

        [NotMapped]
        public string UserName { get; set; }

        [NotMapped]
        public string ToCustomerName { get; set; }
    }
}
