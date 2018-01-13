using BuildingComment.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BuildingComment.Store
{
    public interface IGiveLikeStore
    {
        Task<GiveLike> CreateAsync(GiveLike giveLike, CancellationToken cancellationToken = default(CancellationToken));

        Task<TResult> GetAsync<TResult>(Func<IQueryable<GiveLike>, IQueryable<TResult>> query, CancellationToken cancellationToken = default(CancellationToken));

        Task DeleteAsync(GiveLike giveLike, CancellationToken cancellationToken = default(CancellationToken));
    }
}
