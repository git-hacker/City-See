using AutoMapper;
using BuildingComment.Dto.Request;
using BuildingComment.Dto.Response;
using BuildingComment.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace BuildingComment
{
    public class CommentMappingProfile : Profile
    {
        public CommentMappingProfile()
        {
            CreateMap<CommentDetailResponse, CommentReply>();
            CreateMap<CommentReply, CommentDetailResponse>();

            CreateMap<CommentReplyRequest, CommentReply>();
            CreateMap<CommentReply, CommentReplyRequest>();

            CreateMap<CommentResponse, Comment>();
            CreateMap<Comment, CommentResponse>()
                .ForMember(a => a.FileList, (map) => map.MapFrom(b => b.FileList));

            CreateMap<CommentRequest, Comment>();
            CreateMap<Comment, CommentRequest>();

            CreateMap<BuildingResponse, Building>();
            CreateMap<Building, BuildingResponse>();

            CreateMap<BuildingRequest, Building>();
            CreateMap<Building, BuildingRequest>();
        }

    }
}
