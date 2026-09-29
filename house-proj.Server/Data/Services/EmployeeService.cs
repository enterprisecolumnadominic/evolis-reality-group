using house_proj.Server.Data.Model;
using house_proj.Server.Data.Repositories;

namespace house_proj.Server.Data.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository _employeeRepository;

        public EmployeeService(IEmployeeRepository employeeRepository)
        {
            _employeeRepository = employeeRepository;
        }
        public async Task<(IEnumerable<EmployeeProfile> Items, int TotalCount)> GetEmployeesAsync( int pageNumber,int pageSize,bool? isActive = null)
        {
            if (pageNumber < 1) pageNumber = 1;
            if (pageSize < 1 || pageSize > 12) pageSize = 12;

            return await _employeeRepository.GetEmployeesAsync(pageNumber, pageSize, isActive);
        }


        public async Task<EmployeeProfile?> GetEmployeeByIdAsync(Guid guid)
        {
            return await _employeeRepository.GetEmployeeByIdAsync(guid);
        }

        public async Task<EmployeeProfile> CreateEmployeeAsync(EmployeeProfile employee)
        {
            if (employee.Guid == Guid.Empty)
            {
                employee.Guid = Guid.NewGuid();
            }

            return await _employeeRepository.AddEmployeeAsync(employee);
        }

        public async Task<EmployeeProfile> UpdateEmployeeAsync(EmployeeProfile employee)
        {
            var existing = await _employeeRepository.GetEmployeeByIdAsync(employee.Guid.GetValueOrDefault());
            if (existing == null)
            {
                // Changed "Property" to "Employee" 
                throw new KeyNotFoundException($"Employee with ID {employee.Guid} not found.");
            }

            return await _employeeRepository.UpdateEmployeeAsync(employee);
        }


    }
}
