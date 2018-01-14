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
using System.Threading;
using System.Threading.Tasks;

namespace BuildingComment.Manager
{
    public class CommentManager
    {
        protected IGiveLikeStore _igiveLikeStore { get; }

        protected ICommentStore _icommentStore { get; }

        protected IBuildingStore _ibuildingStore { get; }

        protected IMapper _mapper { get; }

        public CommentManager(ICommentStore icommentStore,
            IGiveLikeStore igiveLikeStore,
            IBuildingStore buildingStore,
            IMapper mapper)
        {
            _igiveLikeStore = igiveLikeStore ?? throw new ArgumentNullException(nameof(igiveLikeStore));
            _icommentStore = icommentStore ?? throw new ArgumentNullException(nameof(icommentStore));
            _ibuildingStore = buildingStore ?? throw new ArgumentNullException(nameof(buildingStore));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        /// <summary>
        /// 新增评论信息
        /// </summary>
        /// <param name="userid">创建者</param>
        /// <param name="commentRequest">请求实体</param>
        /// <param name="cancellationToken">验证</param>
        /// <returns></returns>
        public virtual async Task<CommentResponse> CreateAsync(string userid, CommentRequest commentRequest, CancellationToken cancellationToken = default(CancellationToken))
        {
            var bulding = await _ibuildingStore.GetAsync(a => a.Where(b => b.Id == commentRequest.BuildingId));
            if (bulding == null)
                return null;
            bulding.CommentNum++;

            var comment = _mapper.Map<Comment>(commentRequest);

            FilterHelper filter = new FilterHelper();
            commentRequest.Content = filter.Filter(commentRequest.Content);
            comment.Id = Guid.NewGuid().ToString();
            comment.CreateTime = DateTime.Now;
            comment.CustomerId = userid;
            var response = await _icommentStore.CreateAsync(comment, bulding, cancellationToken);
            return _mapper.Map<CommentResponse>(response);
        }



        /// <summary>
        /// 修改评论信息
        /// </summary>
        /// <param name="userid">创建者</param>
        /// <param name="commentRequest">请求实体</param>
        /// <param name="cancellationToken">验证</param>
        /// <returns></returns>
        public virtual async Task UpdateAsync(string userid, CommentRequest commentRequest, CancellationToken cancellationToken = default(CancellationToken))
        {
            var oldcommen = await _icommentStore.GetAsync(a => a.Where(b => b.Id == commentRequest.Id && b.CustomerId == userid), cancellationToken);
            if (oldcommen == null)
                return;
            oldcommen.Content = commentRequest.Content;
            oldcommen.IsAnonymous = commentRequest.IsAnonymous;
            await _icommentStore.UpdateAsync(oldcommen, cancellationToken);
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

            var response = await _icommentStore.GetAsync(a => a.Where(b => id == b.Id && b.CustomerId == userid));
            var bulding = await _ibuildingStore.GetAsync(a => a.Where(b => b.Id == response.BuildingId));
            if (bulding == null)
                return;
            bulding.CommentNum--;
            await _icommentStore.DeleteAsync(response, bulding, cancellationToken);
        }

        /// <summary>
        /// 验证点赞
        /// </summary>
        /// <param name="userid"></param>
        /// <param name="id">评论ID</param>
        /// <param name="cancellationToken">验证</param>
        /// <returns></returns>
        public virtual async Task<bool> ValGiveLike(string userid, string id, CancellationToken cancellationToken = default(CancellationToken))
        {
            var query = await _igiveLikeStore.GetAsync(a => a.Where(b => b.Id == id && b.CustomerId == userid));
            return query != null;
        }

        /// <summary>
        /// 点赞
        /// </summary>
        /// <param name="userid">创建者</param>
        /// <param name="id">评论ID</param>
        /// <param name="cancellationToken">验证</param>
        /// <returns></returns>
        public virtual async Task CreateGiveLikeAsync(string userid, string id, CancellationToken cancellationToken = default(CancellationToken))
        {

            var comment = await _icommentStore.GetAsync(a => a.Where(b => b.Id == id), cancellationToken);
            if (comment == null)
                return;
            var like = new GiveLike();
            like.Id = id;
            like.CreateTime = DateTime.Now;
            like.CustomerId = userid;
            comment.LikeNum++;

            await _igiveLikeStore.CreateAsync(like, comment, cancellationToken);
        }

        /// <summary>
        /// 取消点赞
        /// </summary>
        /// <param name="userid"></param>
        /// <param name="id">评论ID</param>
        /// <param name="cancellationToken">验证</param>
        /// <returns></returns>
        public virtual async Task CancelGiveLikeAsync(string userid, string id, CancellationToken cancellationToken = default(CancellationToken))
        {
            var comment = await _icommentStore.GetAsync(a => a.Where(b => b.Id == id), cancellationToken);
            if (comment == null)
                return;
            comment.LikeNum--;
            await _igiveLikeStore.DeleteAsync(new GiveLike() { Id = id, CustomerId = userid }, comment, cancellationToken);
        }

        /// <summary>
        /// 根据用户ID获取评论
        /// </summary>
        /// <param name="userid">请求实体</param>
        /// <param name="condition"></param>
        /// <param name="cancellationToken">验证</param>
        /// <returns></returns>
        public virtual async Task<PagingResponseMessage<CommentResponse>> ListByUserIdAsync(string userid, PageCondition condition, CancellationToken cancellationToken = default(CancellationToken))
        {
            var response = new PagingResponseMessage<CommentResponse>();
            var result = _icommentStore.GetCommentQuery().Where(x => x.CustomerId == userid);
            response.TotalCount = await result.CountAsync(cancellationToken);
            var query = await result.OrderByDescending(x => x.CreateTime).Skip(condition.PageSize * condition.PageIndex).Take(condition.PageSize).ToListAsync(cancellationToken);

            query = query.Select(x =>
            {
                if (x.CommentFileInfo?.Count() > 0)
                {
                    var f = x.CommentFileInfo.Select(a => a.FileGuid).Distinct();
                    foreach (var item in f)
                    {
                        var f1 = x.CommentFileInfo.Where(a => a.FileGuid == item).ToList();
                        if (f1?.Count > 0)
                        {
                            x.FileList.Add(ConvertToFileItem(item, f1));
                        }
                    }
                }

                return x;
            }).ToList();


            response.PageSize = condition.PageSize;
            response.PageSize = condition.PageSize;
            response.Extension = _mapper.Map<List<CommentResponse>>(query); ;


            return response;
        }

        private FileItemResponse ConvertToFileItem(string fileGuid, List<FileInfo> fl)
        {
            FileItemResponse fi = new FileItemResponse();
            fi.FileGuid = fileGuid;
            fi.Icon = fl.FirstOrDefault(x => x.Type == "ICON")?.Uri;
            fi.Original = fl.FirstOrDefault(x => x.Type == "ORIGINAL")?.Uri;
            fi.Medium = fl.FirstOrDefault(x => x.Type == "MEDIUM")?.Uri;
            fi.Small = fl.FirstOrDefault(x => x.Type == "SMALL")?.Uri;

            string fr = CitySee.Core.CitySeeContext.Current.FileServerRoot;
            fr = (fr ?? "").TrimEnd('/');
            if (!String.IsNullOrEmpty(fi.Icon))
            {
                fi.Icon = fr + "/" + fi.Icon.TrimStart('/');
            }
            if (!String.IsNullOrEmpty(fi.Original))
            {
                fi.Original = fr + "/" + fi.Original.TrimStart('/');
            }
            if (!String.IsNullOrEmpty(fi.Medium))
            {
                fi.Medium = fr + "/" + fi.Medium.TrimStart('/');
            }
            if (!String.IsNullOrEmpty(fi.Small))
            {
                fi.Small = fr + "/" + fi.Small.TrimStart('/');
            }
            return fi;
        }

        /// <summary>
        /// 根据建筑IDs获取评论
        /// </summary>
        /// <param name="condition"></param>
        /// <param name="cancellationToken">验证</param>
        /// <returns></returns>
        public virtual async Task<PagingResponseMessage<CommentResponse>> ListByBuildingIdAsync(CommentSearch condition, CancellationToken cancellationToken = default(CancellationToken))
        {
            var response = new PagingResponseMessage<CommentResponse>();
            var result = _icommentStore.GetCommentQuery().Where(x => condition.Buildings.Contains(x.BuildingId));
            response.TotalCount = await result.CountAsync(cancellationToken);
            var query = await result.OrderByDescending(x => x.CreateTime).Skip(condition.PageSize * condition.PageIndex).Take(condition.PageSize).ToListAsync(cancellationToken);
            response.PageSize = condition.PageSize;
            response.PageSize = condition.PageSize;
            response.Extension = _mapper.Map<List<CommentResponse>>(query);
            return response;
        }

        /// <summary>
        /// 图片处理
        /// </summary>
        /// <param name="commentId"></param>
        /// <param name="imagePath"></param>
        /// <returns></returns>
        private async Task ImageExcute(string commentId, string imagePath)
        {
            await _icommentStore.CreateImageAsync(commentId, imagePath);
        }

    }
}
