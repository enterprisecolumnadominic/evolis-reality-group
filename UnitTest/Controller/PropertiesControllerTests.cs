using house_proj.Server.Controllers;
using house_proj.Server.Data.Model;
using house_proj.Server.Data.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using UnitTest.DataFactory;

public class PropertiesControllerTests
{
    private readonly Mock<IPropertyService> _serviceMock;
    private readonly PropertiesController _controller;
    private readonly Mock<ILogger<PropertiesController>> _loggerMock;

    public PropertiesControllerTests()
    {
        _serviceMock = new Mock<IPropertyService>();
        _loggerMock = new Mock<ILogger<PropertiesController>>();
        _controller = new PropertiesController(_serviceMock.Object, _loggerMock.Object);
    }


    [Fact]
    public async Task GetById_ReturnsOk_WhenPropertyExists()
    {
        // Arrange
        var testId = Guid.NewGuid();
        var expected = TestPropertyData.CreateTestProperty(testId);
        _serviceMock.Setup(s => s.GetPropertyByIdAsync(testId)).ReturnsAsync(expected);

        // Act
        var result = await _controller.GetById(testId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var actual = Assert.IsType<AvailableProperty>(okResult.Value);
        Assert.Equal(expected.Guid, actual.Guid);
    }

    [Fact]
    public async Task GetById_ReturnsNotFound_WhenPropertyIsNull()
    {
        // Arrange
        var testId = Guid.NewGuid();
        _serviceMock.Setup(s => s.GetPropertyByIdAsync(testId)).ReturnsAsync((AvailableProperty?)null);

        // Act
        var result = await _controller.GetById(testId);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result.Result);
    }

    [Fact]
    public async Task GetAll_ReturnsOk_WithPaginatedObject()
    {
        // --- ARRANGE ---
        int pageNumber = 1;
        int pageSize = 12;
        var expectedProperties = new List<PropertyAdminListDto>
        {
            new PropertyAdminListDto
            {
                Guid = TestPropertyData.CreateTestProperty().Guid,
                Name = "Property 1",
                Price = 100000,
                Address = "Address 1"
            },
            new PropertyAdminListDto
            {
                Guid = TestPropertyData.CreateTestProperty().Guid,
                Name = "Property 2",
                Price = 200000,
                Address = "Address 2"
            }
        };

        // Setup: The service returns a Tuple (Items, TotalCount)
        _serviceMock.Setup(s => s.GetAllPropertiesAsync(pageNumber, pageSize, It.IsAny<bool?>()))
                    .ReturnsAsync((expectedProperties, 2));

        // --- ACT ---
        var result = await _controller.GetAll(pageNumber, pageSize, null);

        // --- ASSERT ---
        var okResult = Assert.IsType<OkObjectResult>(result);

        // 🎯 FIX: Cast to PagedResponse<AvailableProperty>
        var response = Assert.IsType<PagedResponse<PropertyAdminListDto>>(okResult.Value);

        Assert.Equal(2, response.TotalCount);
        Assert.Equal(2, response.Items.Count());
        Assert.Equal(pageNumber, response.CurrentPage);
    }

    [Fact]
    public async Task GetPaged_ReturnsOk_WithContinuationToken()
    {
        // --- ARRANGE ---
        string mockToken = "initial-token";
        string nextToken = "next-token-from-cosmos";
        var mockCards = new List<PropertyCardDto> { TestPropertyData.CreateTestPropertyCard() };

        // Set up the request object that the controller expects
        var request = new PropertySearchRequest
        {
            PageSize = 12,
            ContinuationToken = mockToken
        };

        _serviceMock.Setup(s => s.GetPropertiesPagedAsync(
            request.PageSize,
            It.IsAny<bool?>(),
            It.IsAny<string?>(),
            It.IsAny<string?>(),
            It.IsAny<PropertyType?>(),
            It.IsAny<SubPropertyType?>(),
            request.ContinuationToken))
        .ReturnsAsync((mockCards, nextToken, 1));

        // --- ACT ---
        // 🎯 FIX: Pass the request object instead of individual named parameters
        var result = await _controller.GetPaged(request);

        // --- ASSERT ---
        var okResult = Assert.IsType<OkObjectResult>(result);
        var response = Assert.IsType<PagedResponse<PropertyCardDto>>(okResult.Value);

        Assert.Equal(nextToken, response.NextToken);
        Assert.Single(response.Items);
    }
    [Fact]
    public async Task Update_ReturnsNoContent_WhenUpdateIsSuccessful()
    {
        // --- ARRANGE ---
        var testId = Guid.NewGuid();

        var propertyToUpdate = TestPropertyData.CreateTestProperty(testId);

        // We don't need a complex setup because the Service returns the object on success
        _serviceMock.Setup(s => s.UpdatePropertyAsync(It.IsAny<AvailableProperty>()))
                    .ReturnsAsync(propertyToUpdate);

        // --- ACT ---
        var result = await _controller.Update(testId,propertyToUpdate);

        // --- ASSERT ---
        Assert.IsType<NoContentResult>(result);
        _serviceMock.Verify(s => s.UpdatePropertyAsync(It.IsAny<AvailableProperty>()), Times.Once);
    }

    [Fact]
    public async Task GetPaged_Returns500_WhenServiceThrowsException()
    {
        // --- ARRANGE ---
        // Create a default request object to pass to the controller
        var request = new PropertySearchRequest();

        // 🎯 Setup matching the 7-parameter signature:
        // (pageSize, isEnabled, nameTerm, addressTerm, type, subType, continuationToken)
        _serviceMock.Setup(s => s.GetPropertiesPagedAsync(
                It.IsAny<int>(),
                It.IsAny<bool?>(),
                It.IsAny<string?>(),
                It.IsAny<string?>(),
                It.IsAny<PropertyType?>(),
                It.IsAny<SubPropertyType?>(),
                It.IsAny<string?>()))
            .ThrowsAsync(new Exception("DB is down!"));

        // --- ACT ---
        // 🎯 FIX: Pass the request object instead of empty arguments
        var result = await _controller.GetPaged(request);

        // --- ASSERT ---
        var statusCodeResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(500, statusCodeResult.StatusCode);

        // Verify the logger was called at the Error level
        _loggerMock.Verify(
            x => x.Log(
                LogLevel.Error,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => true),
                It.IsAny<Exception>(),
                It.Is<Func<It.IsAnyType, Exception?, string>>((v, t) => true)),
            Times.Once);
    }

    [Fact]
    public async Task GetPaged_ReturnsCorrectMetadata_And200Ok()
    {
        // --- ARRANGE ---
        int pageSize = 10;
        int mockTotalCount = 25;
        string mockNextToken = "token-for-page-2";

        var mockItems = new List<PropertyCardDto>
    {
        TestPropertyData.CreateTestPropertyCard(name: "Property 1"),
        TestPropertyData.CreateTestPropertyCard(name: "Property 2")
    };

        // Setup matching the 7-argument signature of the Service
        _serviceMock.Setup(s => s.GetPropertiesPagedAsync(
            pageSize, null, null, null, null, null, null))
        .ReturnsAsync((mockItems, mockNextToken, mockTotalCount));

        // 🎯 Step 1: Initialize the request object
        var request = new PropertySearchRequest
        {
            PageSize = pageSize,
            IsEnabled = null,
            NameTerm = null,
            AddressTerm = null,
            Type = null,
            SubType = null,
            ContinuationToken = null
        };

        // --- ACT ---
        // 🎯 Step 2: Pass the single 'request' object instead of 7 arguments
        var result = await _controller.GetPaged(request);

        // --- ASSERT ---
        var okResult = Assert.IsType<OkObjectResult>(result);
        var response = Assert.IsType<PagedResponse<PropertyCardDto>>(okResult.Value);

        Assert.Equal(mockTotalCount, response.TotalCount);
        Assert.Equal(3, response.TotalPages);
        Assert.Equal(mockNextToken, response.NextToken);
        Assert.Equal(2, response.Items.Count());
    }

    [Fact]
    public async Task GetPaged_WithSearchTerms_ReturnsFilteredResults()
    {
        // --- ARRANGE ---
        string nameSearch = "Manila Luxury";
        string addressSearch = "Makati";
        string? mockContinuationToken = null;
        string mockNextToken = "token_abc_123";

        var filteredItems = new List<PropertyCardDto>
    {
        TestPropertyData.CreateTestPropertyCard(name: "Manila Luxury Condo", address: "Makati City")
    };

        // 🎯 Step 1: Initialize the request object
        var request = new PropertySearchRequest
        {
            PageSize = 10,
            NameTerm = nameSearch,
            AddressTerm = addressSearch,
            ContinuationToken = mockContinuationToken
        };

        // Match the service setup using the request properties
        _serviceMock.Setup(s => s.GetPropertiesPagedAsync(
                request.PageSize,
                null,
                request.NameTerm,
                request.AddressTerm,
                null,
                null,
                request.ContinuationToken))
            .ReturnsAsync((filteredItems, mockNextToken, 1));

        // --- ACT ---
        // 🎯 FIX: Pass the request object instead of multiple named arguments
        var result = await _controller.GetPaged(request);

        // --- ASSERT ---
        var okResult = Assert.IsType<OkObjectResult>(result);
        var response = Assert.IsType<PagedResponse<PropertyCardDto>>(okResult.Value);

        Assert.Equal(mockNextToken, response.NextToken);
        Assert.Single(response.Items);
        Assert.Equal("Manila Luxury Condo", response.Items.First().Name);

        // 🎯 Verify using the specific values
        _serviceMock.Verify(s => s.GetPropertiesPagedAsync(
            10, null, nameSearch, addressSearch, null, null, mockContinuationToken),
            Times.Once);
    }
}