using Google.Cloud.Firestore;

namespace house_proj.Server.Data.Database.Firebase
{
    public abstract class FirestoreBaseRepository
    {
        protected readonly FirestoreDb _firestoreDb;

        protected FirestoreBaseRepository(FirestoreDb firestoreDb)
        {
            _firestoreDb = firestoreDb;
        }

        protected async Task<(IEnumerable<T> Items, int TotalCount)> ApplyPaginationAsync<T>(
            Query query,
            int pageNumber,
            int pageSize) where T : class
        {
            // 1. Get Total Count (Firestore "Aggregation" is efficient)
            AggregateQuery countQuery = query.Count();
            AggregateQuerySnapshot countSnapshot = await countQuery.GetSnapshotAsync();
            int totalCount = (int)countSnapshot.Count;

            // 2. Build Page logic using Offset and Limit
            // Note: pageNumber 1 = offset 0
            Query pagedQuery = query
                .Offset((pageNumber - 1) * pageSize)
                .Limit(pageSize);

            // 3. Execute
            QuerySnapshot snapshot = await pagedQuery.GetSnapshotAsync();

            // 4. Map to your FirestoreData models
            var results = snapshot.Documents
                .Select(doc => doc.ConvertTo<T>())
                .ToList();

            return (results, totalCount);
        }
    }
}
