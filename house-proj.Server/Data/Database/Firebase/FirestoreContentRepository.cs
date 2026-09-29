using Google.Cloud.Firestore;
using house_proj.Server.Data.Model;
using house_proj.Server.Data.Repositories;

namespace house_proj.Server.Data.Database.Firebase
{
    public class FirestoreContentRepository :FirestoreBaseRepository, IContentRepository
    {
        private readonly string _collectionName = "ContentPosts";

        public FirestoreContentRepository(FirestoreDb firestoreDb) : base(firestoreDb)
        {
        }

        public async Task<(IEnumerable<ContentPostListDto> Items, int TotalCount)> GetAllContentAsync(
            int pageNumber,
            int pageSize,
            bool? isEnabled = null)
        {
            // 1. Start with the collection reference
            Query query = _firestoreDb.Collection(_collectionName);

            // 2. Apply Filters (Firestore uses WhereEqualTo)
            if (isEnabled.HasValue)
            {
                query = query.WhereEqualTo("IsActive", isEnabled.Value);
            }

            // 3. Order by PublishedDate
            query = query.OrderByDescending("PublishedDate");

            // 4. Use the Base Repository for Pagination (Returns Full Models)
            var (models, totalCount) = await ApplyPaginationAsync<ContentPost>(query, pageNumber, pageSize);

            // 5. Manually Project to DTO (Clean DTO Pattern)
            var dtos = models.Select(p => new ContentPostListDto
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

            return (dtos, totalCount);
        }

        public async Task<ContentPost?> GetByGuidContentAsync(Guid guid)
        {
            // 1. Get a direct reference to the document using the string version of the Guid
            DocumentReference docRef = _firestoreDb.Collection(_collectionName).Document(guid.ToString());

            // 2. Fetch the snapshot
            DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();

            // 3. Convert if it exists
            if (snapshot.Exists)
            {
                return snapshot.ConvertTo<ContentPost>();
            }

            return null;
        }

        public async Task<ContentPost?> GetBySlugContentAsync(string slug, string type)
        {
            // Filtering by slug and type
            Query query = _firestoreDb.Collection(_collectionName)
                .WhereEqualTo("Slug", slug)
                .WhereEqualTo("Type", type)
                .Limit(1);

            QuerySnapshot snapshot = await query.GetSnapshotAsync();
            var doc = snapshot.Documents.FirstOrDefault();
            return doc?.ConvertTo<ContentPost>();
        }

        public async Task<ContentPost> CreateContentAsync(ContentPost post)
        {
            // We use the Guid as the Document ID string
            DocumentReference docRef = _firestoreDb.Collection(_collectionName).Document(post.Guid.ToString());
            await docRef.SetAsync(post);
            return post;
        }

        public async Task<ContentPost> UpdateContentAsync(ContentPost post)
        {
            // SetAsync with no options acts like Upsert (Update or Insert)
            DocumentReference docRef = _firestoreDb.Collection(_collectionName).Document(post.Guid.ToString());
            await docRef.SetAsync(post);
            return post;
        }
    }
}

