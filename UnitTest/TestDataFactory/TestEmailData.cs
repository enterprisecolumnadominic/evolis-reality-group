using house_proj.Server.Data;
using house_proj.Server.Data.Model;
using Microsoft.Extensions.Options;
using Moq;


namespace UnitTest.DataFactory
{
    public class TestEmailData
    {
        // Creates the base MailSettings object
        public static MailSettings CreateMailSettings()
        {
            return new MailSettings
            {
                EmailFrom = "house-proj-alerts@test.com",
                EmailTo = "admin-inbox@test.com",
                Password = "mock-app-password",
                Host = "smtp.gmail.com",
                Port = 587,
  
            };
        }

        // Creates the Mock IOptions wrapper that .NET Services require
        public static IOptions<MailSettings> CreateMailSettingsOptions()
        {
            var mock = new Mock<IOptions<MailSettings>>();
            mock.Setup(s => s.Value).Returns(CreateMailSettings());
            return mock.Object;
        }

        // Creates a standard email request for testing
        public static EmailRequest CreateEmailRequest(string subject = "Test Subject")
        {
            return new EmailRequest
            {
                PropertyName = subject,
                Message = "<h1>Test Email</h1><p>This is a generated test body.</p>"
            };
        }

        public static CosmosSettings CreateCosmosSettings()
        {
            return new CosmosSettings
            {
                ConnectionString = "AccountEndpoint=https://localhost:8081/;AccountKey=C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==",
                DatabaseName = "HouseDb",
                PropertiesContainer = "Properties",
                EmployeesContainer = "Employees",
                PartitionKeyPath = "/id"
            };
        }
    }
}
