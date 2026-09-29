using house_proj.Server.Controllers;
using house_proj.Server.Data.Model;
using house_proj.Server.Data.Repositories;
using house_proj.Server.Middleware.CAPTCHA;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using UnitTest.DataFactory;

namespace UnitTest
{
    public class EmailControllerTests
    {
        private readonly Mock<IEmailService> _mockEmailService;
        private readonly Mock<ICaptchaService> _mockCaptcha;
        private readonly Mock<ILogger<EmailController>> _mockLogger; 
        private readonly EmailController _controller;

        public EmailControllerTests()
        {
            _mockEmailService = new Mock<IEmailService>();
            _mockCaptcha = new Mock<ICaptchaService>();
            _mockLogger = new Mock<ILogger<EmailController>>(); 

            _controller = new EmailController(
                _mockEmailService.Object,
                _mockCaptcha.Object,
                _mockLogger.Object);
        }

        [Fact]
        public async Task SendEmail_ReturnsOk_OnSuccess()
        {
            // 1. Arrange
            var request = TestEmailData.CreateEmailRequest();
            request.CaptchaToken = "dummy-valid-token"; // Ensure token isn't null

            // Setup CAPTCHA to pass
            _mockCaptcha.Setup(c => c.VerifyTokenAsync(It.IsAny<string>()))
                        .ReturnsAsync(true);

            // Setup EMAIL to succeed
            _mockEmailService.Setup(s => s.SendEmailAsync(It.IsAny<EmailRequest>()))
                             .Returns(Task.CompletedTask);

            // 2. Act
            var result = await _controller.SendEmail(request);

            // 3. Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task SendEmail_ReturnsStatusCode500_OnServiceFailure()
        {
            // --- ARRANGE ---
            var agentEmail = "agent-david@test.com";
            var request = new EmailRequest
            {
                CaptchaToken = "valid-token",
                PropertyName = "Luxury Condo",
                EmployeeEmail = agentEmail,
                Message = "Hello!",
                Name = "Client",
                Email = "client@test.com"
            };

            _mockCaptcha.Setup(c => c.VerifyTokenAsync("valid-token"))
                        .ReturnsAsync(true);

            // Make Email Service fail
            _mockEmailService.Setup(s => s.SendEmailAsync(It.IsAny<EmailRequest>()))
                             .ThrowsAsync(new Exception("SMTP Error"));

            // --- ACT ---
            var result = await _controller.SendEmail(request);

            // --- ASSERT ---
            var objectResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal("An error occurred.", objectResult.Value);

        }

        [Fact]
        public async Task SendEmail_ReturnsBadRequest_WhenCaptchaFails()
        {
            // Arrange
            var request = new EmailRequest
            {
                CaptchaToken = "invalid-token",
                PropertyName = "Villa",
                Message = "Hello",
                Name = "Test User",
                Email = "test@user.com",
                EmployeeEmail = "agent@test.com"
            };

            _mockCaptcha.Setup(c => c.VerifyTokenAsync("invalid-token"))
                        .ReturnsAsync(false); // Simulate a Bot/Fail

            // Act
            var result = await _controller.SendEmail(request);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);

            // 🎯 Match the actual string from your Controller:
            Assert.Equal("Captcha verification failed.", badRequestResult.Value);

            // Verify email was NEVER even attempted
            _mockEmailService.Verify(s => s.SendEmailAsync(It.IsAny<EmailRequest>()), Times.Never);
        }

        [Fact]
        public async Task SendEmail_SendsToAgent_WhenAgentEmailIsProvided()
        {
            // Arrange
            var agentEmail = "agent-david@test.com";
            var request = new EmailRequest
            {
                CaptchaToken = "valid-token",
                PropertyName = "Luxury Condo",
                EmployeeEmail = agentEmail, 
                Message = "Hello!",
                Name = "Client",
                Email = "client@test.com"
            };

            _mockCaptcha.Setup(c => c.VerifyTokenAsync(It.IsAny<string>())).ReturnsAsync(true);

            // Act
            await _controller.SendEmail(request);

            // Assert
            _mockEmailService.Verify(s => s.SendEmailAsync(It.Is<EmailRequest>(r =>
                r.EmployeeEmail == agentEmail)), Times.Once);
        }

        [Fact]
        public async Task PreQualify_ReturnsOk_OnSuccess()
        {
            // 1. Arrange
            var request = new PreQualifyRequest
            {
                CaptchaToken = "valid-token",
                FirstName = "test",
                LastName = "tester",
                Email = "test@example.com",
                PropertyType = "House",
                PropertyValue = 5000000,
                MonthlyIncome = 150000
            };

            _mockCaptcha.Setup(c => c.VerifyTokenAsync("valid-token"))
                        .ReturnsAsync(true);

            _mockEmailService.Setup(s => s.SendPreQualifyEmailAsync(It.IsAny<PreQualifyRequest>()))
                             .Returns(Task.CompletedTask);

            var result = await _controller.PreQualify(request);

            // 3. Assert
            var okResult = Assert.IsType<OkObjectResult>(result);


            var messageValue = okResult.Value.GetType().GetProperty("message")?.GetValue(okResult.Value, null);

            Assert.Equal("Pre-qualification request submitted successfully.", messageValue);
            _mockEmailService.Verify(s => s.SendPreQualifyEmailAsync(It.IsAny<PreQualifyRequest>()), Times.Once);
        }

        [Fact]
        public async Task PreQualify_ReturnsBadRequest_WhenCaptchaFails()
        {
            // Arrange
            var request = new PreQualifyRequest { CaptchaToken = "bad-token" };

            _mockCaptcha.Setup(c => c.VerifyTokenAsync("bad-token"))
                        .ReturnsAsync(false);

            // Act
            var result = await _controller.PreQualify(request);

            // Assert
            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Captcha verification failed.", badRequest.Value);

            // Critical: Ensure the email service was NEVER called
            _mockEmailService.Verify(s => s.SendPreQualifyEmailAsync(It.IsAny<PreQualifyRequest>()), Times.Never);
        }

        [Fact]
        public async Task PreQualify_Returns500_OnServiceException()
        {
            // Arrange
            var request = new PreQualifyRequest { CaptchaToken = "valid-token" };

            _mockCaptcha.Setup(c => c.VerifyTokenAsync(It.IsAny<string>()))
                        .ReturnsAsync(true);

            _mockEmailService.Setup(s => s.SendPreQualifyEmailAsync(It.IsAny<PreQualifyRequest>()))
                             .ThrowsAsync(new Exception("Database or SMTP Down"));

            // Act
            var result = await _controller.PreQualify(request);

            // Assert
            var objectResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(500, objectResult.StatusCode);
            Assert.Equal("An error occurred processing your request.", objectResult.Value);
        }

    }
}