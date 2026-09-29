using house_proj.Server.Data.Model;
using house_proj.Server.Data.Repositories;
using Microsoft.Azure.Cosmos.Linq;
using System.Text.RegularExpressions;

namespace house_proj.Server.Data.Services
{
    public class ContentService : IContentService
    {
        private readonly IContentRepository _repository;

        public ContentService(IContentRepository repository)
        {
            _repository = repository;
        }

        public async Task<(IEnumerable<ContentPostListDto> Items, int TotalCount)> GetAllContentAsync(int pageNumber, int pageSize, bool? isEnabled = null)
        {
            //if admin set isEnabled = null

            if (pageNumber < 1) pageNumber = 1;
            if (pageSize < 1 || pageSize > 12) pageSize = 12;

            
            return await _repository.GetAllContentAsync(pageNumber, pageSize, isEnabled);
        }

        public async Task<ContentPost?> GetContentByGuidAsync(Guid guid)
        {
            if (guid == Guid.Empty)
            {
                return null;
            }
            return await _repository.GetByGuidContentAsync(guid);
        }

        public async Task<ContentPost> CreateContentAsync(ContentPost post)
        {
            // 1. Force a new ID if one isn't provided
            if (post.Guid == Guid.Empty)
            {
                post.Guid = Guid.NewGuid();
            }

            // 2. FIX: Ensure Dates are UTC for Firestore
            // Even if it comes from the front-end, we must explicitly set the Kind to Utc
            post.PublishedDate = DateTime.SpecifyKind(post.PublishedDate, DateTimeKind.Utc);

            if (post.EventDate.HasValue)
            {
                post.EventDate = DateTime.SpecifyKind(post.EventDate.Value, DateTimeKind.Utc);
            }

            // 3. Slug Logic
            if (string.IsNullOrWhiteSpace(post.Slug))
            {
                post.Slug = GenerateSlug(post.Title);
            }

            // 4. Collision Check
            var existing = await _repository.GetBySlugContentAsync(post.Slug, post.Type);
            if (existing != null)
            {
                post.Slug = $"{post.Slug}-{Guid.NewGuid().ToString()[..5]}";
            }

            return await _repository.CreateContentAsync(post);
        }

        public async Task<ContentPost> UpdateContentAsync(ContentPost post)
        {
            if (post.Guid == Guid.Empty)
            {
                throw new ArgumentException("A valid ID is required for updates.");
            }

            // FIX: Ensure Dates are UTC here as well
            post.PublishedDate = DateTime.SpecifyKind(post.PublishedDate, DateTimeKind.Utc);
            if (post.EventDate.HasValue)
            {
                post.EventDate = DateTime.SpecifyKind(post.EventDate.Value, DateTimeKind.Utc);
            }

            var existing = await _repository.GetByGuidContentAsync(post.Guid);
            if (existing == null)
            {
                throw new KeyNotFoundException($"Content with ID {post.Guid} not found.");
            }

            post.Slug = GenerateSlug(post.Title);
            return await _repository.UpdateContentAsync(post);
        }

        public async Task<ContentPost?> GetContentBySlugAsync(string slug, string type)
        {
            if (string.IsNullOrWhiteSpace(slug)) return null;
            return await _repository.GetBySlugContentAsync(slug, type);
        }

        // Helper Method: SEO Slug Generation
        private string GenerateSlug(string phrase)
        {
            string str = phrase.ToLower();
            str = Regex.Replace(str, @"[^a-z0-9\s-]", ""); // Remove invalid chars
            str = Regex.Replace(str, @"\s+", " ").Trim(); // convert multiple spaces into one
            str = str.Substring(0, str.Length <= 45 ? str.Length : 45).Trim(); // cut and trim
            str = Regex.Replace(str, @"\s", "-"); // spaces to hyphens
            return str;
        }
    }
}
