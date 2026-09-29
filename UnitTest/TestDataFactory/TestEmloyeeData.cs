using house_proj.Server.Data.Model;


namespace UnitTest.DataFactory
{
    public static class TestEmloyeeData
    {
        public static EmployeeProfile CreateTestEmployee(Guid? id = null, string name = "John Doe")
        {
            return new EmployeeProfile
            {
                Guid = id ?? Guid.NewGuid(),
                Name = name,
                Title = "Senior Broker",
                Email = "john@example.com",
                Phone = "555-0123",
                ProfilePhoto = "headshot.jpg",
                Description = "Experienced agent.",
                Specialties = new[] { "Luxury", "Residential" },
                Languages = new[] { "English" },
                IsActive = true,
                Socials = new SocialLinks
                {
                    Facebook = "fb.com/john",
                    Linkedin = "li.com/john"
                }
            };
        }
    }
}
