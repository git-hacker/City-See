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
using System.Threading.Tasks;

namespace BuildingComment.Controllers
{
    //[Authorize(AuthenticationSchemes = OAuthValidationDefaults.AuthenticationScheme)]
    [Produces("application/json")]
    [Route("api/building")]
    public class BuildingController : BaseController<CommentController>
    {
        #region 成员
        private readonly CommentManager _commentManager;
        private readonly BuildingManager _buildingManager;
        private readonly IMapper _mapper;

        #endregion

        /// <summary>
        /// 建筑控制器
        /// </summary>
        public BuildingController(
            CommentManager commentManager,
            BuildingManager buildingManager,
             IMapper mapper)
        {
            _commentManager = commentManager ?? throw new ArgumentNullException(nameof(commentManager));
            _buildingManager = buildingManager ?? throw new ArgumentNullException(nameof(buildingManager));
            _mapper = mapper;
        }

        /// <summary>
        /// 新增建筑
        /// </summary>
        /// <param name="user"></param>
        /// <param name="buildingRequest"></param>
        /// <returns></returns>
        [HttpPost]
        [CheckPermission]
        public async Task<ResponseMessage<BuildingResponse>> CreateBuilding([FromBody] BuildingRequest buildingRequest)
        {
            ResponseMessage<BuildingResponse> response = new ResponseMessage<BuildingResponse>();
            if (!ModelState.IsValid)
            {
                response.Code = ResponseCodeDefines.ModelStateInvalid;
                response.Message = ModelState.GetAllErrors();
                Logger.LogWarning($"新增评论(CreateBuilding)模型验证失败：\r\n{response.Message ?? ""}，\r\n请求参数为：\r\n" + (buildingRequest != null ? JsonHelper.ToJson(buildingRequest) : ""));
                return response;
            }
            try
            {
                response.Extension = await _buildingManager.CreateAsync(buildingRequest, HttpContext.RequestAborted);
            }
            catch (Exception e)
            {
                response.Code = ResponseCodeDefines.ServiceError;
                response.Message = e.Message;
                Logger.LogError($"新增评论(CreateBuilding)请求失败：\r\n{response.Message ?? ""}，\r\n请求参数为：\r\n" + (buildingRequest != null ? JsonHelper.ToJson(buildingRequest) : ""));
            }
            return response;
        }

        /// <summary>
        /// 获取建筑
        /// </summary>
        /// <param name="user"></param>
        /// <param name="buildingSearch"></param>
        /// <returns></returns>
        [HttpPost("list")]
        [CheckPermission]
        public async Task<PagingResponseMessage<BuildingResponse>> SearchBuilding([FromBody] BuildingSearch buildingSearch)
        {
            var response = new PagingResponseMessage<BuildingResponse>();
            if (!ModelState.IsValid)
            {
                response.Code = ResponseCodeDefines.ModelStateInvalid;
                response.Message = ModelState.GetAllErrors();
                Logger.LogWarning($"获取建筑(SearchBuilding)模型验证失败：\r\n{response.Message ?? ""}，\r\n请求参数为：\r\n" + (buildingSearch != null ? JsonHelper.ToJson(buildingSearch) : ""));
                return response;
            }
            try
            {
                response = await _buildingManager.Search(buildingSearch, HttpContext.RequestAborted);
            }
            catch (Exception e)
            {
                response.Code = ResponseCodeDefines.ServiceError;
                response.Message = e.Message;
                Logger.LogError($"获取建筑(SearchBuilding)请求失败：\r\n{response.Message ?? ""}，\r\n请求参数为：\r\n" + (buildingSearch != null ? JsonHelper.ToJson(buildingSearch) : ""));
            }
            return response;
        }
        
        /// <summary>
        /// 根据楼盘获取评论列表
        /// </summary>
        /// <param name="user"></param>
        /// <param name="condition"></param>
        /// <returns></returns>
        [HttpPost("comment")]
        [CheckPermission]
        public async Task<PagingResponseMessage<CommentResponse>> GetListByBuildingId(UserInfo user, [FromBody] CommentSearch condition)
        {
            var response = new PagingResponseMessage<CommentResponse>();
            if (!ModelState.IsValid)
            {
                response.Code = ResponseCodeDefines.ModelStateInvalid;
                response.Message = ModelState.GetAllErrors();
                Logger.LogWarning($"根据楼盘获取评论列表(GetListByBuildingId)模型验证失败：\r\n{response.Message ?? ""}，\r\n请求参数为：\r\n" + (condition != null ? JsonHelper.ToJson(condition) : ""));
                return response;
            }
            try
            {
                response = await _commentManager.ListByBuildingIdAsync(condition, HttpContext.RequestAborted);
            }
            catch (Exception e)
            {
                response.Code = ResponseCodeDefines.ServiceError;
                response.Message = e.Message;
                Logger.LogError($"根据楼盘获取评论列表(GetListByBuildingId)请求失败：\r\n{response.Message ?? ""}，\r\n请求参数为：\r\n" + (condition != null ? JsonHelper.ToJson(condition) : ""));
            }
            return response;
        }
    }
}
