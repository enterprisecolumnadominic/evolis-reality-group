using house_proj.Server.Data.Model;
using house_proj.Server.Data.Services;
using Microsoft.Extensions.Configuration;
using Moq;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace UnitTest.Services
{
    public class AuthServiceTests
    {
        private readonly Mock<IConfiguration> _mockConfig;
        private readonly AuthService _authService;

        // Define test constants
        private const string TestEmail = "admin@test.com";
        private const string TestPassword = "SecurePass123";
        private const string TestSecret = "super_secret_key_at_least_32_characters_long";

        public AuthServiceTests()
        {
            _mockConfig = new Mock<IConfiguration>();

            // 🎯 STEP 1: Create a REAL BCrypt hash of our test password
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(TestPassword);

            // 🎯 STEP 2: Setup mock configuration with the Hash and JWT Secret
            _mockConfig.Setup(c => c["AdminAccount:Email"]).Returns(TestEmail);
            _mockConfig.Setup(c => c["AdminAccount:PasswordHash"]).Returns(passwordHash);
            _mockConfig.Setup(c => c["JwtSettings:SecretKey"]).Returns(TestSecret);

            _authService = new AuthService(_mockConfig.Object);
        }

        [Fact]
        public async Task AuthenticateAsync_ValidCredentials_ReturnsTrue()
        {
            // Arrange
            var login = new Login { Email = TestEmail, Password = TestPassword };

            // Act
            var result = await _authService.AuthenticateAsync(login);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task AuthenticateAsync_InvalidPassword_ReturnsFalse()
        {
            // Arrange
            var login = new Login { Email = TestEmail, Password = "WrongPassword" };

            // Act
            var result = await _authService.AuthenticateAsync(login);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task AuthenticateAsync_InvalidEmail_ReturnsFalse()
        {
            // Arrange
            var login = new Login { Email = "imposter@test.com", Password = TestPassword };

            // Act
            var result = await _authService.AuthenticateAsync(login);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public void GenerateJwtToken_ReturnsValidTokenWithClaims()
        {
            // Arrange
            string adminId = "admin@test.com";

            // Act
            var token = _authService.GenerateJwtToken(adminId);

            // Assert
            Assert.NotNull(token);
            Assert.NotEmpty(token);

            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);

            // 🎯 FIX 1: Use ClaimTypes.NameIdentifier to match your AuthService
            var subClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            Assert.Equal(adminId, subClaim);

            // 🎯 FIX 2: Verify the Role claim (using the standard ClaimTypes.Role)
            var roleClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
            Assert.Equal("Admin", roleClaim);

            // Verify Issuer and Audience
            Assert.Equal("house-proj-api", jwtToken.Issuer);
            Assert.Contains("house-proj-admin", jwtToken.Audiences);
        }
    }
}
