using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace house_proj.Server.Data.Model
{
    public class Login
    {
        [Required]
        [EmailAddress]
        [JsonPropertyName("email")]
        [JsonProperty("Email")]
        public required string Email { get; set; }

        [Required]
        [JsonPropertyName("password")]
        [JsonProperty("Password")]
        public required string Password { get; set; }
    }

    public class AuthResponse
    {
        public string Token { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string[] Roles { get; set; } = Array.Empty<string>();
        public DateTime ExpiresAt { get; set; }
    }
}
