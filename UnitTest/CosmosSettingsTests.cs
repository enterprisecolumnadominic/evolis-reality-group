using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnitTest.DataFactory;

namespace UnitTest
{
    public class CosmosSettingsTests
    {
        [Fact]
        public void CosmosSettings_ShouldFail_WhenConnectionStringIsMissing()
        {
            // Arrange
            var settings = TestEmailData.CreateCosmosSettings();
            settings.ConnectionString = ""; // The "Bad" data

            // Act
            // We are simulating the validation check that [Required] would perform
            var validationContext = new ValidationContext(settings);
            var validationResults = new List<ValidationResult>();
            bool isValid = Validator.TryValidateObject(settings, validationContext, validationResults, true);

            // Assert
            Assert.False(isValid);
            Assert.Contains(validationResults, v => v.MemberNames.Contains("ConnectionString"));
        }
    }
}
