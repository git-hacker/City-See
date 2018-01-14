using AspNet.Security.OAuth.Validation;
using AuthorizationCenter.Controllers;
using AutoMapper;
using BuildingComment.Dto.Common;
using BuildingComment.Dto.Request;
using BuildingComment.Dto.Response;
using BuildingComment.Manager;
using CitySee.Core;
using CitySee.Core.Filters;
using CitySee.Core.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace BuildingComment.Controllers
{
    [Authorize(AuthenticationSchemes = OAuthValidationDefaults.AuthenticationScheme)]
    [Produces("application/json")]
    [Route("api/commentreplies")]
    public class CommentReplyController : BaseController<CommentController>
    {
        #region 成员
        private readonly CommentReplyManager _commentReplyManager;
        private readonly IMapper _mapper;

        #endregion

        /// <summary>
        /// 回复控制器
        /// </summary>
        public CommentReplyController(CommentReplyManager commentReplyManager,
             IMapper mapper)
        {
            _commentReplyManager = commentReplyManager ?? throw new ArgumentNullException(nameof(commentReplyManager));
            _mapper = mapper;
        }

        /// <summary>
        /// 新增回复
        /// </summary>
        /// <param name="user"></param>
        /// <param name="commentReplyRequest"></param>
        /// <returns></returns>
        [HttpPost]
        [CheckPermission]
        public async Task<ResponseMessage<CommentDetailResponse>> CreateCommentReply(UserInfo user, [FromBody] CommentReplyRequest commentReplyRequest)
        {
            ResponseMessage<CommentDetailResponse> response = new ResponseMessage<CommentDetailResponse>();
            if (!ModelState.IsValid)
            {
                response.Code = ResponseCodeDefines.ModelStateInvalid;
                response.Message = ModelState.GetAllErrors();
                Logger.LogWarning($"用户{user?.UserName ?? ""}({user?.Id ?? ""})新增回复(CreateCommentReply)模型验证失败：\r\n{response.Message ?? ""}，\r\n请求参数为：\r\n" + (commentReplyRequest != null ? JsonHelper.ToJson(commentReplyRequest) : ""));
                return response;
            }
            try
            {
                response.Extension = await _commentReplyManager.CreateAsync(user.Id, commentReplyRequest, HttpContext.RequestAborted);
            }
            catch (Exception e)
            {
                response.Code = ResponseCodeDefines.ServiceError;
                response.Message = e.Message;
                Logger.LogError($"用户{user?.UserName ?? ""}({user?.Id ?? ""})新增回复(CreateCommentReply)请求失败：\r\n{response.Message ?? ""}，\r\n请求参数为：\r\n" + (commentReplyRequest != null ? JsonHelper.ToJson(commentReplyRequest) : ""));
            }
            return response;
        }

        /// <summary>
        /// 修改回复
        /// </summary>
        /// <param name="user"></param>
        /// <param name="commentReplyRequest"></param>
        /// <returns></returns>
        [HttpPut]
        [CheckPermission]
        public async Task<ResponseMessage> UpdateCommentReply(UserInfo user, [FromBody] CommentReplyRequest commentReplyRequest)
        {
            ResponseMessage<CommentResponse> response = new ResponseMessage<CommentResponse>();
            if (!ModelState.IsValid)
            {
                response.Code = ResponseCodeDefines.ModelStateInvalid;
                response.Message = ModelState.GetAllErrors();
                Logger.LogWarning($"用户{user?.UserName ?? ""}({user?.Id ?? ""})修改回复(UpdateCommentReply)模型验证失败：\r\n{response.Message ?? ""}，\r\n请求参数为：\r\n" + (commentReplyRequest != null ? JsonHelper.ToJson(commentReplyRequest) : ""));
                return response;
            }
            try
            {
                await _commentReplyManager.UpdateAsync(user.Id, commentReplyRequest, HttpContext.RequestAborted);
            }
            catch (Exception e)
            {
                response.Code = ResponseCodeDefines.ServiceError;
                response.Message = e.Message;
                Logger.LogError($"用户{user?.UserName ?? ""}({user?.Id ?? ""})修改回复(UpdateCommentReply)请求失败：\r\n{response.Message ?? ""}，\r\n请求参数为：\r\n" + (commentReplyRequest != null ? JsonHelper.ToJson(commentReplyRequest) : ""));
            }
            return response;
        }

        /// <summary>
        /// 删除回复
        /// </summary>
        /// <param name="user"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        [CheckPermission]
        public async Task<ResponseMessage> DeleteCommentReply(UserInfo user, [FromRoute] string id)
        {
            ResponseMessage<CommentResponse> response = new ResponseMessage<CommentResponse>();
            if (string.IsNullOrEmpty(id))
            {
                response.Code = ResponseCodeDefines.ModelStateInvalid;
                response.Message = "数值不能为空";
                Logger.LogWarning($"用户{user?.UserName ?? ""}({user?.Id ?? ""})删除回复(DeleteCommentReply)模型验证失败：\r\n{response.Message ?? ""}，\r\n请求参数为：\r\n(id){id ?? ""}");
                return response;
            }
            try
            {
                await _commentReplyManager.DeleteAsync(user.Id, id, HttpContext.RequestAborted);
            }
            catch (Exception e)
            {
                response.Code = ResponseCodeDefines.ServiceError;
                response.Message = e.Message;
                Logger.LogError($"用户{user?.UserName ?? ""}({user?.Id ?? ""})删除回复(DeleteCommentReply)请求失败：\r\n{response.Message ?? ""}，\r\n请求参数为：\r\n(id){id ?? ""}");
            }
            return response;
        }

        /// <summary>
        /// 根据评论ID获取评论列表
        /// </summary>
        /// <param name="user"></param>
        /// <param name="commentid"></param>
        /// <param name="condition"></param>
        /// <returns></returns>
        [HttpPost("listbycommentid/{commentid}")]
        [CheckPermission]
        public async Task<ResponseMessage<List<CommentDetailResponse>>> GetListByComentId(UserInfo user, [FromRoute] string commentid, [FromBody]PageCondition condition)
        {
            var response = new ResponseMessage<List<CommentDetailResponse>>();
            if (!ModelState.IsValid && string.IsNullOrEmpty(commentid))
            {
                response.Code = ResponseCodeDefines.ModelStateInvalid;
                response.Message = ModelState.GetAllErrors();
                Logger.LogWarning($"用户{user?.UserName ?? ""}({user?.Id ?? ""})根据评论ID获取评论列表(GetListById)模型验证失败：\r\n{response.Message ?? ""}，\r\n请求参数为：\r\n(commentid){commentid ?? ""}，\r\n请求参数为：\r\n" + (condition != null ? JsonHelper.ToJson(condition) : ""));
                return response;
            }
            try
            {
                response = await _commentReplyManager.ListByIdAsync(commentid, condition, HttpContext.RequestAborted);
            }
            catch (Exception e)
            {
                response.Code = ResponseCodeDefines.ServiceError;
                response.Message = e.Message;
                Logger.LogError($"用户{user?.UserName ?? ""}({user?.Id ?? ""})根据评论ID获取评论列表(GetListById)请求失败：\r\n{response.Message ?? ""}，\r\n请求参数为：\r\n(commentid){commentid ?? ""}，\r\n请求参数为：\r\n" + (condition != null ? JsonHelper.ToJson(condition) : ""));
            }
            return response;
        }
    }
}
