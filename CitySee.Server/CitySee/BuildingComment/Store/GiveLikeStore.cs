using BuildingComment.Model;
using BuildingComment.Model.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace BuildingComment.Store
{
    public class GiveLikeStore : IGiveLikeStore
    {
        protected BuildingCommentDbContext Context { get; }

        public GiveLikeStore(BuildingCommentDbContext buildingCommentDbContext)
        {
            Context = buildingCommentDbContext;
        }

        public async Task<GiveLike> CreateAsync(GiveLike giveLike,Comment comment, CancellationToken cancellationToken = default(CancellationToken))
        {
            if (giveLike == null)
            {
                throw new ArgumentNullException(nameof(giveLike));
            }
            Context.Add(giveLike);
            Context.Attach(comment);
            var entry = Context.Entry(comment);
            entry.Property(x => x.LikeNum).IsModified = true;
            await Context.SaveChangesAsync(cancellationToken);
            return giveLike;
        }

        /// <summary>
        /// 根据某一成员获取一条信息
        /// </summary>
        /// <typeparam name="TResult">返回值</typeparam>
        /// <param name="query">参数</param>
        /// <param name="cancellationToken">验证</param>
        /// <returns></returns>
        public Task<TResult> GetAsync<TResult>(Func<IQueryable<GiveLike>, IQueryable<TResult>> query, CancellationToken cancellationToken = default(CancellationToken))
        {
            if (query == null)
            {
                throw new ArgumentNullException(nameof(query));
            }
            return query.Invoke(Context.GiveLikes.AsNoTracking()).SingleOrDefaultAsync(cancellationToken);
        }

        public async Task DeleteAsync(GiveLike giveLike, Comment comment, CancellationToken cancellationToken = default(CancellationToken))
        {
            if (giveLike == null)
            {
                throw new ArgumentNullException(nameof(giveLike));
            }
            Context.Remove(giveLike);
            Context.Attach(comment);
            var entry = Context.Entry(comment);
            entry.Property(x => x.LikeNum).IsModified = true;
            try
            {
                await Context.SaveChangesAsync(cancellationToken);
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
        }
    }
}
