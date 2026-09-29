using Google.Cloud.Firestore;
using house_proj.Server.Data.Model;
using house_proj.Server.Data.Repositories;

namespace house_proj.Server.Data.Database.Firebase
{
    public class FirestoreEmployeeRepository : FirestoreBaseRepository, IEmployeeRepository
    {
        private readonly string _collectionName = "Employees";

        public FirestoreEmployeeRepository(FirestoreDb firestoreDb) : base(firestoreDb)
        {
        }

        public async Task<(IEnumerable<EmployeeProfile> Items, int TotalCount)> GetEmployeesAsync(int pageNumber, int pageSize, bool? isActive = null)
        {
            // 1. Create the query on the Employees collection
            Query query = _firestoreDb.Collection(_collectionName);

            // 2. Filter by status if provided
            if (isActive.HasValue)
            {
                query = query.WhereEqualTo("IsActive", isActive.Value);
            }

            // 3. Optional: Add a default sort (e.g., by Name)
            query = query.OrderBy("Name");

            // 4. Use your new base class to handle the heavy lifting
            return await ApplyPaginationAsync<EmployeeProfile>(query, pageNumber, pageSize);
        }

        public async Task<EmployeeProfile?> GetEmployeeByIdAsync(Guid id)
        {
            // In Firestore, we use the ID as the Document Name
            DocumentReference docRef = _firestoreDb.Collection(_collectionName).Document(id.ToString());
            DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();

            if (snapshot.Exists)
            {
                return snapshot.ConvertTo<EmployeeProfile>();
            }

            return null;
        }

        public async Task<EmployeeProfile> AddEmployeeAsync(EmployeeProfile employee)
        {
            // 1. Double check: If for ANY reason Guid is null or empty, fix it here
            if (!employee.Guid.HasValue || employee.Guid == Guid.Empty)
            {
                employee.Guid = Guid.NewGuid();
            }

            // 2. Capture the ID string and ensure it's not empty
            string docId = employee.Guid.Value.ToString();

            if (string.IsNullOrWhiteSpace(docId))
            {
                throw new ArgumentException("Generated Document ID is empty. This should not happen.");
            }

            // 3. Reference the document
            DocumentReference docRef = _firestoreDb.Collection(_collectionName).Document(docId);

            // 4. Save
            await docRef.SetAsync(employee);

            return employee;
        }

        public async Task<EmployeeProfile> UpdateEmployeeAsync(EmployeeProfile employee)
        {
            // SetAsync acts as an Upsert (Update or Insert)
            DocumentReference docRef = _firestoreDb.Collection(_collectionName).Document(employee.Guid.ToString());

            await docRef.SetAsync(employee);
            return employee;
        }
    }
}
