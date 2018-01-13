using AutoMapper;
using CitySee.AuthorizationCenter.Dto;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CitySee.AuthorizationCenter
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<IdentityUser, UserinfoResponse>();
            CreateMap<UserinfoResponse, IdentityUser>();

            CreateMap<UserinfoRequest, IdentityUser>();
            CreateMap<IdentityUser, UserinfoRequest>();
        }
    }
}
