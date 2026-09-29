using house_proj.Server.Data.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTest.TestDataFactory
{
    public static class TestContentData
    {
        public static ContentPost CreateTestContent(
            Guid? id = null,
            string title = "Test Content Title",
            string type = "Blog",
            bool isActive = true)
        {
            return new ContentPost
            {
                Guid = id ?? Guid.NewGuid(),
                Title = title,
                Content = "This is a sample content body for testing purposes.",
                Type = type,
                IsActive = isActive,
                Slug = string.Empty,
                TagLine = "This is a tag line header for testing purposes",
                PublishedDate = DateTime.UtcNow
            };
        }

        /// <summary>
        /// Generates a list of mixed content for testing GetAll filters
        /// </summary>
        public static List<ContentPost> CreateTestContentList()
        {
            return new List<ContentPost>
            {
                CreateTestContent(Guid.NewGuid(), "Blog One", "Blog", true),
                CreateTestContent(Guid.NewGuid(), "Blog Two", "Blog", false),
                CreateTestContent(Guid.NewGuid(), "Event One", "Event", true),
                CreateTestContent(Guid.NewGuid(), "Event Two", "Event", true)
            };
        }
    }
}
