using house_proj.Server.Data.Model;
using house_proj.Server.Data.Repositories;
using house_proj.Server.Data.Services;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnitTest.TestDataFactory;

namespace UnitTest.Services
{
    public class ContentServiceTest
    {
        private readonly Mock<IContentRepository> _repoMock;
        private readonly ContentService _service;

        public ContentServiceTest()
        {
            _repoMock = new Mock<IContentRepository>();
            _service = new ContentService(_repoMock.Object);
        }

        // --- CRUD VALIDATION TESTS ---

        [Fact]
        public async Task CreateContentAsync_ShouldAssignNewGuid_AndGenerateSlug()
        {
            // Arrange
            var inputPost = TestContentData.CreateTestContent(title: "Modern House 2026");
            inputPost.Guid = Guid.Empty; // Simulate fresh input
            inputPost.Slug = "";

            _repoMock.Setup(r => r.CreateContentAsync(It.IsAny<ContentPost>()))
                     .ReturnsAsync((ContentPost p) => p);

            // Act
            var result = await _service.CreateContentAsync(inputPost);

            // Assert
            Assert.NotEqual(Guid.Empty, result.Guid);
            Assert.Equal("modern-house-2026", result.Slug);
            _repoMock.Verify(r => r.CreateContentAsync(It.IsAny<ContentPost>()), Times.Once);
        }

        // --- FAILSAFE / ERROR HANDLING TESTS ---

        [Fact]
        public async Task UpdateContentAsync_ShouldThrowKeyNotFound_WhenItemDoesNotExist()
        {
            // Arrange
            var nonExistentPost = TestContentData.CreateTestContent();

            // Mock returns null to simulate "Not Found" in DB
            _repoMock.Setup(r => r.GetByGuidContentAsync(nonExistentPost.Guid))
                     .ReturnsAsync((ContentPost)null!);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() =>
                _service.UpdateContentAsync(nonExistentPost));

            // Verify that Update was NEVER called because the check failed
            _repoMock.Verify(r => r.UpdateContentAsync(It.IsAny<ContentPost>()), Times.Never);
        }

        [Fact]
        public async Task GetByGuid_ShouldReturnNull_WhenGuidIsEmpty()
        {
            // Act
            var result = await _service.GetContentByGuidAsync(Guid.Empty);

            // Assert
            Assert.Null(result);
            _repoMock.Verify(r => r.GetByGuidContentAsync(It.IsAny<Guid>()), Times.Never);
        }

        [Fact]
        public async Task CreateContentAsync_ShouldAssignGuidAndGenerateSlug()
        {
            // Arrange
            var inputPost = TestContentData.CreateTestContent(id: Guid.Empty, title: "New Modern Villa");
            inputPost.Slug = string.Empty;

            _repoMock.Setup(repo => repo.CreateContentAsync(It.IsAny<ContentPost>()))
                     .ReturnsAsync((ContentPost p) => p);

            // Act
            var result = await _service.CreateContentAsync(inputPost);

            // Assert
            Assert.NotNull(result);
            Assert.NotEqual(Guid.Empty, result.Guid);
            Assert.Equal("new-modern-villa", result.Slug);
            _repoMock.Verify(r => r.CreateContentAsync(It.IsAny<ContentPost>()), Times.Once);
        }

        [Fact]
        public async Task UpdateContentAsync_ShouldReturnUpdatedContent_WhenExists()
        {
            // Arrange
            var existingPost = TestContentData.CreateTestContent();
            _repoMock.Setup(repo => repo.GetByGuidContentAsync(existingPost.Guid))
                     .ReturnsAsync(existingPost);
            _repoMock.Setup(repo => repo.UpdateContentAsync(It.IsAny<ContentPost>()))
                     .ReturnsAsync((ContentPost p) => p);

            // Act
            existingPost.Title = "Updated Title";
            var result = await _service.UpdateContentAsync(existingPost);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("updated-title", result.Slug); // Verify slug updated with title
            _repoMock.Verify(r => r.UpdateContentAsync(It.IsAny<ContentPost>()), Times.Once);
        }

        [Fact]
        public async Task UpdateContentAsync_ShouldThrowException_WhenDoesNotExist()
        {
            // Arrange
            var ghostPost = TestContentData.CreateTestContent();
            _repoMock.Setup(repo => repo.GetByGuidContentAsync(ghostPost.Guid))
                     .ReturnsAsync((ContentPost?)null);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => _service.UpdateContentAsync(ghostPost));
            _repoMock.Verify(repo => repo.UpdateContentAsync(It.IsAny<ContentPost>()), Times.Never);
        }

        [Fact]
        public async Task CreateContentAsync_ShouldAppendSuffix_WhenSlugAlreadyExists()
        {
            // Arrange
            var title = "Collision Post";
            var existingSlug = "collision-post";
            var inputPost = TestContentData.CreateTestContent(title: title);
            inputPost.Slug = existingSlug;

            // Simulate finding a post with the same slug already in the DB
            var existingPostInDb = TestContentData.CreateTestContent(title: "Old Post");
            existingPostInDb.Slug = existingSlug;

            _repoMock.Setup(r => r.GetBySlugContentAsync(existingSlug, inputPost.Type))
                     .ReturnsAsync(existingPostInDb);

            _repoMock.Setup(r => r.CreateContentAsync(It.IsAny<ContentPost>()))
                     .ReturnsAsync((ContentPost p) => p);

            // Act
            var result = await _service.CreateContentAsync(inputPost);

            // Assert
            // It should start with the original slug but have a suffix (e.g., collision-post-a1b2c)
            Assert.StartsWith("collision-post-", result.Slug);
            Assert.True(result.Slug.Length > existingSlug.Length);
            _repoMock.Verify(r => r.GetBySlugContentAsync(existingSlug, inputPost.Type), Times.Once);
        }

        [Theory]
        [InlineData("Hello World!", "hello-world")]
        [InlineData("House @ 2026 #Modern", "house-2026-modern")]
        [InlineData("This is a very long title that should be truncated by the service logic", "this-is-a-very-long-title-that-should-be-trun")]
        public async Task CreateContentAsync_ShouldGenerateCleanSlug_FromMessyTitles(string messyTitle, string expectedSlug)
        {
            // Arrange
            var inputPost = TestContentData.CreateTestContent(title: messyTitle);
            _repoMock.Setup(r => r.GetBySlugContentAsync(It.IsAny<string>(), It.IsAny<string>()))
                     .ReturnsAsync((ContentPost?)null); // No collision
            _repoMock.Setup(r => r.CreateContentAsync(It.IsAny<ContentPost>()))
                     .ReturnsAsync((ContentPost p) => p);

            // Act
            var result = await _service.CreateContentAsync(inputPost);

            // Assert
            Assert.Equal(expectedSlug, result.Slug);
        }

    }
}

