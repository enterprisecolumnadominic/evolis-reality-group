using Asp.Versioning;
using house_proj.Server.Data.Model;
using house_proj.Server.Data.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace house_proj.Server.Controllers
{
    [Authorize]
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;
        private readonly ILogger<EmployeesController> _logger;

        public EmployeesController(IEmployeeService employeeService, ILogger<EmployeesController> logger)
        {
            _employeeService = employeeService;
            _logger = logger;
        }

        // GET: api/employees?isActive=true&pageNumber=1&pageSize=12
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<PagedResponse<EmployeeProfile>>> GetEmployees(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 12,
            [FromQuery] bool? isActive = null)
        {
            try
            {
                var (items, totalCount) = await _employeeService.GetEmployeesAsync(pageNumber, pageSize, isActive);

                var response = new PagedResponse<EmployeeProfile>
                {
                    Items = items,
                    TotalCount = totalCount,
                    CurrentPage = pageNumber,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching employees. Page: {Page}, Size: {Size}", pageNumber, pageSize);
                return StatusCode(500, "An internal error occurred.");
            }
        }

        [AllowAnonymous]
        [HttpGet("{guid:guid}")]
        public async Task<ActionResult<EmployeeProfile>> GetEmployee(Guid guid)
        {
            try
            {
                var employee = await _employeeService.GetEmployeeByIdAsync(guid);

                if (employee == null)
                {
                    return NotFound($"Employee with ID {guid} not found.");
                }

                return Ok(employee);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error getting employee {Guid}", guid);
                return StatusCode(500, $"Could not get employee: {ex.Message}");
            }

        }

        // POST: api/employees
        [HttpPost]
        public async Task<ActionResult<EmployeeProfile>> CreateEmployee([FromBody] EmployeeProfile employee)
        {
            try
            {
                // Let the service handle the ID generation and tokenization
                var createdEmployee = await _employeeService.CreateEmployeeAsync(employee);

                return CreatedAtAction(nameof(GetEmployee), new { guid = createdEmployee.Guid }, createdEmployee);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating employee: {EmployeeName}", employee.Name);
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/employees/{guid}
        [HttpPut("{guid:guid}")]
        public async Task<IActionResult> UpdateEmployee(Guid guid, [FromBody] EmployeeProfile employee)
        {
            if (employee.Guid != Guid.Empty && employee.Guid != guid)
            {
                return BadRequest(new { message = "ID mismatch: URL ID does not match body ID." });
            }

            employee.Guid = guid;

            try
            {
                await _employeeService.UpdateEmployeeAsync(employee);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning(ex, "Update failed: Employee with ID {Guid} not found.", guid);
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error updating employee {Guid}", guid);
                return StatusCode(500, "An error occurred while updating the employee.");
            }
        }
    }
}
