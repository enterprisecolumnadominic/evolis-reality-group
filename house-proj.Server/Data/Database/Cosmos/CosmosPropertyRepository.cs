using house_proj.Server.Data.Model;
using house_proj.Server.Data.Repositories;
using MailKit.Search;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Linq;
using System.ClientModel;
using System.Collections.Generic;
using System.Net;

namespace house_proj.Server.Data.Database.Cosmos
{
    public class CosmosPropertyRepository :CosmosBaseRepository,IPropertyRepository
    {
        private readonly Container _container;

        public CosmosPropertyRepository(CosmosClient dbClient, string databaseName, string containerName)
        {
            _container = dbClient.GetContainer(databaseName, containerName);
        }

        public async Task<(IEnumerable<PropertyAdminListDto> Items, int TotalCount)> GetAllPropertiesAsync(
            int pageNumber,
            int pageSize,
            bool? isEnabled = null)
        {
            // 1. Get the LINQ queryable for the FULL model
            var queryable = _container.GetItemLinqQueryable<AvailableProperty>();
            var matches = queryable.AsQueryable();

            // 2. Apply Filtering
            if (isEnabled.HasValue)
            {
                matches = matches.Where(p => p.IsEnabled == isEnabled.Value);
            }

            // 3. Apply Sorting
            var finalQuery = matches
                .OrderByDescending(p => p.DateCreated)
                .Select(p => new PropertyAdminListDto
                {
                    Guid = p.Guid,
                    Name = p.Name,
                    Price = (decimal)p.Price,
                    Address = p.Address,
                    PropertyType = p.PropertyType,
                    SubPropertyType = p.SubPropertyType,
                    ThumbnailUrl = p.MediaItems[0].Url,
                    DateCreated = p.DateCreated,
                    IsEnabled = p.IsEnabled
                });

            // 4. Execute Pagination
            // This helper must be able to handle <AvailableProperty>
            return await ApplyPaginationAsync(finalQuery, pageNumber, pageSize);
        }

        public async Task<AvailableProperty?> GetPropertyByIdAsync(Guid id)
        {
            try
            {
                // Point reads remain the most efficient way to get a single item
                ItemResponse<AvailableProperty> response = await _container.ReadItemAsync<AvailableProperty>(
                    id.ToString(),
                    new PartitionKey(id.ToString()));

                return response.Resource;
            }
            catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
            {
                return null;
            }
        }

        public async Task<AvailableProperty> AddPropertyAsync(AvailableProperty property)
        {
            // Note: Returning the resource from the response is standard practice
            var response = await _container.CreateItemAsync(property, new PartitionKey(property.Guid.ToString()));
            return response.Resource;
        }

        public async Task<AvailableProperty> UpdatePropertyAsync(AvailableProperty property)
        {
            var response = await _container.UpsertItemAsync(property, new PartitionKey(property.Guid.ToString()));
            return response.Resource;
        }


        public async Task<(IEnumerable<PropertyCardDto> Items, string? NextToken, int TotalCount)> GetPropertiesPagedAsync(
        int pageSize,
        bool? isEnabled,
        string? nameTerm,
        string? addressTerm,
        PropertyType? type,
        SubPropertyType? subType,
        string? continuationToken)
        {
            // 1. Setup the basic Queryable with the token
            var queryable = _container.GetItemLinqQueryable<AvailableProperty>(
             requestOptions: new QueryRequestOptions { MaxItemCount = pageSize },
             continuationToken: continuationToken
            );

            var matches = queryable.AsQueryable();

            // 2. Apply Filters
            if (isEnabled.HasValue)
                matches = matches.Where(p => p.IsEnabled == isEnabled.Value);

            if (type.HasValue)
                matches = matches.Where(p => p.PropertyType == type.Value);

            if (subType.HasValue)
                matches = matches.Where(p => p.SubPropertyType == subType.Value);

            if (!string.IsNullOrWhiteSpace(nameTerm))
            {
                var term = nameTerm.Trim().ToLower();
                matches = matches.Where(p => p.Name.ToLower().Contains(term));
            }

            if (!string.IsNullOrWhiteSpace(addressTerm))
            {
                var term = addressTerm.Trim().ToLower();
                matches = matches.Where(p => p.Address.ToLower().Contains(term));
            }

            // 3. Get Total Count - ONLY on the first page load
            // 🎯 If we have a token, we skip CountAsync to avoid the 400 error.
            int totalCount = 0;
            if (string.IsNullOrEmpty(continuationToken))
            {
                totalCount = await matches.CountAsync();
            }

            // 4. Sort and Project to DTO
            // Cosmos requires OrderBy for predictable pagination
            var finalQuery = matches
                .OrderByDescending(p => p.DateCreated)
                .Select(p => new PropertyCardDto
                {
                    Guid = p.Guid,
                    Name = p.Name,
                    Price = (decimal)p.Price,
                    Address = p.Address,
                    Bedrooms = p.Bedrooms,
                    Levels = p.Levels,
                    FloorSpace = p.FloorSpace,
                    Bathrooms = p.Bathrooms,
                    PropertyType = p.PropertyType,
                    SubPropertyType = p.SubPropertyType,
                    ThumbnailUrl = p.MediaItems[0].Url,
                    DateCreated = p.DateCreated
                });

            // 5. Execute using FeedIterator
            using var iterator = finalQuery.ToFeedIterator();
            var results = new List<PropertyCardDto>();
            string? nextToken = null;

            if (iterator.HasMoreResults)
            {
                var response = await iterator.ReadNextAsync();
                results.AddRange(response.Resource);
                nextToken = response.ContinuationToken;
            }

            return (results, nextToken, totalCount);
        }
    }

}
