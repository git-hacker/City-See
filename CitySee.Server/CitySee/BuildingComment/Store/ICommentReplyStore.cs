using BuildingComment.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace BuildingComment.Store
{
    public interface ICommentReplyStore
    {
        IQueryable<CommentReply> GetReplyQuery();

        Task<CommentReply> CreateAsync(CommentReply commentReply, Comment comment, CancellationToken cancellationToken = default(CancellationToken));

        Task<TResult> GetAsync<TResult>(Func<IQueryable<CommentReply>, IQueryable<TResult>> query, CancellationToken cancellationToken = default(CancellationToken));

        Task<List<TResult>> ListAsync<TResult>(Func<IQueryable<CommentReply>, IQueryable<TResult>> query, CancellationToken cancellationToken = default(CancellationToken));

        Task UpdateAsync(CommentReply commentReply, CancellationToken cancellationToken = default(CancellationToken));

        Task DeleteAsync(CommentReply commentReply, Comment comment, CancellationToken cancellationToken = default(CancellationToken));
    }
}
