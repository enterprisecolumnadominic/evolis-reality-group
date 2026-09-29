using Asp.Versioning;
using house_proj.Server.Data.Model;
using house_proj.Server.Data.Repositories;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace house_proj.Server.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> logger;

        public AuthController(IAuthService authService,ILogger<AuthController> logger )
        {
            _authService = authService;
            this.logger = logger;
        }


        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Login loginRequest)
        {
            try
            {
                if (loginRequest == null)
                {
                    return BadRequest(new { error = "Login request is required" });
                }

                if (string.IsNullOrWhiteSpace(loginRequest.Email))
                {
                    return BadRequest(new { error = "Email is required" });
                }

                if (string.IsNullOrWhiteSpace(loginRequest.Password))
                {
                    return BadRequest(new { error = "Password is required" });
                }

                // SECURITY FIX #2: Normalize email (prevent case-sensitivity issues)
                loginRequest.Email = loginRequest.Email.Trim().ToLowerInvariant();

                var isAuthenticated = await _authService.AuthenticateAsync(loginRequest);

                if (isAuthenticated)
                {
                    // SECURITY FIX #3: Generate token with proper expiration
                    var token = _authService.GenerateJwtToken(loginRequest.Email);

                    var currentTime = DateTime.UtcNow;
                    var expiresAt = currentTime.AddHours(2);  // TODO: Consider reducing to 30 minutes

                    logger.LogInformation("Successful login for user: {Email} at {Timestamp}",
                        loginRequest.Email, currentTime);

                    return Ok(new AuthResponse
                    {
                        Token = token,
                        Email = loginRequest.Email,
                        Roles = new[] { "Admin" },
                        ExpiresAt = expiresAt
                    });
                }

                var clientIp = HttpContext?.Connection?.RemoteIpAddress?.ToString() ?? "Unknown";
                logger.LogWarning("Failed login attempt for email: {Email} from IP: {IP} at {Timestamp}",
                   loginRequest.Email, clientIp, DateTime.UtcNow);

                return Unauthorized(new { error = "Invalid email or password" });
            }
            catch (ArgumentException ex)
            {
                logger.LogWarning(ex, "Validation error during login for email: {Email}", loginRequest?.Email);
                return BadRequest(new { error = "Invalid login credentials" });
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred during login for email: {Email}", loginRequest?.Email);
                return StatusCode(500, new { error = "An error occurred during authentication" });
            }
        }

        [Authorize]
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            try
            {
                var userEmail = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "Unknown";

                logger.LogInformation("User logout requested by: {Email} at {Timestamp}",
                    userEmail, DateTime.UtcNow);

                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,             
                    Secure = true,                
                    SameSite = SameSiteMode.Strict,  
                    Expires = DateTime.UtcNow.AddDays(-1) 
                };

                Response.Cookies.Delete("X-Visitor-Time", cookieOptions);
                Response.Cookies.Delete("X-Request-Count", cookieOptions);
                Response.Cookies.Delete("X-Email-Count", cookieOptions);

                logger.LogInformation("Security cookies cleared for user: {Email}", userEmail);

              
                return Ok(new { message = "Logged out successfully" });
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error during logout");
                // SECURITY FIX #13: Don't expose error details
                return StatusCode(500, new { error = "An error occurred during logout" });
            }
        }

        [Authorize] 
        [HttpPost("refresh")]
        public IActionResult RefreshToken()
        {
            try
            {
                
                var userEmail = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userEmail))
                {
                    return Unauthorized(new { error = "User email not found in token" });
                }

                var newToken = _authService.GenerateJwtToken(userEmail);
                var expiresAt = DateTime.UtcNow.AddHours(2);  

                logger.LogInformation("Token refreshed for user: {Email}", userEmail);

                return Ok(new AuthResponse
                {
                    Token = newToken,
                    Email = userEmail,
                    Roles = new[] { "Admin" },
                    ExpiresAt = expiresAt
                });
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error during token refresh");
                return StatusCode(500, new { error = "An error occurred while refreshing the token" });
            }
        }

        [Authorize]
        [HttpGet("validate")]
        public IActionResult ValidateToken()
        {
            try
            {
                var userEmail = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var roles = User.FindAll(ClaimTypes.Role);

                return Ok(new
                {
                    isValid = true,
                    email = userEmail,
                    roles = roles.Select(r => r.Value).ToList()
                });
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error validating token");
                return StatusCode(500, new { error = "An error occurred while validating the token" });
            }
        }
    }
}
