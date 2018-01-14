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
    public class CommentReplyStore : ICommentReplyStore
    {
        protected BuildingCommentDbContext Context { get; }

        public CommentReplyStore(BuildingCommentDbContext buildingCommentDbContext)
        {
            Context = buildingCommentDbContext;
        }

        public IQueryable<CommentReply> GetReplyQuery()
        {
            var query = from cr1 in Context.CommentReplies.AsNoTracking()
                        join ru1 in Context.Users.AsNoTracking() on cr1.CustomerId equals ru1.Id

                        join cm1 in Context.CommentReplies.AsNoTracking() on cr1.ParentId equals cm1.Id into cm2
                        from cm in cm2.DefaultIfEmpty()
                        join u1 in Context.Users.AsNoTracking() on cm.CustomerId equals u1.Id into u2
                        from u in u2.DefaultIfEmpty()

                        select new CommentReply
                        {
                            Id = cr1.Id,
                            CreateTime = cr1.CreateTime,
                            CommentId = cr1.CommentId,
                            Content = cr1.Content,
                            CustomerId = cr1.CustomerId,
                            IsAnonymous = cr1.IsAnonymous,
                            ToCustomerId = cr1.ToCustomerId,
                            ToCustomerName = cm.IsAnonymous ? "匿名用户" : u.UserName,
                            UserName = cr1.IsAnonymous ? "匿名用户" : ru1.UserName,
                        };
            return query;
        }

        public async Task<CommentReply> CreateAsync(CommentReply commentReply, Comment comment, CancellationToken cancellationToken = default(CancellationToken))
        {
            if (commentReply == null)
            {
                throw new ArgumentNullException(nameof(commentReply));
            }
            Context.Add(commentReply);
            Context.Attach(comment);
            var entry = Context.Entry(comment);
            entry.Property(x => x.ReplyNum).IsModified = true;
            await Context.SaveChangesAsync(cancellationToken);
            return commentReply;
        }

        public Task<TResult> GetAsync<TResult>(Func<IQueryable<CommentReply>, IQueryable<TResult>> query, CancellationToken cancellationToken = default(CancellationToken))
        {
            if (query == null)
            {
                throw new ArgumentNullException(nameof(query));
            }
            return query.Invoke(Context.CommentReplies.AsNoTracking()).SingleOrDefaultAsync(cancellationToken);
        }


        public Task<List<TResult>> ListAsync<TResult>(Func<IQueryable<CommentReply>, IQueryable<TResult>> query, CancellationToken cancellationToken = default(CancellationToken))
        {
            if (query == null)
            {
                throw new ArgumentNullException(nameof(query));
            }
            return query.Invoke(Context.CommentReplies.AsNoTracking()).ToListAsync(cancellationToken);
        }

        public async Task UpdateAsync(CommentReply commentReply, CancellationToken cancellationToken = default(CancellationToken))
        {
            if (commentReply == null)
            {
                throw new ArgumentNullException(nameof(commentReply));
            }
            Context.Attach(commentReply);
            Context.Update(commentReply);
            try
            {
                await Context.SaveChangesAsync(cancellationToken);
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
        }

        public async Task DeleteAsync(CommentReply commentReply, Comment comment, CancellationToken cancellationToken = default(CancellationToken))
        {
            if (commentReply == null)
            {
                throw new ArgumentNullException(nameof(commentReply));
            }
            Context.Remove(commentReply);
            Context.Attach(comment);
            var entry = Context.Entry(comment);
            entry.Property(x => x.ReplyNum).IsModified = true;
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
