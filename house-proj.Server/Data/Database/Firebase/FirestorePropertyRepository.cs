using Google.Cloud.Firestore;
using house_proj.Server.Data.Database.Firebase;
using house_proj.Server.Data.Model;
using house_proj.Server.Data.Repositories;

namespace house_proj.Server.Data.Repository
{
    public class FirestorePropertyRepository : FirestoreBaseRepository, IPropertyRepository
    {
        private readonly string _collectionName = "Properties";

        public FirestorePropertyRepository(FirestoreDb firestoreDb) : base(firestoreDb)
        {
        }

        public async Task<(IEnumerable<PropertyAdminListDto> Items, int TotalCount)> GetAllPropertiesAsync(
            int pageNumber,
            int pageSize,
            bool? isEnabled = null)
        {
            Query query = _firestoreDb.Collection(_collectionName);

            if (isEnabled.HasValue)
                query = query.WhereEqualTo("IsEnabled", isEnabled.Value);

            query = query.OrderByDescending("DateCreated");

            var (models, totalCount) = await ApplyPaginationAsync<AvailableProperty>(query, pageNumber, pageSize);

            // Manual mapping to Admin DTO
            var dtos = models.Select(p => new PropertyAdminListDto
            {
                Guid = p.Guid,
                Name = p.Name,
                Price = (decimal)p.Price,
                Address = p.Address,
                PropertyType = p.PropertyType,
                SubPropertyType = p.SubPropertyType,
                ThumbnailUrl = p.MediaItems.FirstOrDefault()?.Url,
                DateCreated = p.DateCreated,
                EmployeeProfileID = p.EmployeeProfileID,
                IsEnabled = p.IsEnabled
            });

            return (dtos, totalCount);
        }

        public async Task<AvailableProperty?> GetPropertyByIdAsync(Guid id)
        {
            DocumentReference docRef = _firestoreDb.Collection(_collectionName).Document(id.ToString());
            DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();
            return snapshot.Exists ? snapshot.ConvertTo<AvailableProperty>() : null;
        }

        public async Task<AvailableProperty> AddPropertyAsync(AvailableProperty property)
        {
            property.NameKeywords = Tokenize(property.Name);       // "Towers 11" -> ["towers", "11"]
            property.AddressKeywords = Tokenize(property.Address); // "Makati" -> ["makati"]

            // 2. Save to Firestore
            var docRef = _firestoreDb.Collection(_collectionName).Document(property.Guid.ToString());
            await docRef.SetAsync(property);
            return property;
        }

        public async Task<AvailableProperty> UpdatePropertyAsync(AvailableProperty property)
        {
            DocumentReference docRef = _firestoreDb.Collection(_collectionName).Document(property.Guid.ToString());
            await docRef.SetAsync(property);
            return property;
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
            Query query = _firestoreDb.Collection(_collectionName);

            // 1. Fixed Database Filters
            if (isEnabled.HasValue) query = query.WhereEqualTo("IsEnabled", isEnabled.Value);
            if (type.HasValue) query = query.WhereEqualTo("PropertyType", (int)type.Value);
            if (subType.HasValue) query = query.WhereEqualTo("SubPropertyType", (int)subType.Value);

            // 2. The One-Array Rule (Database Side)
            if (!string.IsNullOrWhiteSpace(nameTerm))
            {
                query = query.WhereArrayContains("NameKeywords", nameTerm.ToLower().Trim());
            }
            else if (!string.IsNullOrWhiteSpace(addressTerm))
            {
                query = query.WhereArrayContains("AddressKeywords", addressTerm.ToLower().Trim());
            }
            else
            {
                query = query.OrderByDescending("DateCreated");
            }

            // 3. Execution
            // Note: If both terms are used, we don't apply .Limit() yet because 
            // the C# filter might remove items.
            bool isHybrid = !string.IsNullOrWhiteSpace(nameTerm) && !string.IsNullOrWhiteSpace(addressTerm);
            if (!isHybrid) query = query.Limit(pageSize);

            QuerySnapshot snapshot = await query.GetSnapshotAsync();

            // 4. The Hybrid Step (In-Memory Filtering)
            var filteredDocs = snapshot.Documents.AsEnumerable();

            if (isHybrid)
            {
                var lowerAddress = addressTerm!.ToLower().Trim();
                filteredDocs = filteredDocs.Where(doc =>
                    doc.GetValue<List<string>>("AddressKeywords").Contains(lowerAddress));
            }

            // 5. Mapping the filtered results
            var results = filteredDocs.Select(doc => {
                var p = doc.ConvertTo<AvailableProperty>();
                Guid actualGuid = Guid.TryParse(doc.Id, out var g) ? g : Guid.Empty;

                return new PropertyCardDto
                {
                    Guid = actualGuid,
                    Name = p.Name,
                    Price = (decimal)p.Price,
                    Address = p.Address,
                    Bedrooms = p.Bedrooms,
                    Levels = p.Levels,
                    FloorSpace = p.FloorSpace,
                    Bathrooms = p.Bathrooms,
                    PropertyType = p.PropertyType,
                    SubPropertyType = p.SubPropertyType,
                    ThumbnailUrl = p.MediaItems?.FirstOrDefault()?.Url,
                    DateCreated = p.DateCreated
                };
            }).ToList();

            // 6. Pagination & Totals
            int totalCount = results.Count; // In hybrid, we use the local count
            string? nextToken = snapshot.Documents.Count >= pageSize
                    ? snapshot.Documents.Last().Id
                    : null;

            return (results, nextToken, totalCount);
        }

        private List<string> Tokenize(string input)
        {
            if (string.IsNullOrWhiteSpace(input)) return new List<string>();

            var keywords = new HashSet<string>();
            var words = input.ToLower().Split(new[] { ' ', ',', '.', '-' }, StringSplitOptions.RemoveEmptyEntries);

            foreach (var word in words)
            {
                // Add the word itself
                keywords.Add(word);

                // Add the prefixes (the "T", "To", "Tow" logic)
                for (int i = 1; i <= word.Length; i++)
                {
                    keywords.Add(word.Substring(0, i));
                }
            }

            return keywords.ToList();
        }
    }
}