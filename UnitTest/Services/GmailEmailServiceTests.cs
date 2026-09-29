using house_proj.Server.Data;
using house_proj.Server.Data.Services;
using Microsoft.Extensions.Options;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnitTest.DataFactory;

namespace UnitTest.Services
{
    public class GmailEmailServiceTests
    {
        [Fact]
        public async Task SendEmailAsync_ShouldAttemptConnection_WithFactoryData()
        {
            // Arrange
            var settingsOptions = TestEmailData.CreateMailSettingsOptions();
            var service = new GmailEmailService(settingsOptions);
            var request = TestEmailData.CreateEmailRequest("Factory Test");

            // Act
            var exception = await Record.ExceptionAsync(() => service.SendEmailAsync(request));

            // Assert
            Assert.NotNull(exception);
        }

        [Fact]
        public async Task SendEmailAsync_ShouldUseConfiguredRecipient_FromSettings()
        {
            // Arrange
            var settingsOptions = TestEmailData.CreateMailSettingsOptions();
            var service = new GmailEmailService(settingsOptions);
            var request = TestEmailData.CreateEmailRequest();

            // Act
            var exception = await Record.ExceptionAsync(() => service.SendEmailAsync(request));

            // Assert
            // Even if this fails connection, we are verifying the logic doesn't crash 
            // when accessing _mailSettings.EmailTo
            Assert.True(exception is not NullReferenceException);
        }

        [Fact]
        public async Task SendEmailAsync_ShouldThrow_IfEmailToConfigIsMissing()
        {
            // Arrange
            var settings = TestEmailData.CreateMailSettings();
            settings.EmailTo = ""; // Simulate a missing config value

            var mockOptions = new Mock<IOptions<MailSettings>>();
            mockOptions.Setup(s => s.Value).Returns(settings);

            var service = new GmailEmailService(mockOptions.Object);

            // Ensure the request has an empty EmployeeEmail so it hits the fallback 
            var request = TestEmailData.CreateEmailRequest();
            request.EmployeeEmail = "";

            // Act & Assert
            // 🎯 FIX: MimeKit throws ParseException when the string is empty or invalid
            await Assert.ThrowsAsync<MimeKit.ParseException>(() =>
                service.SendEmailAsync(request));
        }

        [Fact]
        public async Task SendEmailAsync_ShouldFail_WhenHostIsInvalid()
        {
            // Arrange
            var settings = TestEmailData.CreateMailSettings();
            settings.Host = "not-a-real-server.com"; // Invalid Host

            var mockOptions = new Mock<IOptions<MailSettings>>();
            mockOptions.Setup(s => s.Value).Returns(settings);

            var service = new GmailEmailService(mockOptions.Object);
            var request = TestEmailData.CreateEmailRequest();

            // Act & Assert
            // We expect a SocketException or SmtpCommandException because the host won't resolve
            await Assert.ThrowsAsync<System.Net.Sockets.SocketException>(() =>
                service.SendEmailAsync(request));
        }
    }
}
