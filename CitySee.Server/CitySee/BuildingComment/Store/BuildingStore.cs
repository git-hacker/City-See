using BuildingComment.Model;
using BuildingComment.Model.Context;
using BuildingComment.Store;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace BuildingComment.Store
{
    public class BuildingStore: IBuildingStore
    {
        protected BuildingCommentDbContext Context { get; }

        public BuildingStore(BuildingCommentDbContext buildingBuildingDbContext)
        {
            Context = buildingBuildingDbContext;
            Buildings = Context.Buildings;
        }

        public IQueryable<Building> Buildings { get; set; }

        public async Task<Building> CreateAsync(Building building, CancellationToken cancellationToken = default(CancellationToken))
        {
            if (building == null)
            {
                throw new ArgumentNullException(nameof(building));
            }
            Context.Add(building);
            await Context.SaveChangesAsync(cancellationToken);
            return building;
        }

        public Task<TResult> GetAsync<TResult>(Func<IQueryable<Building>, IQueryable<TResult>> query, CancellationToken cancellationToken = default(CancellationToken))
        {
            if (query == null)
            {
                throw new ArgumentNullException(nameof(query));
            }
            return query.Invoke(Context.Buildings.AsNoTracking()).SingleOrDefaultAsync(cancellationToken);
        }


        public Task<List<TResult>> ListAsync<TResult>(Func<IQueryable<Building>, IQueryable<TResult>> query, CancellationToken cancellationToken = default(CancellationToken))
        {
            if (query == null)
            {
                throw new ArgumentNullException(nameof(query));
            }
            return query.Invoke(Context.Buildings.AsNoTracking()).ToListAsync(cancellationToken);
        }

        public async Task UpdateAsync(Building building, CancellationToken cancellationToken = default(CancellationToken))
        {
            if (building == null)
            {
                throw new ArgumentNullException(nameof(building));
            }
            Context.Attach(building);
            Context.Update(building);
            try
            {
                await Context.SaveChangesAsync(cancellationToken);
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
        }

        public async Task DeleteAsync(Building building, CancellationToken cancellationToken = default(CancellationToken))
        {
            if (building == null)
            {
                throw new ArgumentNullException(nameof(building));
            }
            Context.Remove(building);
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
