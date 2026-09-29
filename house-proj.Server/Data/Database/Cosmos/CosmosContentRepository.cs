using house_proj.Server.Data.Model;
using house_proj.Server.Data.Repositories;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Linq;
using System;

namespace house_proj.Server.Data.Database.Cosmos
{
    public class CosmosContentRepository :CosmosBaseRepository, IContentRepository
    {
        private readonly Container _container;

        public CosmosContentRepository(CosmosClient dbClient, string databaseName, string containerName)
        {
            _container = dbClient.GetContainer(databaseName, containerName);
        }

        public async Task<(IEnumerable<ContentPostListDto> Items, int TotalCount)> GetAllContentAsync(
            int pageNumber,
            int pageSize,
            bool? isEnabled = null)
        {
            // 1. Start with the base queryable
            var queryable = _container.GetItemLinqQueryable<ContentPost>();
            var matches = queryable.AsQueryable();

            // 2. Apply Filters
            if (isEnabled.HasValue)
            {
                matches = matches.Where(p => p.IsActive == isEnabled.Value);
            }

            // 3. Project to the DTO
            var contentQuery = matches
                .OrderByDescending(p => p.PublishedDate)
                .Select(p => new ContentPostListDto
                {
                    Guid = p.Guid,
                    Type = p.Type,
                    Title = p.Title,
                    Slug = p.Slug,
                    Author = p.Author,
                    ImageUrl = p.ImageUrl,
                    TagLine = p.TagLine,
                    PublishedDate = p.PublishedDate,
                    IsFeatured = p.IsFeatured,
                    IsActive = p.IsActive,
                    Tags = p.Tags
                });

            return await ApplyPaginationAsync(contentQuery, pageNumber, pageSize);
        }

        public async Task<ContentPost?> GetByGuidContentAsync(Guid guid)
        {
            try
            {
                var iterator = _container.GetItemLinqQueryable<ContentPost>(requestOptions: new QueryRequestOptions 
                { 
                    MaxConcurrency = -1, 
                    MaxItemCount = 1 
                }).Where(p => p.Guid == guid)
                  .Take(1)
                  .ToFeedIterator();

                var response = await iterator.ReadNextAsync();
                return response.FirstOrDefault();
            }
            catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return null;
            }
        }

        public async Task<ContentPost> CreateContentAsync(ContentPost post)
        {
            var response = await _container.CreateItemAsync(post, new PartitionKey(post.Type));
            return response.Resource;
        }

        public async Task<ContentPost> UpdateContentAsync(ContentPost post)
        {
            var response = await _container.UpsertItemAsync(post, new PartitionKey(post.Type));
            return response.Resource;
        }

        public async Task<ContentPost?> GetBySlugContentAsync(string slug, string type)
        {
            try
            {
                var iterator = _container.GetItemLinqQueryable<ContentPost>(requestOptions: new QueryRequestOptions { PartitionKey = new PartitionKey(type) })
                    .Where(p => p.Slug == slug)
                    .Take(1)
                    .ToFeedIterator();

                var response = await iterator.ReadNextAsync();
                return response.FirstOrDefault();
            }
            catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return null;
            }
        }
    }
}
