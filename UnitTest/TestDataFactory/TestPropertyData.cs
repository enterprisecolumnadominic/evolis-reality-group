using house_proj.Server.Data.Model;

namespace UnitTest.DataFactory
{
    public static class TestPropertyData
    {
        public static AvailableProperty CreateTestProperty(Guid? id = null, string name = "Default Property", bool enabled = true)
        {
            return new AvailableProperty
            {
                Guid = id ?? Guid.NewGuid(),
                Name = name,
                Price = (double)1000000m,
                Description = "Test Description",
                Address = "Test Address",
                BuiltYear = 2024,
                FloorSpace = 2000,
                Bedrooms = 3,
                Bathrooms = 2,
                Levels = 2,
                Latitude = 1.0,
                Longitude = 1.0,
                PropertyType = PropertyType.Buy,
                SubPropertyType = SubPropertyType.HouseAndLot,
                IsEnabled = enabled,
                // Using your new structured MediaItems
                MediaItems = new MediaItem[]
                {
                    new MediaItem { Url = "img1.jpg" },
                    new MediaItem { Url = "img2.jpg" },
                    new MediaItem { Url = "img3.jpg" },
                    new MediaItem { Url = "img4.jpg" },
                    new MediaItem { VideoDetails = new VideoLink { VideoUrl = "vid.mp4" } }
                }
            };
        }
        public static PropertyCardDto CreateTestPropertyCard(
        string name = "Test Property",
        string address = "Test Address",
        decimal price = 1000000)
        {
            return new PropertyCardDto
            {
                Guid = Guid.NewGuid(),
                Name = name,
                Address = address, // 🎯 Assign it here
                Price = price,
                Bedrooms = 2,
                Bathrooms = 2,
                FloorSpace = 100,
                Levels = 1,
                PropertyType = PropertyType.Buy,
                SubPropertyType = SubPropertyType.HouseAndLot,
                DateCreated = DateOnly.FromDateTime(DateTime.UtcNow),
                ThumbnailUrl = "https://example.com/image.jpg"
            };
        }

        public static PropertyAdminListDto CreateTestPropertyAdminDto(
           Guid? id = null,
           string name = "Default Admin DTO",
           bool enabled = true)
        {
            return new PropertyAdminListDto
            {
                Guid = id ?? Guid.NewGuid(),
                Name = name,
                Price = 1000000m,
                Address = "Test Address",
                ThumbnailUrl = "https://example.com/image.jpg",
                PropertyType = PropertyType.Buy,
                SubPropertyType = SubPropertyType.HouseAndLot,
                DateCreated = DateOnly.FromDateTime(DateTime.UtcNow),
                IsEnabled = enabled
            };
        }
    }
}
