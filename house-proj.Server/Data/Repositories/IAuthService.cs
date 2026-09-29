using house_proj.Server.Data.Model;

namespace house_proj.Server.Data.Repositories
{
    public interface IAuthService
    {
        Task<bool> AuthenticateAsync(Login loginCrendtials);

        string GenerateJwtToken(string adminId);
    }
}
