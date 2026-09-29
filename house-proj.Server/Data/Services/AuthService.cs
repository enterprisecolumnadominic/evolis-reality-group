using house_proj.Server.Data.Model;
using house_proj.Server.Data.Repositories;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;

namespace house_proj.Server.Data.Services
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _config;

        private readonly string _issuer = "house-proj-api";
        private readonly string _audience = "house-proj-admin";

        public AuthService(IConfiguration config)
        {
            _config = config;
        }

        public Task<bool> AuthenticateAsync(Login loginCredentials)
        {
            var adminEmail = _config["AdminAccount:Email"];
            var storedHash = _config["AdminAccount:PasswordHash"];


            if (loginCredentials.Email == adminEmail)
            {
                bool isValid = BCrypt.Net.BCrypt.Verify(loginCredentials.Password, storedHash);
                Console.WriteLine($"Password Match: {isValid}");
                return Task.FromResult(isValid);
            }

            return Task.FromResult(false);
        }

        public string GenerateJwtToken(string adminId)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JwtSettings:SecretKey"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {

                new Claim(ClaimTypes.NameIdentifier, adminId),
                new Claim(ClaimTypes.Role, "Admin"),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _issuer,
                audience: _audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
