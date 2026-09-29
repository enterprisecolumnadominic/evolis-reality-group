using house_proj.Server.Data.Model;
using house_proj.Server.Data.Repositories;
using house_proj.Server.Data.Services;
using MailKit.Search;

namespace house_proj.Server.Services
{
    public class PropertyService : IPropertyService
    {
        private readonly IPropertyRepository _repository;

        public PropertyService(IPropertyRepository repository)
        {
            _repository = repository;
        }

        // 1. GET ALL (With Business Logic)
        // 1. GET ALL (Updated with Pagination for Admin/Full Data)
        public async Task<(IEnumerable<PropertyAdminListDto> Items, int TotalCount)> GetAllPropertiesAsync(
            int pageNumber,
            int pageSize,
            bool? isEnabled = null)
        {
            // Business Logic: Sanitize pagination inputs
            if (pageNumber < 1) pageNumber = 1;
            if (pageSize < 1 || pageSize > 12) pageSize = 12;

            // Return the full model tuple from the repository
            return await _repository.GetAllPropertiesAsync(pageNumber, pageSize, isEnabled);
        }

        // 2. GET BY ID
        public async Task<AvailableProperty?> GetPropertyByIdAsync(Guid id)
        {
            return await _repository.GetPropertyByIdAsync(id);
        }

        // 3. CREATE
        public async Task<AvailableProperty> AddNewPropertyAsync(AvailableProperty property)
        {
            if (property.Guid == Guid.Empty)
            {
                property.Guid = Guid.NewGuid();
            }

            property.IsEnabled = true; // New properties active by default

            await _repository.AddPropertyAsync(property);
            return property;
        }

        // 4. UPDATE
        public async Task<AvailableProperty> UpdatePropertyAsync(AvailableProperty property)
        {
            // Verification step
            var existing = await _repository.GetPropertyByIdAsync(property.Guid);

            if (existing == null)
            {
                throw new KeyNotFoundException($"Property with ID {property.Guid} not found.");
            }

            // Repository call
            return await _repository.UpdatePropertyAsync(property);
        }

        public async Task<(IEnumerable<PropertyCardDto> Items, string? NextToken, int TotalCount)> GetPropertiesPagedAsync(
         int pageSize,
         bool? isEnabled,
         string? nameTerm,
         string? addressTerm,
         PropertyType? type,
         SubPropertyType? subType,
         string? continuationToken) //Accept string token instead of pageNumber
        {
            isEnabled = true;
            // 1. Validation: Keep the page size within a safe range for RU management
            if (pageSize < 1 || pageSize > 50) pageSize = 12;

            // 2. Pass everything to the repository
            // The repository now returns the 'NextToken' string alongside the items
            return await _repository.GetPropertiesPagedAsync(
                pageSize,
                isEnabled,
                nameTerm,
                addressTerm,
                type,
                subType,
                continuationToken);
        }

     
    }
}