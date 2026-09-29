using house_proj.Server.Controllers;
using house_proj.Server.Data.Model;
using house_proj.Server.Data.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnitTest.DataFactory;

namespace UnitTest.Controller
{
    public class EmployeesControllerTests
    {
        private readonly Mock<IEmployeeService> _mockService;
        private readonly Mock<ILogger<EmployeesController>> _mockLogger; // 🎯 Added Logger Mock
        private readonly EmployeesController _controller;

        public EmployeesControllerTests()
        {
            _mockService = new Mock<IEmployeeService>();
            _mockLogger = new Mock<ILogger<EmployeesController>>(); // 🎯 Initialize Logger Mock

            // Pass both mocks to the controller
            _controller = new EmployeesController(_mockService.Object, _mockLogger.Object);
        }

        [Fact]
        public async Task GetEmployees_ReturnsOk_WithPagedResponse()
        {
            // Arrange
            var testEmployee = TestEmloyeeData.CreateTestEmployee();
            var items = new List<EmployeeProfile> { testEmployee };
            int totalCount = 1;

            // 🎯 Setup must return the Tuple: (IEnumerable<EmployeeProfile>, int)
            // 🎯 Signature must match: (int, int, bool?)
            _mockService.Setup(s => s.GetEmployeesAsync(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<bool?>()))
                        .ReturnsAsync((items, totalCount));

            // Act
            // Passing default pagination values
            var result = await _controller.GetEmployees(1, 12, null);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);

            // 🎯 Check that the value is a PagedResponse, not a List
            var response = Assert.IsType<PagedResponse<EmployeeProfile>>(okResult.Value);

            Assert.Single(response.Items);
            Assert.Equal(totalCount, response.TotalCount);
            Assert.Equal(1, response.TotalPages);
        }

        [Fact]
        public async Task GetEmployee_ReturnsNotFound_WhenGuidDoesNotExist()
        {
            // Arrange
            var testId = Guid.NewGuid();
            _mockService.Setup(s => s.GetEmployeeByIdAsync(testId))
                        .ReturnsAsync((EmployeeProfile?)null);

            // Act
            var result = await _controller.GetEmployee(testId);

            // Assert
            Assert.IsType<NotFoundObjectResult>(result.Result);
        }

        [Fact]
        public async Task CreateEmployee_ReturnsCreated_WithValidData()
        {
            // Arrange
            var newEmployee = TestEmloyeeData.CreateTestEmployee();
            _mockService.Setup(s => s.CreateEmployeeAsync(It.IsAny<EmployeeProfile>()))
                        .ReturnsAsync(newEmployee);

            // Act
            var result = await _controller.CreateEmployee(newEmployee);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            Assert.Equal(201, createdResult.StatusCode);
            Assert.Equal(newEmployee.Guid, ((EmployeeProfile)createdResult.Value!).Guid);
        }

        [Fact]
        public async Task UpdateEmployee_ReturnsNoContent_WhenIdsMatch()
        {
            // Arrange
            var employee = TestEmloyeeData.CreateTestEmployee();
            var employeeId = employee.Guid.GetValueOrDefault(); // The ID from the object

            _mockService.Setup(s => s.UpdateEmployeeAsync(employee))
                        .ReturnsAsync(employee);

            // Act - Pass the ID separately to match the new [HttpPut("{guid:guid}")]
            var result = await _controller.UpdateEmployee(employeeId, employee);

            // Assert
            Assert.IsType<NoContentResult>(result);
            _mockService.Verify(s => s.UpdateEmployeeAsync(employee), Times.Once);
        }

        [Fact]
        public async Task UpdateEmployee_ReturnsBadRequest_WhenIdsDoNotMatch()
        {
            // Arrange
            var employee = TestEmloyeeData.CreateTestEmployee();
            var differentId = Guid.NewGuid(); // A random ID that doesn't match the object

            // Act
            var result = await _controller.UpdateEmployee(differentId, employee);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Contains("ID mismatch", badRequestResult.Value?.ToString());

            // Ensure the service was NEVER called because the controller blocked it
            _mockService.Verify(s => s.UpdateEmployeeAsync(It.IsAny<EmployeeProfile>()), Times.Never);
        }
    }
}
