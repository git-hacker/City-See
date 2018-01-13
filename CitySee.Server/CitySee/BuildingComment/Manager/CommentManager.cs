using AutoMapper;
using BuildingComment.Dto.Common;
using BuildingComment.Dto.Request;
using BuildingComment.Dto.Response;
using BuildingComment.Model;
using BuildingComment.Store;
using CitySee.Core;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace BuildingComment.Manager
{
    public class CommentManager
    {
        protected IGiveLikeStore _igiveLikeStore { get; }

        protected ICommentStore _icommentStore { get; }

        protected IMapper _mapper { get; }

        public CommentManager(ICommentStore icommentStore,
            IGiveLikeStore igiveLikeStore,
            IMapper mapper)
        {
            _igiveLikeStore = igiveLikeStore ?? throw new ArgumentNullException(nameof(igiveLikeStore));
            _icommentStore = icommentStore ?? throw new ArgumentNullException(nameof(icommentStore));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        /// <summary>
        /// 新增评论信息
        /// </summary>
        /// <param name="user">创建者</param>
        /// <param name="commentRequest">请求实体</param>
        /// <param name="cancellationToken">验证</param>
        /// <returns></returns>
        public virtual async Task<CommentResponse> CreateAsync(CommentRequest commentRequest, CancellationToken cancellationToken = default(CancellationToken))
        {
            var comment = _mapper.Map<Comment>(commentRequest);
            comment.Id = Guid.NewGuid().ToString();
            comment.CreateTime = DateTime.Now;
            if (comment.UpId == "0")
                comment.FirstId = comment.Id;
            else
                comment.FirstId = (await _icommentStore.GetAsync(a => a.Where(y => y.Id == comment.UpId))).FirstId;
            //这里有customerid
            var response = await _icommentStore.CreateAsync(comment, cancellationToken);
            return _mapper.Map<CommentResponse>(response);
        }

        /// <summary>
        /// 修改评论信息
        /// </summary>
        /// <param name="user">创建者</param>
        /// <param name="commentRequest">请求实体</param>
        /// <param name="cancellationToken">验证</param>
        /// <returns></returns>
        public virtual async Task UpdateAsync(CommentRequest commentRequest, CancellationToken cancellationToken = default(CancellationToken))
        {
            //这里有customerid
            var oldcommen = await _icommentStore.GetAsync(a => a.Where(b => b.Id == commentRequest.Id), cancellationToken);
            if (oldcommen == null)
                return;
            oldcommen.Content = commentRequest.Content;


            await _icommentStore.UpdateAsync(oldcommen, cancellationToken);
        }

        /// <summary>
        /// 删除评论信息
        /// </summary>
        /// <param name="user">创建者</param>
        /// <param name="ids">数据id集</param>
        /// <param name="cancellationToken">验证</param>
        /// <returns></returns>
        public virtual async Task DeleteAsync(List<string> ids, CancellationToken cancellationToken = default(CancellationToken))
        {
            //这里面有customerid做验证
            var response = await _icommentStore.ListAsync(a => a.Where(b => ids.Contains(b.Id)));
            await _icommentStore.DeleteListAsync(response, cancellationToken);
        }

        /// <summary>
        /// 验证是否能够取消点赞
        /// </summary>
        /// <param name="id">评论ID</param>
        /// <param name="cancellationToken">验证</param>
        /// <returns></returns>
        public virtual async Task<bool> ValCancelGiveLike(string id, CancellationToken cancellationToken = default(CancellationToken))
        {
            //这里面有customerid做验证
            var query = await _igiveLikeStore.GetAsync(a => a.Where(b => b.Id == id));
            return query != null;
        }

        /// <summary>
        /// 点赞
        /// </summary>
        /// <param name="user">创建者</param>
        /// <param name="id">评论ID</param>
        /// <param name="cancellationToken">验证</param>
        /// <returns></returns>
        public virtual async Task CreateGiveLikeAsync(string id, CancellationToken cancellationToken = default(CancellationToken))
        {
            var like = new GiveLike();
            like.Id = id;
            like.CreateTime = DateTime.Now;
            //这里有customerid

            await _igiveLikeStore.CreateAsync(like, cancellationToken);
        }

        /// <summary>
        /// 取消点赞
        /// </summary>
        /// <param name="id">评论ID</param>
        /// <param name="cancellationToken">验证</param>
        /// <returns></returns>
        public virtual async Task CancelGiveLikeAsync(string id, CancellationToken cancellationToken = default(CancellationToken))
        {
            await _igiveLikeStore.DeleteAsync(new GiveLike() { Id = id }, cancellationToken);
        }

        /// <summary>
        /// 根据建筑ID获取评论
        /// </summary>
        /// <param name="user">创建者</param>
        /// <param name="buildingid">请求实体</param>
        /// <param name="condition"></param>
        /// <param name="cancellationToken">验证</param>
        /// <returns></returns>
        public virtual async Task<PagingResponseMessage<CommentResponse>> ListByBuildingIdAsync(string buildingid, PageCondition condition, CancellationToken cancellationToken = default(CancellationToken))
        {
            var response = new PagingResponseMessage<CommentResponse>();
            var result = _icommentStore.GetCommentQuery().Where(x => x.BuildingId == buildingid && x.UpId == "0");
            response.TotalCount = await result.CountAsync(cancellationToken);
            var query = await result.OrderByDescending(x => x.CreateTime).Skip(condition.PageSize * condition.PageIndex).Take(condition.PageSize).ToListAsync(cancellationToken);
            response.PageSize = condition.PageSize;
            response.PageSize = condition.PageSize;
            response.Extension = _mapper.Map<List<CommentResponse>>(query);
            return response;
        }

        /// <summary>
        /// 根据评论ID获取评论详情
        /// </summary>
        /// <param name="user">创建者</param>
        /// <param name="id">请求实体</param>
        /// <param name="condition"></param>
        /// <param name="cancellationToken">验证</param>
        /// <returns></returns>
        public virtual async Task<List<CommentResponse>> ListByIdAsync(string id, PageCondition condition, CancellationToken cancellationToken = default(CancellationToken))
        {
            var request = await _icommentStore.GetCommentDetail().Where(x => x.FirstId == id).ToListAsync(cancellationToken);
            return _mapper.Map<List<CommentResponse>>(request);
        }
    }
}
