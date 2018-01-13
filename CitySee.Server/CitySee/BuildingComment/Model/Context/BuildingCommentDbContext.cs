using CitySee.Core.Model;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace BuildingComment.Model.Context
{
    public class BuildingCommentDbContext : DbContext
    {
        public BuildingCommentDbContext(DbContextOptions<BuildingCommentDbContext> options)
            : base(options) { }

        /// <summary>
        /// 建筑
        /// </summary>
        public DbSet<Building> Buildings { get; set; }

        /// <summary>
        /// 评论
        /// </summary>
        public DbSet<Comment> Comments { get; set; }

        /// <summary>
        /// 点赞
        /// </summary>
        public DbSet<GiveLike> GiveLikes { get; set; }

        /// <summary>
        /// 用户
        /// </summary>
        public DbSet<UserInfo> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Building>(b =>
            {
                b.ToTable("buildings");
            });

            builder.Entity<Comment>(b =>
            {
                b.ToTable("comment");
            });

            builder.Entity<GiveLike>(b =>
            {
                b.HasKey(k => new { k.Id, k.CustomerId });
                b.ToTable("givelike");
            });

            builder.Entity<UserInfo>(b =>
            {
                b.HasKey(k => new { k.Id });
                b.ToTable("aspnetusers");
            });
        }

        public override int SaveChanges(bool acceptAllChangesOnSuccess)
        {
            OnBeforeSaving();
            return base.SaveChanges(acceptAllChangesOnSuccess);
        }

        public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default(CancellationToken))
        {
            OnBeforeSaving();
            return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
        }

        private void OnBeforeSaving()
        {

        }

    }
}
