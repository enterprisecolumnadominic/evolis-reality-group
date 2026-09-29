using house_proj.Server.Controllers;
using house_proj.Server.Data.Model;
using house_proj.Server.Data.Repositories;
using house_proj.Server.Data.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTest.Controller
{
    public class AuthControllerTests
    {
        private readonly Mock<IAuthService> _mockAuthService;
        private readonly Mock<ILogger<AuthController>> _loggerMock;
        private readonly AuthController _controller;

        private const string TestEmail = "admin@test.com";
        private const string TestPass = "SecurePass123";

        public AuthControllerTests()
        {
            _mockAuthService = new Mock<IAuthService>();
            _loggerMock = new Mock<ILogger<AuthController>>(); 
            _controller = new AuthController(_mockAuthService.Object, _loggerMock.Object);
        }

        [Fact]
        public async Task Login_Success_ReturnsOk()
        {
            // Arrange
            var request = new Login { Email = TestEmail, Password = TestPass };
            // We tell the service to return 'true' for this specific call
            _mockAuthService.Setup(s => s.AuthenticateAsync(It.IsAny<Login>()))
                            .ReturnsAsync(true);

            // Act
            var result = await _controller.Login(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200, okResult.StatusCode);
        }

        [Fact]
        public async Task Login_WrongCredentials_ReturnsUnauthorized()
        {
            // Arrange
            var request = new Login { Email = TestEmail, Password = "wrong" };
            _mockAuthService.Setup(s => s.AuthenticateAsync(It.IsAny<Login>()))
                            .ReturnsAsync(false);

            // Act
            var result = await _controller.Login(request);

            // Assert 
            // 🎯 Use IsAssignableFrom to allow UnauthorizedObjectResult to pass as an ObjectResult
            var objectResult = Assert.IsAssignableFrom<ObjectResult>(result);
            Assert.Equal(401, objectResult.StatusCode);
        }

        [Fact]
        public async Task Login_WrongEmail_ReturnsUnauthorized()
        {
            // Arrange
            var request = new Login { Email = "wrong@test.com", Password = TestPass };
            _mockAuthService.Setup(s => s.AuthenticateAsync(It.IsAny<Login>()))
                            .ReturnsAsync(false);
            var context = new DefaultHttpContext();
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = context
            };

            // Act
            var result = await _controller.Login(request);

            // Assert
            var objectResult = Assert.IsAssignableFrom<ObjectResult>(result);
            Assert.Equal(401, objectResult.StatusCode);
        }
    }
}

