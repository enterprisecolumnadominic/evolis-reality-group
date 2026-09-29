using house_proj.Server.Data;
using Microsoft.Extensions.Options;

namespace house_proj.Server.Middleware.CAPTCHA
{
    public class GoogleCaptchaService : ICaptchaService
    {
        private readonly HttpClient _httpClient;
        private readonly RecaptchaSettings _settings;

        public GoogleCaptchaService(HttpClient httpClient, IOptions<RecaptchaSettings> options)
        {
            _httpClient = httpClient;
            _settings = options.Value;
        }

        public async Task<bool> VerifyTokenAsync(string token)
        {
            if (string.IsNullOrEmpty(token)) return false;

            // Use the SecretKey from our settings object
            var secret = _settings.SecretKey;
            var url = $"https://www.google.com/recaptcha/api/siteverify?secret={secret}&response={token}";

            var response = await _httpClient.PostAsync(url, null);

            if (!response.IsSuccessStatusCode) return false;

            var result = await response.Content.ReadFromJsonAsync<CaptchaResponse>();
            return result?.Success ?? false;
        }
    }
}
