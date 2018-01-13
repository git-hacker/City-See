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
            CreateMap<CommentDetailResponse, Comment>();
            CreateMap<Comment, CommentDetailResponse>();

            CreateMap<CommentResponse, Comment>();
            CreateMap<Comment, CommentResponse>();

            CreateMap<CommentRequest, Comment>();
            CreateMap<Comment, CommentRequest>();
        }

    }
}
