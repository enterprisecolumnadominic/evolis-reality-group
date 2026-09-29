using house_proj.Server.Controllers;
using house_proj.Server.Data.Model;
using house_proj.Server.Data.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos.Core;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnitTest.TestDataFactory;

namespace UnitTest.Controller
{
    public class ContentControllerTests
    {
        private readonly Mock<IContentService> _serviceMock;
        private readonly ContentController _controller;
        private readonly Mock<ILogger<ContentController>> _loggerMock;

        public ContentControllerTests()
        {
            _serviceMock = new Mock<IContentService>();
            _loggerMock = new Mock<ILogger<ContentController>>();
            _controller = new ContentController(_serviceMock.Object, _loggerMock.Object);
        }

        [Fact]
        public async Task Create_ReturnsCreatedResponse_WithValidData()
        {
            // Arrange
            var newPost = TestContentData.CreateTestContent();
            // Ensure the mock returns the post with the Slug and Type populated
            _serviceMock.Setup(s => s.CreateContentAsync(It.IsAny<ContentPost>()))
                        .ReturnsAsync(newPost);

            // Act
            var result = await _controller.Create(newPost);

            // Assert
            var createdAtResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            Assert.Equal(nameof(ContentController.GetBySlug), createdAtResult.ActionName);
            Assert.Equal(201, createdAtResult.StatusCode);

            // 🎯 Verify Route Values
            var routeValues = createdAtResult.RouteValues;
            Assert.Equal(newPost.Type, routeValues?["type"]);
            Assert.Equal(newPost.Slug, routeValues?["slug"]);
        }

        [Fact]
        public async Task GetByGuid_ReturnsNotFound_WhenGuidDoesNotExist()
        {
            // Arrange
            var testId = Guid.NewGuid();
            _serviceMock.Setup(s => s.GetContentByGuidAsync(testId))
                        .ReturnsAsync((ContentPost?)null);

            // Act
            var result = await _controller.GetById(testId);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result.Result);

            Assert.Equal($"Content with ID {testId} not found.", notFoundResult.Value);
        }

        [Fact]
        public async Task Update_ReturnsNoContent_WhenSuccessful()
        {
            // Arrange
            var post = TestContentData.CreateTestContent();
            _serviceMock.Setup(s => s.UpdateContentAsync(It.IsAny<ContentPost>()))
                        .ReturnsAsync(post);

            // Act
            var result = await _controller.Update(post.Guid, post);

            // Assert
            // Change OkObjectResult to NoContentResult
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task Update_ReturnsNotFound_WhenServiceThrowsException()
        {
            // Arrange
            var post = TestContentData.CreateTestContent();
            _serviceMock.Setup(s => s.UpdateContentAsync(It.IsAny<ContentPost>()))
                        .ThrowsAsync(new KeyNotFoundException());

            // Act
            var result = await _controller.Update(post.Guid, post);

            // Assert
            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public async Task GetBySlug_ReturnsOk_WhenSlugExists()
        {
            // Arrange
            var type = "Blog";
            var slug = "modern-house-2026";
            var existingPost = TestContentData.CreateTestContent(type: type, title: "Modern House 2026");
            existingPost.Slug = slug;

            _serviceMock.Setup(s => s.GetContentBySlugAsync(slug, type))
                        .ReturnsAsync(existingPost);

            // Act
            var result = await _controller.GetBySlug(type, slug);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedPost = Assert.IsType<ContentPost>(okResult.Value);
            Assert.Equal(slug, returnedPost.Slug);
        }

        [Fact]
        public async Task GetBySlug_ReturnsNotFound_WhenSlugDoesNotExist()
        {
            // Arrange
            var type = "Blog";
            var slug = "non-existent-slug";

            _serviceMock.Setup(s => s.GetContentBySlugAsync(slug, type))
                        .ReturnsAsync((ContentPost?)null);

            // Act
            var result = await _controller.GetBySlug(type, slug);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result.Result);
            Assert.Contains(slug, notFoundResult.Value?.ToString());
        }

    }
}

