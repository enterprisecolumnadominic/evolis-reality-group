using house_proj.Server.Data.Model;
using house_proj.Server.Data.Repositories;
using house_proj.Server.Data.Services;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnitTest.DataFactory;

namespace UnitTest.Services
{
    public class EmployeeServiceTests
    {
        private readonly Mock<IEmployeeRepository> _mockRepo;
        private readonly EmployeeService _service;

        public EmployeeServiceTests()
        {
            // 1. Create a "Fake" Repository
            _mockRepo = new Mock<IEmployeeRepository>();

            // 2. Inject the fake repo into the real service
            _service = new EmployeeService(_mockRepo.Object);
        }

        [Fact]
        public async Task GetEmployeesAsync_ShouldReturnActiveEmployees_WhenRequested()
        {
            // Arrange: Setup our test data and the expected Tuple result
            var testEmployee = TestEmloyeeData.CreateTestEmployee();
            var employeeList = new List<EmployeeProfile> { testEmployee };

            // 🎯 Wrap the list in the Tuple structure the Repo now returns
            var mockResult = (Items: (IEnumerable<EmployeeProfile>)employeeList, TotalCount: 1);

            // Setup the mock to expect the 3 parameters: page, size, and isActive
            _mockRepo.Setup(repo => repo.GetEmployeesAsync(It.IsAny<int>(), It.IsAny<int>(), true))
                     .ReturnsAsync(mockResult);

            // Act: Call the service with pagination and filter
            var result = await _service.GetEmployeesAsync(pageNumber: 1, pageSize: 5, isActive: true);

            // Assert: Verify the results inside the returned Tuple
            Assert.NotNull(result.Items);
            Assert.Equal(1, result.TotalCount);
            Assert.Single(result.Items);
            Assert.Equal(testEmployee.Name, result.Items.First().Name);

            // 🎯 Verify the Repo was actually called with the correct filtered arguments
            _mockRepo.Verify(repo => repo.GetEmployeesAsync(1, 5, true), Times.Once);
        }

        [Fact]
        public async Task CreateEmployeeAsync_ShouldAssignNewGuid_WhenGuidIsEmpty()
        {
            // Arrange: Create an employee with an empty GUID
            var newEmployee = TestEmloyeeData.CreateTestEmployee(id: Guid.Empty);

            _mockRepo.Setup(repo => repo.AddEmployeeAsync(It.IsAny<EmployeeProfile>()))
                     .ReturnsAsync((EmployeeProfile e) => e);

            // Act
            var result = await _service.CreateEmployeeAsync(newEmployee);

            // Assert
            Assert.NotEqual(Guid.Empty, result.Guid); // Service should have generated a new ID
            _mockRepo.Verify(repo => repo.AddEmployeeAsync(It.IsAny<EmployeeProfile>()), Times.Once);
        }

        [Fact]
        public async Task GetEmployeeByIdAsync_ShouldReturnEmployee_WhenIdExists()
        {
            // Arrange
            var testId = Guid.NewGuid();
            var testEmployee = TestEmloyeeData.CreateTestEmployee(id: testId);

            _mockRepo.Setup(r => r.GetEmployeeByIdAsync(testId))
                     .ReturnsAsync(testEmployee);

            // Act
            var result = await _service.GetEmployeeByIdAsync(testId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(testId, result!.Guid);
        }

        [Fact]
        public async Task GetEmployeeByIdAsync_ShouldReturnNull_WhenIdDoesNotExist()
        {
            // Arrange
            var missingId = Guid.NewGuid();
            _mockRepo.Setup(r => r.GetEmployeeByIdAsync(missingId))
                     .ReturnsAsync((EmployeeProfile?)null);

            // Act
            var result = await _service.GetEmployeeByIdAsync(missingId);

            // Assert
            Assert.Null(result); // This confirms your controller will later return a 404
        }

        [Fact]
        public async Task UpdateEmployeeAsync_ShouldSucceed_WhenEmployeeExists()
        {
            // 1. --- ARRANGE ---
            var employee = TestEmloyeeData.CreateTestEmployee();

            // Setup the FIRST call (The check)
            _mockRepo.Setup(r => r.GetEmployeeByIdAsync(employee.Guid.GetValueOrDefault()))
                     .ReturnsAsync(employee);

            // Setup the SECOND call (The actual update)
            _mockRepo.Setup(r => r.UpdateEmployeeAsync(It.IsAny<EmployeeProfile>()))
                     .ReturnsAsync(employee);

            // 2. --- ACT ---
            var result = await _service.UpdateEmployeeAsync(employee);

            // 3. --- ASSERT ---
            Assert.NotNull(result);
            _mockRepo.Verify(r => r.UpdateEmployeeAsync(It.IsAny<EmployeeProfile>()), Times.Once);
        }

        [Fact]
        public async Task UpdateEmployeeAsync_ShouldThrowException_WhenEmployeeDoesNotExist()
        {
            // Arrange
            var ghostEmployee = TestEmloyeeData.CreateTestEmployee();

            // Force the repo to return null for the check
            _mockRepo.Setup(r => r.GetEmployeeByIdAsync(ghostEmployee.Guid.GetValueOrDefault()))
                     .ReturnsAsync((EmployeeProfile?)null);

            // Act & Assert
            // We expect the Service to throw the KeyNotFoundException
            await Assert.ThrowsAsync<KeyNotFoundException>(() =>
                _service.UpdateEmployeeAsync(ghostEmployee));
        }

        [Theory]
        [InlineData(true)]
        [InlineData(false)]
        [InlineData(null)]
        public async Task GetEmployeesAsync_ShouldPassCorrectFilterToRepo(bool? status)
        {
            // Arrange
            int pageNumber = 1;
            int pageSize = 5;

            // Create the expected return tuple
            var mockResult = (
                Items: (IEnumerable<EmployeeProfile>)new List<EmployeeProfile>(),
                TotalCount: 0
            );

            // 🎯 The Setup must now include pageNumber and pageSize
            _mockRepo.Setup(r => r.GetEmployeesAsync(It.IsAny<int>(), It.IsAny<int>(), status))
                     .ReturnsAsync(mockResult);

            // Act
            await _service.GetEmployeesAsync(pageNumber, pageSize, isActive: status);

            // Assert
            // 🎯 Verify that the Service passed the params correctly to the Repo
            _mockRepo.Verify(r => r.GetEmployeesAsync(
                It.Is<int>(p => p == pageNumber),
                It.Is<int>(s => s == pageSize),
                status),
            Times.Once);
        }
    }


}

