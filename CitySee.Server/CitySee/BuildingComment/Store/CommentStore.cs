using BuildingComment.Model;
using BuildingComment.Model.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BuildingComment.Store
{
    public class CommentStore : ICommentStore
    {
        protected BuildingCommentDbContext Context { get; }

        public CommentStore(BuildingCommentDbContext buildingCommentDbContext)
        {
            Context = buildingCommentDbContext;
        }

        public IQueryable<Comment> GetCommentQuery()
        {
            var query = from cm in Context.Comments.AsNoTracking()
                        join b in Context.Buildings.AsNoTracking() on cm.BuildingId equals b.Id
                        //join c in Context.CustomerInfos.AsNoTracking() on cm.CustomerId equals c.Id
                        select new Comment()
                        {
                            Id = cm.Id,
                            IsAnonymous = cm.IsAnonymous,
                            BuildingId = cm.BuildingId,
                            Content = cm.Content,
                            CreateTime = cm.CreateTime,
                            CustomerId = cm.CustomerId,
                            Icon = b.Icon,
                            UpId = cm.UpId,
                            BuildingName = b.BuildingName,
                            ReplyNum = (from re in Context.Comments.AsNoTracking()
                                        where re.UpId == cm.Id
                                        select re.Id).Count(),
                            LikeNum = (from gl in Context.GiveLikes.AsNoTracking()
                                       where gl.Id == cm.Id
                                       select gl.Id).Count()

                            //UserName= c
                        };
            return query;
        }

        public IQueryable<Comment> GetCommentDetail()
        {
            var query = from cm in Context.Comments.AsNoTracking()
                        join b in Context.Buildings.AsNoTracking() on cm.BuildingId equals b.Id
                        //join c in Context.CustomerInfos.AsNoTracking() on cm.CustomerId equals c.Id
                        select new Comment()
                        {
                            Id = cm.Id,
                            IsAnonymous = cm.IsAnonymous,
                            BuildingId = cm.BuildingId,
                            Content = cm.Content,
                            CreateTime = cm.CreateTime,
                            CustomerId = cm.CustomerId,
                            Icon = b.Icon,
                            UpId = cm.UpId,
                            BuildingName = b.BuildingName,
                            FirstId = cm.FirstId,
                                                        //UserName= c
                        };
            return query;
        }

        public async Task<Comment> CreateAsync(Comment comment, CancellationToken cancellationToken = default(CancellationToken))
        {
            if (comment == null)
            {
                throw new ArgumentNullException(nameof(comment));
            }
            Context.Add(comment);
            await Context.SaveChangesAsync(cancellationToken);
            return comment;
        }

        public Task<TResult> GetAsync<TResult>(Func<IQueryable<Comment>, IQueryable<TResult>> query, CancellationToken cancellationToken = default(CancellationToken))
        {
            if (query == null)
            {
                throw new ArgumentNullException(nameof(query));
            }
            return query.Invoke(Context.Comments.AsNoTracking()).SingleOrDefaultAsync(cancellationToken);
        }


        public Task<List<TResult>> ListAsync<TResult>(Func<IQueryable<Comment>, IQueryable<TResult>> query, CancellationToken cancellationToken = default(CancellationToken))
        {
            if (query == null)
            {
                throw new ArgumentNullException(nameof(query));
            }
            return query.Invoke(Context.Comments.AsNoTracking()).ToListAsync(cancellationToken);
        }

        public async Task UpdateAsync(Comment comment, CancellationToken cancellationToken = default(CancellationToken))
        {
            if (comment == null)
            {
                throw new ArgumentNullException(nameof(comment));
            }
            Context.Attach(comment);
            Context.Update(comment);
            try
            {
                await Context.SaveChangesAsync(cancellationToken);
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
        }

        public async Task DeleteListAsync(List<Comment> comments, CancellationToken cancellationToken = default(CancellationToken))
        {
            if (comments == null)
            {
                throw new ArgumentNullException(nameof(comments));
            }
            Context.RemoveRange(comments);
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
