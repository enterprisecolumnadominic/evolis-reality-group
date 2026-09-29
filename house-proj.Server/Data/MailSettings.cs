using System.ComponentModel.DataAnnotations;

namespace house_proj.Server.Data
{
    public class MailSettings
    {
        [Required,EmailAddress]
        public string EmailTo { get; set; } = string.Empty;
        [Required,EmailAddress]
        public string EmailFrom { get; set; } = string.Empty;
        [Required,MinLength(16)]
        public string Password { get; set; } = string.Empty;  
        public string Host { get; set; } = "smtp.gmail.com";
        public int Port { get; set; } = 587;


    }
}
