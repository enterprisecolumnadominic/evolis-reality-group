using house_proj.Server.Data.Model;

namespace house_proj.Server.Data.Repositories
{
    public interface IContentRepository
    {
        Task<ContentPost?> GetByGuidContentAsync(Guid guid);
        Task<ContentPost> CreateContentAsync(ContentPost post);
        Task<ContentPost> UpdateContentAsync(ContentPost post);
        Task<ContentPost?> GetBySlugContentAsync(string slug, string type);
        Task<(IEnumerable<ContentPostListDto> Items, int TotalCount)> GetAllContentAsync(int pageNumber, int pageSize, bool? isEnabled = null);

    }
}
