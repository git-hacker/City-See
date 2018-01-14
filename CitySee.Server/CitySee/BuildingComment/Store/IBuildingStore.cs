using BuildingComment.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BuildingComment.Store
{
    public interface IBuildingStore
    {
        IQueryable<Building> Buildings { get; set; }

        Task<Building> CreateAsync(Building building, CancellationToken cancellationToken = default(CancellationToken));

        Task<TResult> GetAsync<TResult>(Func<IQueryable<Building>, IQueryable<TResult>> query, CancellationToken cancellationToken = default(CancellationToken));

        Task<List<TResult>> ListAsync<TResult>(Func<IQueryable<Building>, IQueryable<TResult>> query, CancellationToken cancellationToken = default(CancellationToken));

        Task UpdateAsync(Building building, CancellationToken cancellationToken = default(CancellationToken));

        Task DeleteAsync(Building building, CancellationToken cancellationToken = default(CancellationToken));
    }
}
