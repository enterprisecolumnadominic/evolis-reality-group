using house_proj.Server.Data.Model;

namespace house_proj.Server.Data.Repositories
{
    public interface IEmployeeRepository
    {
        Task<(IEnumerable<EmployeeProfile> Items, int TotalCount)> GetEmployeesAsync(int pageNumber,int pageSize,bool? isActive = null);
        Task<EmployeeProfile?> GetEmployeeByIdAsync(Guid id);
        Task<EmployeeProfile> AddEmployeeAsync(EmployeeProfile employee);
        Task<EmployeeProfile> UpdateEmployeeAsync(EmployeeProfile employee);
    }
}
