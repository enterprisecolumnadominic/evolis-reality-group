using house_proj.Server.Data.Model;

namespace house_proj.Server.Data.Repositories
{
    public interface IEmailService
    {
        Task SendEmailAsync(EmailRequest mailRequest);
        Task SendPreQualifyEmailAsync(PreQualifyRequest request);
    }
}
