using house_proj.Server.Data.Model;

namespace house_proj.Server.Data.Repositories
{
    public interface IPropertyRepository
    {
        Task<(IEnumerable<PropertyAdminListDto> Items, int TotalCount)> GetAllPropertiesAsync(int pageNumber, int pageSize, bool? isEnabled = null);
        Task<AvailableProperty?> GetPropertyByIdAsync(Guid id);
        Task<AvailableProperty> AddPropertyAsync(AvailableProperty property); // Must return <AvailableProperty>
        Task<AvailableProperty> UpdatePropertyAsync(AvailableProperty property); // Must return <AvailableProperty>
        Task<(IEnumerable<PropertyCardDto> Items, string? NextToken, int TotalCount)> GetPropertiesPagedAsync(
         int pageSize,
         bool? isEnabled,
         string? nameTerm,
         string? addressTerm,
         PropertyType? type,
         SubPropertyType? subType,
         string? continuationToken);
    }
}
