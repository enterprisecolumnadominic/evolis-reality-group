namespace house_proj.Server.Middleware.CAPTCHA
{
    public interface ICaptchaService
    {
        Task<bool> VerifyTokenAsync(string token);
    }
}
