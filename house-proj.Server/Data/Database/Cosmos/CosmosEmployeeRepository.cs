using house_proj.Server.Data.Database.Cosmos;
using house_proj.Server.Data.Model;
using house_proj.Server.Data.Repositories;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Linq;

namespace house_proj.Server.Data.Repository
{
    public class CosmosEmployeeRepository : CosmosBaseRepository, IEmployeeRepository
    {
        private readonly Container _container;

        public CosmosEmployeeRepository(CosmosClient dbClient, string databaseName, string containerName)
        {
            _container = dbClient.GetContainer(databaseName, containerName);
        }

        public async Task<(IEnumerable<EmployeeProfile> Items, int TotalCount)> GetEmployeesAsync(int pageNumber,int pageSize,bool? isActive = null)
        {
            // 1. Start with a LINQ Queryable
            var queryable = _container.GetItemLinqQueryable<EmployeeProfile>();

            var matches = queryable.AsQueryable();

            if (isActive.HasValue)
            {
                matches = matches.Where(e => e.IsActive == isActive.Value);
            }

            return await ApplyPaginationAsync(matches, pageNumber,pageSize);
        }

        public async Task<EmployeeProfile?> GetEmployeeByIdAsync(Guid id)
        {
            try
            {
                // Note: Standard ReadItemAsync is still the fastest way for ID lookups
                ItemResponse<EmployeeProfile> response = await _container.ReadItemAsync<EmployeeProfile>(
                    id.ToString(),
                    new PartitionKey(id.ToString()));

                return response.Resource;
            }
            catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return null;
            }
        }

        public async Task<EmployeeProfile> AddEmployeeAsync(EmployeeProfile employee)
        {
            var response = await _container.CreateItemAsync(employee, new PartitionKey(employee.Guid.ToString()));
            return response.Resource;
        }

        public async Task<EmployeeProfile> UpdateEmployeeAsync(EmployeeProfile employee)
        {
            string pk = employee.Guid.ToString();

            var response = await _container.UpsertItemAsync<EmployeeProfile>(
                item: employee,
                partitionKey: new PartitionKey(pk)
            );

            return response.Resource;
        }

    }
}