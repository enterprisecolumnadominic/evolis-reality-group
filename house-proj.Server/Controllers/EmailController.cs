using Asp.Versioning;
using house_proj.Server.Data.Model;        
using house_proj.Server.Data.Repositories;
using house_proj.Server.Middleware.CAPTCHA;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace house_proj.Server.Controllers
{
    [Authorize]
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/[controller]")]
    public class EmailController : ControllerBase
    {
        private readonly IEmailService _emailService;
        private readonly ICaptchaService _captchaService;
        private readonly ILogger<EmailController> _logger;

        public EmailController(IEmailService emailService, ICaptchaService captchaService, ILogger<EmailController> logger)
        {
            _emailService = emailService;
            _captchaService = captchaService;
            _logger = logger;
        }

        [AllowAnonymous]
        [HttpPost("send")]
        public async Task<IActionResult> SendEmail([FromBody] EmailRequest request)
        {
            // 1. CAPTCHA Verification
            var isHuman = await _captchaService.VerifyTokenAsync(request.CaptchaToken);
            if (!isHuman)
            {
                _logger.LogWarning("Captcha failed for: {Email}", request.Email);
                return BadRequest("Captcha verification failed.");
            }

            try
            {
                await _emailService.SendEmailAsync(request);

                _logger.LogInformation("Inquiry sent for {PropertyName} to {Agent}",
                    request.PropertyName, request.EmployeeEmail);

                return Ok(new { message = "Inquiry sent successfully." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Service Error for {Email}", request.Email);
                return StatusCode(500, "An error occurred.");
            }
        }

        [AllowAnonymous]
        [HttpPost("pre-qualify")]
        public async Task<IActionResult> PreQualify([FromBody] PreQualifyRequest request)
        {
            // 1. CAPTCHA Verification
            var isHuman = await _captchaService.VerifyTokenAsync(request.CaptchaToken);
            if (!isHuman)
            {
                _logger.LogWarning("Captcha failed for Pre-Qualify: {Email}", request.Email);
                return BadRequest("Captcha verification failed.");
            }

            try
            {
 
                await _emailService.SendPreQualifyEmailAsync(request);

                _logger.LogInformation("Pre-Qual request sent for {FirstName} {LastName}",
                    request.FirstName, request.LastName);

                return Ok(new { message = "Pre-qualification request submitted successfully." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Pre-Qual Service Error for {Email}", request.Email);
                return StatusCode(500, "An error occurred processing your request.");
            }
        }
    }
}