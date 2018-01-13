using System;
using System.ComponentModel.DataAnnotations;

namespace BuildingComment.Model
{
    /// <summary>
    /// 点赞
    /// </summary>
    public class GiveLike
    {
        /// <summary>
        /// 评论Id
        /// </summary>
        [MaxLength(127)]
        public string Id { get; set; }

        /// <summary>
        /// 点赞人id
        /// </summary>
        [MaxLength(127)]
        public string CustomerId { get; set; }

        /// <summary>
        /// 创建日期
        /// </summary>
        public DateTime CreateTime { get; set; }
    }
}
