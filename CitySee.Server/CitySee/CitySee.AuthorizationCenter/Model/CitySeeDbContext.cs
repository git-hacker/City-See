using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace CitySee.AuthorizationCenter.Model
{
    public class CitySeeDbContext : IdentityDbContext
    {
        public CitySeeDbContext(DbContextOptions<CitySeeDbContext> options)
            : base(options) { }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);


        }
    }
}
