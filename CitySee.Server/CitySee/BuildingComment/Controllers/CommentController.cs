using AuthorizationCenter.Controllers;
using AspNet.Security.OAuth.Validation;
using AutoMapper;
using BuildingComment.Dto.Common;
using BuildingComment.Dto.Request;
using BuildingComment.Dto.Response;
using BuildingComment.Manager;
using CitySee.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using CitySee.Core.Filters;
using CitySee.Core.Model;
using Microsoft.Extensions.Logging;

namespace BuildingComment.Controllers
{
    [Authorize(AuthenticationSchemes = OAuthValidationDefaults.AuthenticationScheme)]
    [Produces("application/json")]
    [Route("api/comments")]
    public class CommentController : BaseController<CommentController>
    {
        #region 成员
        private readonly CommentManager _commentManager;
        private readonly IMapper _mapper;

        #endregion

        /// <summary>
        /// 评论控制器
        /// </summary>
        public CommentController(CommentManager commentManager,
             IMapper mapper)
        {
            _commentManager = commentManager ?? throw new ArgumentNullException(nameof(commentManager));
            _mapper = mapper;
        }

        /// <summary>
        /// 新增评论
        /// </summary>
        /// <param name="user"></param>
        /// <param name="commentRequest"></param>
        /// <returns></returns>
        [HttpPost]
        [CheckPermission]
        public async Task<ResponseMessage<CommentResponse>> CreateComment(UserInfo user, [FromBody] CommentRequest commentRequest)
        {
            ResponseMessage<CommentResponse> response = new ResponseMessage<CommentResponse>();
            if (!ModelState.IsValid)
            {
                response.Code = ResponseCodeDefines.ModelStateInvalid;
                response.Message = ModelState.GetAllErrors();
                Logger.LogWarning($"用户{user?.UserName ?? ""}({user?.Id ?? ""})新增评论(CreateComment)模型验证失败：\r\n{response.Message ?? ""}，\r\n请求参数为：\r\n" + (commentRequest != null ? JsonHelper.ToJson(commentRequest) : ""));
                return response;
            }
            try
            {
                response.Extension = await _commentManager.CreateAsync(user.Id, commentRequest, HttpContext.RequestAborted);
            }
            catch (Exception e)
            {
                response.Code = ResponseCodeDefines.ServiceError;
                response.Message = e.Message;
                Logger.LogError($"用户{user?.UserName ?? ""}({user?.Id ?? ""})新增评论(CreateComment)请求失败：\r\n{response.Message ?? ""}，\r\n请求参数为：\r\n" + (commentRequest != null ? JsonHelper.ToJson(commentRequest) : ""));
            }
            return response;
        }

        /// <summary>
        /// 修改评论
        /// </summary>
        /// <param name="user"></param>
        /// <param name="commentRequest"></param>
        /// <returns></returns>
        [HttpPut]
        [CheckPermission]
        public async Task<ResponseMessage> UpdateComment(UserInfo user, [FromBody] CommentRequest commentRequest)
        {
            ResponseMessage<CommentResponse> response = new ResponseMessage<CommentResponse>();
            if (!ModelState.IsValid)
            {
                response.Code = ResponseCodeDefines.ModelStateInvalid;
                response.Message = ModelState.GetAllErrors();
                Logger.LogWarning($"用户{user?.UserName ?? ""}({user?.Id ?? ""})修改评论(UpdateComment)模型验证失败：\r\n{response.Message ?? ""}，\r\n请求参数为：\r\n" + (commentRequest != null ? JsonHelper.ToJson(commentRequest) : ""));
                return response;
            }
            try
            {
                await _commentManager.UpdateAsync(user.Id, commentRequest, HttpContext.RequestAborted);
            }
            catch (Exception e)
            {
                response.Code = ResponseCodeDefines.ServiceError;
                response.Message = e.Message;
                Logger.LogError($"用户{user?.UserName ?? ""}({user?.Id ?? ""})修改评论(UpdateComment)请求失败：\r\n{response.Message ?? ""}，\r\n请求参数为：\r\n" + (commentRequest != null ? JsonHelper.ToJson(commentRequest) : ""));
            }
            return response;
        }

        /// <summary>
        /// 删除评论
        /// </summary>
        /// <param name="user"></param>
        /// <param name="ids"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        [CheckPermission]
        public async Task<ResponseMessage> DeleteComment(UserInfo user, [FromRoute] string id)
        {
            ResponseMessage<CommentResponse> response = new ResponseMessage<CommentResponse>();
            if (string.IsNullOrEmpty(id))
            {
                response.Code = ResponseCodeDefines.ModelStateInvalid;
                response.Message = "数值不能为空";
                Logger.LogWarning($"用户{user?.UserName ?? ""}({user?.Id ?? ""})删除评论(DeleteComment)模型验证失败：\r\n{response.Message ?? ""}，\r\n请求参数为：\r\n(id){id ?? ""}");
                return response;
            }
            try
            {
                await _commentManager.DeleteAsync(user.Id, new List<string> { id }, HttpContext.RequestAborted);
            }
            catch (Exception e)
            {
                response.Code = ResponseCodeDefines.ServiceError;
                response.Message = e.Message;
                Logger.LogError($"用户{user?.UserName ?? ""}({user?.Id ?? ""})删除评论(DeleteComment)请求失败：\r\n{response.Message ?? ""}，\r\n请求参数为：\r\n(id){id ?? ""}");
            }
            return response;
        }

        /// <summary>
        /// 点赞
        /// </summary>
        /// <param name="user"></param>
        /// <param name="id">评论Id</param>
        /// <returns></returns>
        [HttpPut("like/{id}")]
        [CheckPermission]
        public async Task<ResponseMessage<bool>> GiveLike(UserInfo user, [FromRoute] string id)
        {
            ResponseMessage<bool> response = new ResponseMessage<bool>();
            if (!ModelState.IsValid)
            {
                response.Code = ResponseCodeDefines.ModelStateInvalid;
                response.Message = ModelState.GetAllErrors();
                Logger.LogWarning($"用户{user?.UserName ?? ""}({user?.Id ?? ""})点赞(GiveLike)模型验证失败：\r\n{response.Message ?? ""}，\r\n请求参数为：\r\n(id){id ?? ""}");
                return response;
            }
            try
            {
                if (!await _commentManager.ValGiveLike(user.Id, id))
                {
                    await _commentManager.CreateGiveLikeAsync(user.Id, id, HttpContext.RequestAborted);
                }
                else
                {
                    await _commentManager.CancelGiveLikeAsync(id, HttpContext.RequestAborted);
                }
            }
            catch (Exception e)
            {
                response.Code = ResponseCodeDefines.ServiceError;
                response.Message = e.Message;
                Logger.LogError($"用户{user?.UserName ?? ""}({user?.Id ?? ""})点赞(GiveLike)请求失败：\r\n{response.Message ?? ""}，\r\n请求参数为：\r\n(id){id ?? ""}");
            }
            return response;
        }

        /// <summary>
        /// 根据楼盘获取评论列表
        /// </summary>
        /// <param name="user"></param>
        /// <param name="buildingid"></param>
        /// <param name="condition"></param>
        /// <returns></returns>
        [HttpPost("mylist")]
        [CheckPermission]
        public async Task<PagingResponseMessage<CommentResponse>> GetListByUser(UserInfo user, [FromBody]PageCondition condition)
        {
            var response = new PagingResponseMessage<CommentResponse>();
            return response;
        }


        /// <summary>
        /// 根据楼盘获取评论列表
        /// </summary>
        /// <param name="user"></param>
        /// <param name="buildingid"></param>
        /// <param name="condition"></param>
        /// <returns></returns>
        [HttpPost("list/{buildingid}")]
        [CheckPermission]
        public async Task<PagingResponseMessage<CommentResponse>> GetListByBuildingId(UserInfo user, [FromRoute] string buildingid, [FromBody]PageCondition condition)
        {
            var response = new PagingResponseMessage<CommentResponse>();
            if (!ModelState.IsValid && string.IsNullOrEmpty(buildingid))
            {
                response.Code = ResponseCodeDefines.ModelStateInvalid;
                response.Message = ModelState.GetAllErrors();
                Logger.LogWarning($"用户{user?.UserName ?? ""}({user?.Id ?? ""})根据楼盘获取评论列表(GetListByBuildingId)模型验证失败：\r\n{response.Message ?? ""}，\r\n请求参数为：\r\n(buildingid){buildingid ?? ""}，\r\n请求参数为：\r\n" + (condition != null ? JsonHelper.ToJson(condition) : ""));
                return response;
            }
            try
            {
                response = await _commentManager.ListByBuildingIdAsync(buildingid, condition, HttpContext.RequestAborted);
            }
            catch (Exception e)
            {
                response.Code = ResponseCodeDefines.ServiceError;
                response.Message = e.Message;
                Logger.LogError($"用户{user?.UserName ?? ""}({user?.Id ?? ""})根据楼盘获取评论列表(GetListByBuildingId)请求失败：\r\n{response.Message ?? ""}，\r\n请求参数为：\r\n(buildingid){buildingid ?? ""}，\r\n请求参数为：\r\n" + (condition != null ? JsonHelper.ToJson(condition) : ""));
            }
            return response;
        }

        /// <summary>
        /// 根据评论ID获取评论列表
        /// </summary>
        /// <param name="user"></param>
        /// <param name="id"></param>
        /// <param name="condition"></param>
        /// <returns></returns>
        [HttpPost("commentlist/{id}")]
        [CheckPermission]
        public async Task<ResponseMessage<List<CommentDetailResponse>>> GetListById(UserInfo user, [FromRoute] string id, [FromBody]PageCondition condition)
        {
            var response = new ResponseMessage<List<CommentDetailResponse>>();
            if (!ModelState.IsValid && string.IsNullOrEmpty(id))
            {
                response.Code = ResponseCodeDefines.ModelStateInvalid;
                response.Message = ModelState.GetAllErrors();
                Logger.LogWarning($"用户{user?.UserName ?? ""}({user?.Id ?? ""})根据评论ID获取评论列表(GetListById)模型验证失败：\r\n{response.Message ?? ""}，\r\n请求参数为：\r\n(id){id ?? ""}，\r\n请求参数为：\r\n" + (condition != null ? JsonHelper.ToJson(condition) : ""));
                return response;
            }
            try
            {
                response.Extension = await _commentManager.ListByIdAsync(id, condition, HttpContext.RequestAborted);
            }
            catch (Exception e)
            {
                response.Code = ResponseCodeDefines.ServiceError;
                response.Message = e.Message;
                Logger.LogError($"用户{user?.UserName ?? ""}({user?.Id ?? ""})根据评论ID获取评论列表(GetListById)请求失败：\r\n{response.Message ?? ""}，\r\n请求参数为：\r\n(id){id ?? ""}，\r\n请求参数为：\r\n" + (condition != null ? JsonHelper.ToJson(condition) : ""));
            }
            return response;
        }
    }
}
