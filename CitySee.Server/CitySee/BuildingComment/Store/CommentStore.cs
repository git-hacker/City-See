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

                        join c in Context.Users.AsNoTracking() on cm.CustomerId equals c.Id
                        select new Comment()
                        {
                            Id = cm.Id,
                            IsAnonymous = cm.IsAnonymous,
                            BuildingId = cm.BuildingId,
                            Content = cm.Content,
                            CreateTime = cm.CreateTime,
                            CustomerId = cm.CustomerId,
                            Icon = b.Icon,
                            BuildingName = b.BuildingName,
                            ReplyNum = cm.ReplyNum,
                            LikeNum = cm.LikeNum,
                            UserName = cm.IsAnonymous ? "匿名用户" : c.UserName,
                            CommentFileInfo = from f1 in Context.FileInfos.AsNoTracking()
                                             join file in Context.CommentImages.AsNoTracking() on f1.FileGuid equals file.FileGuid
                                             orderby file.CreateTime descending
                                             where file.CommentId == cm.Id
                                             select new FileInfo
                                             {
                                                 FileGuid = f1.FileGuid,
                                                 FileExt = f1.FileExt,
                                                 Uri = f1.Uri,
                                                 Name = f1.Name,
                                                 Type = f1.Type,
                                                 Size = f1.Size,
                                                 Height = f1.Height,
                                                 Width = f1.Width,
                                                 Ext1 = f1.Ext1,
                                                 Ext2 = f1.Ext2
                                             }
                        };
            return query;
        }

        public async Task<Comment> CreateAsync(Comment comment,Building building, CancellationToken cancellationToken = default(CancellationToken))
        {
            if (comment == null)
            {
                throw new ArgumentNullException(nameof(comment));
            }
            Context.Add(comment);
            Context.Attach(building);
            var entry = Context.Entry(building);
            entry.Property(x => x.CommentNum).IsModified = true;
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

        public async Task DeleteAsync(Comment comment, Building building, CancellationToken cancellationToken = default(CancellationToken))
        {
            if (comment == null)
            {
                throw new ArgumentNullException(nameof(comment));
            }
            Context.Remove(comment);
            Context.Attach(building);
            var entry = Context.Entry(building);
            entry.Property(x => x.CommentNum).IsModified = true;
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
