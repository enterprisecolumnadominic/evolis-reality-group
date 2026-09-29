namespace house_proj.Server.Middleware.CAPTCHA
{
    public class CaptchaResponse
    {
        public bool Success { get; set; }
        public string[]? ErrorCodes { get; set; }
    }
}
