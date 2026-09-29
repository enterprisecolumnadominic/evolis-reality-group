using house_proj.Server.Data.Model;

namespace house_proj.Server.Data.Services
{
    public interface IContentService
    {
        // Retrieval
        Task<(IEnumerable<ContentPostListDto> Items, int TotalCount)> GetAllContentAsync(
         int pageNumber,
         int pageSize,
         bool? isEnabled = null);
        Task<ContentPost?> GetContentByGuidAsync(Guid guid);

        // Persistence
        Task<ContentPost> CreateContentAsync(ContentPost post);
        Task<ContentPost> UpdateContentAsync(ContentPost post);

        // Specialized Logic
        Task<ContentPost?> GetContentBySlugAsync(string slug, string type);

    }
}
