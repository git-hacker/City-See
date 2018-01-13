using BuildingComment.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BuildingComment.Store
{
    public interface ICommentStore
    {
        IQueryable<Comment> GetCommentQuery();

        IQueryable<Comment> GetCommentDetail();

        Task<Comment> CreateAsync(Comment comment, CancellationToken cancellationToken = default(CancellationToken));

        Task<TResult> GetAsync<TResult>(Func<IQueryable<Comment>, IQueryable<TResult>> query, CancellationToken cancellationToken = default(CancellationToken));

        Task<List<TResult>> ListAsync<TResult>(Func<IQueryable<Comment>, IQueryable<TResult>> query, CancellationToken cancellationToken = default(CancellationToken));

        Task UpdateAsync(Comment comment, CancellationToken cancellationToken = default(CancellationToken));

        Task DeleteListAsync(List<Comment> comments, CancellationToken cancellationToken = default(CancellationToken));
    }
}
