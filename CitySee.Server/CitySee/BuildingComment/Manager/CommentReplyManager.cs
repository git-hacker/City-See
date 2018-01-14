using AutoMapper;
using BuildingComment.Dto.Common;
using BuildingComment.Dto.Request;
using BuildingComment.Dto.Response;
using BuildingComment.Help;
using BuildingComment.Model;
using BuildingComment.Store;
using CitySee.Core;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BuildingComment.Manager
{
    public class CommentReplyManager
    {
        protected ICommentStore _icommentStore { get; }

        protected ICommentReplyStore _icommentReplyStore { get; }

        protected IMapper _mapper { get; }

        public CommentReplyManager(ICommentReplyStore icommentReplyStore,
            ICommentStore commentStore,
            IMapper mapper)
        {
            _icommentReplyStore = icommentReplyStore ?? throw new ArgumentNullException(nameof(icommentReplyStore));
            _icommentStore = commentStore ?? throw new ArgumentNullException(nameof(commentStore));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        /// <summary>
        /// 根据评论ID获取评论详情
        /// </summary>
        /// <param name="id">请求实体</param>
        /// <param name="condition"></param>
        /// <param name="cancellationToken">验证</param>
        /// <returns></returns>
        public virtual async Task<PagingResponseMessage<CommentDetailResponse>> ListByIdAsync(string id, PageCondition condition, CancellationToken cancellationToken = default(CancellationToken))
        {
            var response = new PagingResponseMessage<CommentDetailResponse>();
            var request = _icommentReplyStore.GetReplyQuery().Where(x => x.CommentId == id);
            response.TotalCount = await request.CountAsync(cancellationToken);
            response.PageIndex = condition.PageIndex;
            response.PageSize = condition.PageSize;
            var query = await request.OrderByDescending(x => x.CreateTime).Skip(condition.PageIndex * condition.PageSize).Take(condition.PageSize).ToListAsync(cancellationToken);
            response.Extension = _mapper.Map<List<CommentDetailResponse>>(query);
            return response;
        }

        /// <summary>
        /// 新增评论信息
        /// </summary>
        /// <param name="userid">创建者</param>
        /// <param name="commentReplyRequest">请求实体</param>
        /// <param name="cancellationToken">验证</param>
        /// <returns></returns>
        public virtual async Task<CommentDetailResponse> CreateAsync(string userid, CommentReplyRequest commentReplyRequest, CancellationToken cancellationToken = default(CancellationToken))
        {

            var commentreply = _mapper.Map<CommentReply>(commentReplyRequest);
            var comment = await _icommentStore.GetAsync(a => a.Where(b => b.Id == commentreply.CommentId), cancellationToken);
            if (comment == null)
                return null;

            FilterHelper filter = new FilterHelper();
            commentReplyRequest.Content = filter.Filter(commentReplyRequest.Content);
            commentreply.Id = Guid.NewGuid().ToString();
            commentreply.CreateTime = DateTime.Now;
            commentreply.CustomerId = userid;

            comment.ReplyNum++;

            var response = await _icommentReplyStore.CreateAsync(commentreply, comment, cancellationToken);
            return _mapper.Map<CommentDetailResponse>(commentreply);
        }

        /// <summary>
        /// 修改评论信息
        /// </summary>
        /// <param name="userid">创建者</param>
        /// <param name="commentReplyRequest">请求实体</param>
        /// <param name="cancellationToken">验证</param>
        /// <returns></returns>
        public virtual async Task UpdateAsync(string userid, CommentReplyRequest commentReplyRequest, CancellationToken cancellationToken = default(CancellationToken))
        {
            var oldcommenreply = await _icommentReplyStore.GetAsync(a => a.Where(b => b.Id == commentReplyRequest.Id && b.CustomerId == userid), cancellationToken);
            if (oldcommenreply == null)
                return;
            oldcommenreply.Content = commentReplyRequest.Content;
            oldcommenreply.IsAnonymous = commentReplyRequest.IsAnonymous;
            await _icommentReplyStore.UpdateAsync(oldcommenreply, cancellationToken);
        }

        /// <summary>
        /// 删除评论信息
        /// </summary>
        /// <param name="userid">创建者</param>
        /// <param name="id">数据id</param>
        /// <param name="cancellationToken">验证</param>
        /// <returns></returns>
        public virtual async Task DeleteAsync(string userid, string id, CancellationToken cancellationToken = default(CancellationToken))
        {
            var response = await _icommentReplyStore.GetAsync(a => a.Where(b => id == b.Id && b.CustomerId == userid));
            var comment = await _icommentStore.GetAsync(a => a.Where(b => b.Id == response.CommentId), cancellationToken);
            if (comment == null)
                return;
            comment.ReplyNum--;
            await _icommentReplyStore.DeleteAsync(response, comment, cancellationToken);
        }
    }
}
