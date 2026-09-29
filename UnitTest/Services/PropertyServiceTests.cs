using Moq;
using Xunit;
using house_proj.Server.Services;
using house_proj.Server.Data.Repositories;
using house_proj.Server.Data.Model;
using UnitTest.DataFactory;

namespace house_proj.Tests.Services
{
    public class PropertyServiceTests
    {
        private readonly PropertyService _sut; // SUT = System Under Test
        private readonly Mock<IPropertyRepository> _repoMock = new();

        public PropertyServiceTests()
        {
            // We "Inject" the mock into the service
            _sut = new PropertyService(_repoMock.Object);
        }


        [Fact] // This marks it as a test
        public async Task AddNewPropertyAsync_ShouldAssignGuidAndEnableProperty()
        {
            // 1. ARRANGE (Set up your data)
            var testId = Guid.NewGuid();

            var inputProperty = TestPropertyData.CreateTestProperty(testId);
           
            _repoMock.Setup(repo => repo.AddPropertyAsync(It.IsAny<AvailableProperty>()))
             .ReturnsAsync(inputProperty);

            // 2. Act
            var result = await _sut.AddNewPropertyAsync(inputProperty);

            // 3. Assert
            Assert.NotNull(result);
            _repoMock.Verify(r => r.AddPropertyAsync(It.IsAny<AvailableProperty>()), Times.Once);
        }

        [Fact]
        public async Task UpdatePropertyAsync_ShouldReturnUpdatedProperty_WhenPropertyExists()
        {
            // --- ARRANGE ---
            var existingGuid = Guid.NewGuid();
            var property = TestPropertyData.CreateTestProperty(existingGuid);

            // 1. Mock the "Check": Tell the service the property EXISTS
            _repoMock.Setup(repo => repo.GetPropertyByIdAsync(existingGuid))
                     .ReturnsAsync(property);

            // 2. Mock the "Save": Tell the service the update was successful
            _repoMock.Setup(repo => repo.UpdatePropertyAsync(It.IsAny<AvailableProperty>()))
                     .ReturnsAsync((AvailableProperty p) => p);

            // --- ACT ---
            property.Name = "New Name";
            var result = await _sut.UpdatePropertyAsync(property);

            // --- ASSERT ---
            Assert.NotNull(result);
            Assert.Equal("New Name", result.Name);
            _repoMock.Verify(r => r.UpdatePropertyAsync(It.IsAny<AvailableProperty>()), Times.Once);
        }

        [Fact]
        public async Task UpdatePropertyAsync_ShouldThrowException_WhenPropertyDoesNotExist()
        {
            // --- ARRANGE ---
            var nonExistentGuid = Guid.NewGuid();
            var property = TestPropertyData.CreateTestProperty(nonExistentGuid);
            

            // Tell the mock to return NULL (simulating a missing record in Cosmos)
            _repoMock.Setup(repo => repo.GetPropertyByIdAsync(nonExistentGuid))
                     .ReturnsAsync((AvailableProperty?)null);

            // --- ACT & ASSERT ---
            // We expect the Service to throw an exception, not call the Update method
            await Assert.ThrowsAsync<KeyNotFoundException>(() => _sut.UpdatePropertyAsync(property));

            // Verify that Update was NEVER called because the check failed
            _repoMock.Verify(repo => repo.UpdatePropertyAsync(It.IsAny<AvailableProperty>()), Times.Never);
        }

        [Fact]
        public async Task GetAllPropertiesAsync_ShouldOnlyReturnEnabledProperties_WithPagination()
        {
            // --- ARRANGE ---
            int pageNumber = 1;
            int pageSize = 12;
   
            var enabledProperty = new PropertyAdminListDto
            {
                Name = "Property 1",
                Price = 100000,
                Address = "Address 1",
                IsEnabled = true
            };

            // The Repo now returns a Tuple: (IEnumerable<PropertyAdminListDto> Items, int TotalCount)
            var mockReturnItems = new List<PropertyAdminListDto> { enabledProperty };
            int mockTotalCount = 1;

            // Setup: Matching the 3-parameter signature (page, size, isEnabled)
            _repoMock.Setup(repo => repo.GetAllPropertiesAsync(pageNumber, pageSize, true))
                     .ReturnsAsync((mockReturnItems, mockTotalCount));
            // --- ACT ---
            // The service now returns a Tuple
            var (items, totalCount) = await _sut.GetAllPropertiesAsync(pageNumber, pageSize, isEnabled: true);

            // --- ASSERT ---
            var list = items.ToList();
            Assert.Single(list);
            Assert.Equal(mockTotalCount, totalCount);
            Assert.True(list.First().IsEnabled);

            // VERIFY: Ensures the Service correctly passed the pagination logic to the Repository
            _repoMock.Verify(repo => repo.GetAllPropertiesAsync(pageNumber, pageSize, true), Times.Once);
        }

        [Theory]
        [InlineData(100, 12)] // Size 100 should be capped at 25
        [InlineData(0, 12)]   // Size 0 should default to 12 (or your chosen default)
        [InlineData(-5, 12)]  // Negative size should default to 12
        public async Task GetPropertiesPagedAsync_ShouldCorrectInvalidPageSize(int inputSize, int expectedSize)
        {
            // --- ARRANGE ---
            // The Repo now expects 7 arguments: 
            // (pageSize, isEnabled, nameTerm, addressTerm, type, subType, continuationToken)
            _repoMock.Setup(r => r.GetPropertiesPagedAsync(
                It.IsAny<int>(),
                It.IsAny<bool?>(),
                It.IsAny<string?>(),
                It.IsAny<string?>(),
                It.IsAny<PropertyType?>(),
                It.IsAny<SubPropertyType?>(),
                It.IsAny<string?>())) // 🎯 Continuation Token
            .ReturnsAsync((new List<PropertyCardDto>(), "mock-next-token", 0));

            // --- ACT ---
            // Note: inputPage is gone. We only pass pageSize and filters + token.
            await _sut.GetPropertiesPagedAsync(inputSize, null, null, null, null, null, null);

            // --- ASSERT ---
            // Verify that the repository received the CORRECTED pageSize
            _repoMock.Verify(r => r.GetPropertiesPagedAsync(
                expectedSize,
                true,
                null,
                null,
                null,
                null,
                null),
                Times.Once);
        }

        [Fact]
        public async Task GetPropertiesPagedAsync_WithValidSearch_ShouldPassDataToRepo()
        {
            // --- ARRANGE ---
            string nameTerm = "Manila";
            string addressTerm = "Makati";
            string? mockToken = "start-token";
            string nextToken = "next-token";

            var mockProperties = new List<PropertyCardDto> { TestPropertyData.CreateTestPropertyCard() };

            // 🎯 Setup matching the 7-parameter signature:
            // (pageSize, isEnabled, nameTerm, addressTerm, type, subType, continuationToken)
            _repoMock.Setup(r => r.GetPropertiesPagedAsync(10, true, nameTerm, addressTerm, null, null, mockToken))
                     .ReturnsAsync((mockProperties, nextToken, 1));

            // --- ACT ---
            // Note: pageNumber (the '1') is removed from the service call
            var (items, returnedToken, totalCount) = await _sut.GetPropertiesPagedAsync(10, true, nameTerm, addressTerm, null, null, mockToken);

            // --- ASSERT ---
            Assert.Single(items);
            Assert.Equal(1, totalCount);
            Assert.Equal(nextToken, returnedToken);

            // VERIFY: Prove the service layer didn't drop or change any of the search strings or the token
            _repoMock.Verify(r => r.GetPropertiesPagedAsync(10, true, nameTerm, addressTerm, null, null, mockToken), Times.Once);
        }

        [Fact]
        public async Task GetPropertiesPagedAsync_IgnoresWhitespaceSearch()
        {
            // --- ARRANGE ---
            string whitespaceName = "    ";
            string whitespaceAddress = "    ";
            int pageSize = 25;
            string? token = null;

            // Service now expects a 3-value tuple return
            _repoMock.Setup(r => r.GetPropertiesPagedAsync(
                pageSize,
                true,
                whitespaceName,
                whitespaceAddress,
                null,
                null,
                token))
            .ReturnsAsync((new List<PropertyCardDto>(), null, 0));

            // --- ACT ---
            // Update: Removed pageNumber, added token parameter
            await _sut.GetPropertiesPagedAsync(pageSize, true, whitespaceName, whitespaceAddress, null, null, token);

            // --- ASSERT ---
            // Verification ensures that the service layer correctly passes the whitespace 
            // to the Repository which handles the filtering logic.
            _repoMock.Verify(r => r.GetPropertiesPagedAsync(
                pageSize,
                true,
                whitespaceName,
                whitespaceAddress,
                null,
                null,
                token),
                Times.Once);
        }
    }


}