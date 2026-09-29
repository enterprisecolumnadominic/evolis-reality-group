using house_proj.Server.Controllers;
using house_proj.Server.Data.Model;
using house_proj.Server.Data.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTest.Controller
{
    public class SitemapControllerTests
    {
        //[Fact]
        //public async Task GetSitemap_ReturnsValidXmlWithData()
        //{
        //    // 1. Arrange
        //    var mockPropertyService = new Mock<IPropertyService>();
        //    var mockContentService = new Mock<IContentService>();
        //    var mockConfig = new Mock<IConfiguration>();

        //    mockConfig.Setup(c => c["FrontendSettings:BaseUrl"]).Returns("https://test-site.com");

        //    // Define a specific Guid
        //    var testGuid = Guid.Parse("00000000-0000-0000-0000-000000000001");
        //    var properties = new List<PropertyAdminListDto>
        //    {
        //       new PropertyAdminListDto { Guid = testGuid }
        //    };

        //    // Mock Properties
        //    mockPropertyService.Setup(s => s.GetAllPropertiesAsync(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<bool?>()))
        //                       .ReturnsAsync((properties, 1));

        //    // Mock Blogs (This was missing from your snippet!)
        //    var blogs = new List<ContentPostListDto>
        //    {
        //        new ContentPostListDto { Slug = "my-test-blog" }
        //    };
        //    mockContentService.Setup(s => s.GetAllContentAsync(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<bool?>()))
        //                      .ReturnsAsync((blogs, 1));

        //    var controller = new SitemapController(mockPropertyService.Object, mockContentService.Object, mockConfig.Object);

        //    // 2. Act
        //    var result = await controller.GetSitemap();

        //    // 3. Assert
        //    var contentResult = Assert.IsType<ContentResult>(result);

        //    // ✅ Fix: Search for the ACTUAL Guid we used in the Arrange section
        //    Assert.Contains($"<loc>https://test-site.com/properties/{testGuid}</loc>", contentResult.Content);

        //    // ✅ Fix: Ensure the blog slug is there
        //    Assert.Contains("<loc>https://test-site.com/blog/my-test-blog</loc>", contentResult.Content);

        //    Assert.Contains("<?xml", contentResult.Content);
        //}
    }
}
