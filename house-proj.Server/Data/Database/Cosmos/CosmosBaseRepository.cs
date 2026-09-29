using Microsoft.Azure.Cosmos.Linq;

namespace house_proj.Server.Data.Database.Cosmos
{
    public abstract class CosmosBaseRepository
    {
        protected async Task<(IEnumerable<T> Items, int TotalCount)> ApplyPaginationAsync<T>(
        IQueryable<T> query,
        int pageNumber,
        int pageSize)
        {
            // 1. Get Count
            int totalCount = await query.CountAsync();

            // 2. Build Page logic
            var pagedQuery = query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize);

            // 3. Execute
            using var iterator = pagedQuery.ToFeedIterator();
            var results = new List<T>();

            while (iterator.HasMoreResults)
            {
                var response = await iterator.ReadNextAsync();
                results.AddRange(response);
            }

            return (results, totalCount);
        }
    }
}
