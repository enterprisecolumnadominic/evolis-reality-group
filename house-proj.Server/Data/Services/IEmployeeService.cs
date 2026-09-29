using house_proj.Server.Data.Model;

namespace house_proj.Server.Data.Services
{
    public interface IEmployeeService
    {
        Task<(IEnumerable<EmployeeProfile> Items, int TotalCount)> GetEmployeesAsync(int pageNumber,int pageSize,bool? isActive = null);
        Task<EmployeeProfile?> GetEmployeeByIdAsync(Guid guid);
        Task<EmployeeProfile> CreateEmployeeAsync(EmployeeProfile employee);
        Task<EmployeeProfile> UpdateEmployeeAsync(EmployeeProfile employee);
    }
}
