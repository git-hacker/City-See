using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BuildingComment.Model
{
    /// <summary>
    /// 回复
    /// </summary>
    public class Comment
    {
        /// <summary>
        /// Id
        /// </summary>
        [Key]
        [MaxLength(127)]
        public string Id { get; set; }

        /// <summary>
        /// 回复建筑Id
        /// </summary>
        [MaxLength(127)]
        public string BuildingId { get; set; }

        /// <summary>
        /// 评论顶级Id
        /// </summary>
        [MaxLength(127)]
        public string FirstId { get; set; }

        /// <summary>
        /// 回复人ID
        /// </summary>
        [MaxLength(127)]
        public string ToCustomerId { get; set; }

        /// <summary>
        /// 评论上级Id
        /// </summary>
        [MaxLength(127)]
        public string UpId { get; set; }

        /// <summary>
        /// 评论人Id
        /// </summary>
        [MaxLength(127)]
        public string CustomerId { get; set; }

        /// <summary>
        /// 回复内容
        /// </summary>
        public string Content { get; set; }

        /// <summary>
        /// 是否匿名
        /// </summary>
        public bool IsAnonymous { get; set; }

        /// <summary>
        /// 创建日期
        /// </summary>
        public DateTime CreateTime { get; set; }
        
        [NotMapped]
        public string BuildingName { get; set; }

        [NotMapped]
        public string UserName { get; set; }

        [NotMapped]
        public string Icon { get; set; }
      
        public int ReplyNum { get; set; }
    
        public int LikeNum { get; set; }

        [NotMapped]
        public string ToUserName { get; set; }
        
    }
}
