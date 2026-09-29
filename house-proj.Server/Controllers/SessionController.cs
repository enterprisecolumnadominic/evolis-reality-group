using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace house_proj.Server.Controllers
{
    [Authorize]
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/[controller]")]
    public class SessionController : ControllerBase
    {
        private readonly ILogger<SessionController> _logger;
        public SessionController(ILogger<SessionController> logger)
        {
            _logger = logger;
        }

        [AllowAnonymous]
        [HttpGet("init")]
        public IActionResult Init()
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true, // Required for SameSite=None
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddHours(1)
            };

            try
            {
                // 1. Visitor Time Check
                Response.Cookies.Append("X-Visitor-Time", DateTime.UtcNow.Ticks.ToString(), cookieOptions);

                // 2. Request Counter
                Response.Cookies.Append("X-Request-Count", "0", cookieOptions);

                _logger.LogInformation("Session handshake initialized for a new visitor.");

                return Ok(new { message = "Handshake Received" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to initialize session cookies.");
                return StatusCode(500, "Session initialization failed.");
            }
        }
    }
}
