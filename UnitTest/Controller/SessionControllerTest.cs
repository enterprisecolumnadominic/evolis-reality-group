using house_proj.Server.Controllers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;

namespace UnitTest.Controller
{
    public class SessionControllerTest
    {
        private readonly Mock<ILogger<SessionController>> _mockLogger;

        public SessionControllerTest()
        {
            // 🎯 Create the mock logger once for all tests
            _mockLogger = new Mock<ILogger<SessionController>>();
        }

        [Fact]
        public void Init_Sets_Two_Cookies()
        {
            // Arrange
            var controller = new SessionController(_mockLogger.Object);
            var httpContext = new DefaultHttpContext();
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = httpContext
            };

            // Act
            var result = controller.Init();

            // Assert
            var cookies = httpContext.Response.Headers["Set-Cookie"].ToString();
            Assert.Contains("X-Visitor-Time", cookies);
            Assert.Contains("X-Request-Count", cookies);
        }

        [Fact]
        public void Init_Sets_Initial_Count_To_Zero()
        {
            // Arrange
            var controller = new SessionController(_mockLogger.Object);
            var httpContext = new DefaultHttpContext();
            controller.ControllerContext = new ControllerContext { HttpContext = httpContext };

            // Act
            controller.Init();

            // Assert
            // We look for the specific string "X-Request-Count=0" in the Set-Cookie header
            var cookies = httpContext.Response.Headers["Set-Cookie"].ToString();
            Assert.Contains("X-Request-Count=0", cookies);
        }

        [Fact]
        public void Init_Cookies_Have_Security_Attributes()
        {
            // Arrange
            var controller = new SessionController(_mockLogger.Object);
            var httpContext = new DefaultHttpContext();
            controller.ControllerContext = new ControllerContext { HttpContext = httpContext };

            // Act
            controller.Init();

            // Assert
            var cookies = httpContext.Response.Headers["Set-Cookie"].ToString();

            // HttpOnly prevents JavaScript from stealing the cookie
            Assert.Contains("httponly", cookies.ToLower());

            // samesite=none is required because Frontend and Backend are on different ports
            Assert.Contains("samesite=none", cookies.ToLower());

            // secure is required when using SameSite=None
            Assert.Contains("secure", cookies.ToLower());
        }
    }
}
