using AutoMapper;
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
    public class BuildingManager
    {
        protected IBuildingStore _ibuildingStore { get; }

        protected IMapper _mapper { get; }

        public BuildingManager(
            IBuildingStore buildingStore,
            IMapper mapper)
        {
            _ibuildingStore = buildingStore ?? throw new ArgumentNullException(nameof(buildingStore));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        /// <summary>
        /// 新增楼盘信息
        /// </summary>
        /// <param name="buildingRequest">请求实体</param>
        /// <param name="cancellationToken">验证</param>
        /// <returns></returns>
        public virtual async Task<BuildingResponse> CreateAsync(BuildingRequest buildingRequest, CancellationToken cancellationToken = default(CancellationToken))
        {
            var old = await _ibuildingStore.GetAsync(a => a.Where(b => b.Longitude == buildingRequest.Longitude && b.Latitude == buildingRequest.Latitude && b.BuildingName == buildingRequest.BuildingName));
            if (old != null)
                return null;
            var building = _mapper.Map<Building>(buildingRequest);
            building.CreateTime = DateTime.Now;
            var response = await _ibuildingStore.CreateAsync(building, cancellationToken);
            return _mapper.Map<BuildingResponse>(response);
        }

        /// <summary>
        /// 查询楼盘信息
        /// </summary>
        /// <param name="buildingSearch">请求实体</param>
        /// <param name="cancellationToken">验证</param>
        /// <returns></returns>
        public virtual async Task<PagingResponseMessage<BuildingResponse>> Search(BuildingSearch buildingSearch, CancellationToken cancellationToken = default(CancellationToken))
        {
            var response = new PagingResponseMessage<BuildingResponse>();
            var buildings = _ibuildingStore.Buildings.Where(x => buildingSearch.Latitudes.Contains(x.Latitude) && buildingSearch.Longitudes.Contains(x.Longitude));

            var query = await buildings
            .Skip(buildingSearch.PageIndex * buildingSearch.PageSize)
            .Take(buildingSearch.PageSize)
            .ToListAsync(cancellationToken);

            //string fr = ApplicationCore.ApplicationContext.Current.FileServerRoot;
            //fr = (fr ?? "").TrimEnd('/');

            //var building = await query.FirstOrDefaultAsync(cancellationToken);
            //building.Icon = string.IsNullOrEmpty(building.Icon) ? "" : fr + "/" + building.Icon.TrimStart('/');

            response.TotalCount = await buildings.CountAsync(cancellationToken);
            response.PageIndex = buildingSearch.PageIndex;
            response.PageSize = buildingSearch.PageSize;
            response.Extension = _mapper.Map<List<BuildingResponse>>(query);
            return response;
        }
    }
}
