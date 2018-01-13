using AuthorizationCenter.Controllers;
using AutoMapper;
using BuildingComment.Dto.Common;
using BuildingComment.Dto.Request;
using BuildingComment.Dto.Response;
using BuildingComment.Manager;
using CitySee.Core;
using CitySee.Core.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace BuildingComment.Controllers
{
    //[Authorize(AuthenticationSchemes = OAuthValidationDefaults.AuthenticationScheme)]
    [Produces("application/json")]
    [Route("api/comment")]
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
        [HttpPost("addcomment")]
        //[TypeFilter(typeof(CheckPermission), Arguments = new object[] { "" })]
        public async Task<ResponseMessage<CommentResponse>> CreateComment(/*UserInfo user,*/ [FromBody] CommentRequest commentRequest)
        {
            ResponseMessage<CommentResponse> response = new ResponseMessage<CommentResponse>();
            if (!ModelState.IsValid)
            {
                response.Code = ResponseCodeDefines.ModelStateInvalid;
                response.Message = ModelState.GetAllErrors();
                //Logger.Warn($"用户{user?.UserName ?? ""}({user?.Id ?? ""})认领客户(ClaimCustomer)模型验证失败：\r\n{response.Message ?? ""}，\r\n请求参数为：\r\n" + (customerPoolClaimRequest != null ? JsonHelper.ToJson(customerPoolClaimRequest) : ""));
                return response;
            }
            try
            {
                response.Extension = await _commentManager.CreateAsync(commentRequest, HttpContext.RequestAborted);
            }
            catch (Exception e)
            {
                response.Code = ResponseCodeDefines.ServiceError;
                response.Message = e.Message;
                //Logger.Error($"用户{user?.UserName ?? ""}({user?.Id ?? ""})认领客户(ClaimCustomer)请求失败：\r\n{response.Message ?? ""}，\r\n请求参数为：\r\n" + (customerPoolClaimRequest != null ? JsonHelper.ToJson(customerPoolClaimRequest) : ""));
            }
            return response;
        }

        /// <summary>
        /// 修改评论
        /// </summary>
        /// <param name="user"></param>
        /// <param name="commentRequest"></param>
        /// <returns></returns>
        [HttpPut("updatecomment")]
        //[TypeFilter(typeof(CheckPermission), Arguments = new object[] { "" })]
        public async Task<ResponseMessage> UpdateComment(/*UserInfo user,*/ [FromBody] CommentRequest commentRequest)
        {
            ResponseMessage<CommentResponse> response = new ResponseMessage<CommentResponse>();
            if (!ModelState.IsValid)
            {
                response.Code = ResponseCodeDefines.ModelStateInvalid;
                response.Message = ModelState.GetAllErrors();
                //Logger.Warn($"用户{user?.UserName ?? ""}({user?.Id ?? ""})认领客户(ClaimCustomer)模型验证失败：\r\n{response.Message ?? ""}，\r\n请求参数为：\r\n" + (customerPoolClaimRequest != null ? JsonHelper.ToJson(customerPoolClaimRequest) : ""));
                return response;
            }
            try
            {
                await _commentManager.UpdateAsync(commentRequest, HttpContext.RequestAborted);
            }
            catch (Exception e)
            {
                response.Code = ResponseCodeDefines.ServiceError;
                response.Message = e.Message;
                //Logger.Error($"用户{user?.UserName ?? ""}({user?.Id ?? ""})认领客户(ClaimCustomer)请求失败：\r\n{response.Message ?? ""}，\r\n请求参数为：\r\n" + (customerPoolClaimRequest != null ? JsonHelper.ToJson(customerPoolClaimRequest) : ""));
            }
            return response;
        }

        /// <summary>
        /// 删除评论
        /// </summary>
        /// <param name="user"></param>
        /// <param name="commentRequest"></param>
        /// <returns></returns>
        [HttpDelete("updatecomment")]
        //[TypeFilter(typeof(CheckPermission), Arguments = new object[] { "" })]
        public async Task<ResponseMessage> UpdateComment(/*UserInfo user,*/ [FromBody] List<string> ids)
        {
            ResponseMessage<CommentResponse> response = new ResponseMessage<CommentResponse>();
            if (!ModelState.IsValid)
            {
                response.Code = ResponseCodeDefines.ModelStateInvalid;
                response.Message = ModelState.GetAllErrors();
                //Logger.Warn($"用户{user?.UserName ?? ""}({user?.Id ?? ""})认领客户(ClaimCustomer)模型验证失败：\r\n{response.Message ?? ""}，\r\n请求参数为：\r\n" + (customerPoolClaimRequest != null ? JsonHelper.ToJson(customerPoolClaimRequest) : ""));
                return response;
            }
            try
            {
                await _commentManager.DeleteAsync(ids, HttpContext.RequestAborted);
            }
            catch (Exception e)
            {
                response.Code = ResponseCodeDefines.ServiceError;
                response.Message = e.Message;
                //Logger.Error($"用户{user?.UserName ?? ""}({user?.Id ?? ""})认领客户(ClaimCustomer)请求失败：\r\n{response.Message ?? ""}，\r\n请求参数为：\r\n" + (customerPoolClaimRequest != null ? JsonHelper.ToJson(customerPoolClaimRequest) : ""));
            }
            return response;
        }

        /// <summary>
        /// 点赞
        /// </summary>
        /// <param name="user"></param>
        /// <param name="id">评论Id</param>
        /// <returns></returns>
        [HttpPost("givelike/{id}")]
        //[TypeFilter(typeof(CheckPermission), Arguments = new object[] { "" })]
        public async Task<ResponseMessage> GiveLike(/*UserInfo user,*/ [FromRoute] string id)
        {
            ResponseMessage<CommentResponse> response = new ResponseMessage<CommentResponse>();
            if (!ModelState.IsValid)
            {
                response.Code = ResponseCodeDefines.ModelStateInvalid;
                response.Message = ModelState.GetAllErrors();
                //Logger.Warn($"用户{user?.UserName ?? ""}({user?.Id ?? ""})认领客户(ClaimCustomer)模型验证失败：\r\n{response.Message ?? ""}，\r\n请求参数为：\r\n" + (customerPoolClaimRequest != null ? JsonHelper.ToJson(customerPoolClaimRequest) : ""));
                return response;
            }
            try
            {
                await _commentManager.CreateGiveLikeAsync(id, HttpContext.RequestAborted);
            }
            catch (Exception e)
            {
                response.Code = ResponseCodeDefines.ServiceError;
                response.Message = e.Message;
                //Logger.Error($"用户{user?.UserName ?? ""}({user?.Id ?? ""})认领客户(ClaimCustomer)请求失败：\r\n{response.Message ?? ""}，\r\n请求参数为：\r\n" + (customerPoolClaimRequest != null ? JsonHelper.ToJson(customerPoolClaimRequest) : ""));
            }
            return response;
        }

        /// <summary>
        /// 取消点赞
        /// </summary>
        /// <param name="user"></param>
        /// <param name="id">评论Id</param>
        /// <returns></returns>
        [HttpDelete("cancelgivelike/{id}")]
        //[TypeFilter(typeof(CheckPermission), Arguments = new object[] { "" })]
        public async Task<ResponseMessage> CancelGiveLike(/*UserInfo user,*/ [FromRoute] string id)
        {
            ResponseMessage<CommentResponse> response = new ResponseMessage<CommentResponse>();
            if (!ModelState.IsValid)
            {
                response.Code = ResponseCodeDefines.ModelStateInvalid;
                response.Message = ModelState.GetAllErrors();
                //Logger.Warn($"用户{user?.UserName ?? ""}({user?.Id ?? ""})认领客户(ClaimCustomer)模型验证失败：\r\n{response.Message ?? ""}，\r\n请求参数为：\r\n" + (customerPoolClaimRequest != null ? JsonHelper.ToJson(customerPoolClaimRequest) : ""));
                return response;
            }
            try
            {
                if (await _commentManager.ValCancelGiveLike(id))
                    await _commentManager.CancelGiveLikeAsync(id, HttpContext.RequestAborted);
                else
                {
                    response.Code = ResponseCodeDefines.NotAllow;
                    response.Message = "你没有权限操作";
                }
            }
            catch (Exception e)
            {
                response.Code = ResponseCodeDefines.ServiceError;
                response.Message = e.Message;
                //Logger.Error($"用户{user?.UserName ?? ""}({user?.Id ?? ""})认领客户(ClaimCustomer)请求失败：\r\n{response.Message ?? ""}，\r\n请求参数为：\r\n" + (customerPoolClaimRequest != null ? JsonHelper.ToJson(customerPoolClaimRequest) : ""));
            }
            return response;
        }

        /// <summary>
        /// 根据楼盘获取评论列表
        /// </summary>
        /// <param name="buildingid"></param>
        /// <param name="condition"></param>
        /// <returns></returns>
        [HttpPost("list/{buildingid}")]
        //[TypeFilter(typeof(CheckPermission), Arguments = new object[] { "" })]
        public async Task<PagingResponseMessage<CommentResponse>> GetListByBuildingId([FromRoute] string buildingid, [FromForm]PageCondition condition)
        {
            var response = new PagingResponseMessage<CommentResponse>();
            if (!ModelState.IsValid && string.IsNullOrEmpty(buildingid))
            {
                response.Code = ResponseCodeDefines.ModelStateInvalid;
                response.Message = ModelState.GetAllErrors();
                //Logger.Warn($"用户{user?.UserName ?? ""}({user?.Id ?? ""})认领客户(ClaimCustomer)模型验证失败：\r\n{response.Message ?? ""}，\r\n请求参数为：\r\n" + (customerPoolClaimRequest != null ? JsonHelper.ToJson(customerPoolClaimRequest) : ""));
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
                //Logger.Error($"用户{user?.UserName ?? ""}({user?.Id ?? ""})认领客户(ClaimCustomer)请求失败：\r\n{response.Message ?? ""}，\r\n请求参数为：\r\n" + (customerPoolClaimRequest != null ? JsonHelper.ToJson(customerPoolClaimRequest) : ""));
            }
            return response;
        }

        /// <summary>
        /// 根据评论ID获取评论列表
        /// </summary>
        /// <param name="id"></param>
        /// <param name="condition"></param>
        /// <returns></returns>
        [HttpPost("listcomment/{id}")]
        //[TypeFilter(typeof(CheckPermission), Arguments = new object[] { "" })]
        public async Task<ResponseMessage<List<CommentResponse>>> GetListById([FromRoute] string id, [FromForm]PageCondition condition)
        {
            var response = new ResponseMessage<List<CommentResponse>>();
            if (!ModelState.IsValid && string.IsNullOrEmpty(id))
            {
                response.Code = ResponseCodeDefines.ModelStateInvalid;
                response.Message = ModelState.GetAllErrors();
                //Logger.Warn($"用户{user?.UserName ?? ""}({user?.Id ?? ""})认领客户(ClaimCustomer)模型验证失败：\r\n{response.Message ?? ""}，\r\n请求参数为：\r\n" + (customerPoolClaimRequest != null ? JsonHelper.ToJson(customerPoolClaimRequest) : ""));
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
                //Logger.Error($"用户{user?.UserName ?? ""}({user?.Id ?? ""})认领客户(ClaimCustomer)请求失败：\r\n{response.Message ?? ""}，\r\n请求参数为：\r\n" + (customerPoolClaimRequest != null ? JsonHelper.ToJson(customerPoolClaimRequest) : ""));
            }
            return response;
        }
    }
}
