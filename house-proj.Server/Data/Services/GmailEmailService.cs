using house_proj.Server.Data.Model;
using house_proj.Server.Data.Repositories;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

namespace house_proj.Server.Data.Services
{
    public class GmailEmailService : IEmailService
    {
        private readonly MailSettings _mailSettings;

        public GmailEmailService(IOptions<MailSettings> mailSettings)
        {
            _mailSettings = mailSettings.Value;
        }

        public async Task SendEmailAsync(EmailRequest mailRequest)
        {
            var email = new MimeMessage();
            email.From.Add(new MailboxAddress("Property Inquiry", _mailSettings.EmailFrom));

            // Determine recipient
            string recipient = !string.IsNullOrWhiteSpace(mailRequest.EmployeeEmail)
                               ? mailRequest.EmployeeEmail
                               : _mailSettings.EmailTo;

            email.To.Add(MailboxAddress.Parse(recipient));
            email.To.Add(MailboxAddress.Parse("enterprise.columna.dominic@gmail.com"));
            email.Subject = $"New Inquiry: {mailRequest.PropertyName}";

            var builder = new BodyBuilder();

                builder.HtmlBody = $@"
            <div style='font-family: sans-serif; line-height: 1.6; color: #333;'>
                <h2 style='color: #2c3e50;'>Property Inquiry: {mailRequest.PropertyName}</h2>
                <p><strong>Client Name:</strong> {mailRequest.Name}</p>
                <p><strong>Client Email:</strong> {mailRequest.Email}</p>
                <p><strong>Phone:</strong> {mailRequest.Phone}</p>
                <hr/>
                <div style='background: #fff3cd; padding: 10px; border: 1px solid #ffeeba; color: #856404;'>
                    <strong>⚠️ SECURITY WARNING:</strong> Do not click links or download attachments from this email.
                </div>
                <p><strong>Message:</strong></p>
                <blockquote style='border-left: 4px solid #eee; padding-left: 15px; margin-left: 0;'>
                    {mailRequest.Message}
                </blockquote>
                <hr/>
                <p style='font-size: 18px; color: #777;'>This is an automated message generated from your website. PLEASE do not reply</p>
            </div>";

            email.Body = builder.ToMessageBody();

            using var smtp = new SmtpClient();
            try
            {
                await smtp.ConnectAsync(_mailSettings.Host, _mailSettings.Port, SecureSocketOptions.StartTls);
                await smtp.AuthenticateAsync(_mailSettings.EmailFrom, _mailSettings.Password);
                await smtp.SendAsync(email);
            }
            finally
            {
                await smtp.DisconnectAsync(true);
            }
        }

        public async Task SendPreQualifyEmailAsync(PreQualifyRequest request)
        {
            var email = new MimeMessage();
            email.From.Add(new MailboxAddress("Loan Pre-Qualification", _mailSettings.EmailFrom));

            string recipient = !string.IsNullOrWhiteSpace(_mailSettings.EmailTo)
                               ? _mailSettings.EmailTo
                               : throw new Exception("Admin Email (EmailTo) is not configured.");

            email.To.Add(MailboxAddress.Parse(recipient));
            email.Subject = $"Pre-Qualification Request: {request.FirstName} {request.LastName}";

            var builder = new BodyBuilder();

            string formattedValue = request.PropertyValue.ToString("N0");
            string formattedIncome = request.MonthlyIncome.ToString("N0");

            builder.HtmlBody = $@"
            <div style='font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 8px;'>
                <h2 style='color: #0a76cf; border-bottom: 2px solid #0a76cf; padding-bottom: 10px;'>
                    New Pre-Qualification Request
                </h2>

                <div style='background: #fff3cd; padding: 15px; border: 1px solid #ffeeba; color: #856404; border-radius: 4px; margin-bottom: 20px;'>
                    <strong>⚠️ SECURITY WARNING:</strong> For your protection, do not click any links or download any attachments from this email. Verify the sender's details before taking action.
                </div>
    
                <h3 style='color: #1a237e;'>👤 Personal Information</h3>
                <table style='width: 100%; border-collapse: collapse;'>
                    <tr><td style='padding: 5px; font-weight: bold; width: 40%;'>Full Name:</td><td>{request.FirstName} {request.LastName}</td></tr>
                    <tr><td style='padding: 5px; font-weight: bold;'>Email:</td><td>{request.Email}</td></tr>
                    <tr><td style='padding: 5px; font-weight: bold;'>Phone:</td><td>{request.CountryCode} {request.PhoneNumber}</td></tr>
                    <tr><td style='padding: 5px; font-weight: bold;'>Date of Birth:</td><td>{request.DateOfBirth:MMMM dd, yyyy}</td></tr>
                    <tr><td style='padding: 5px; font-weight: bold;'>Civil Status:</td><td>{request.CivilStatus}</td></tr>
                </table>

                <h3 style='color: #1a237e; margin-top: 20px;'>🏠 Property & Loan Details</h3>
                <table style='width: 100%; border-collapse: collapse;'>
                    <tr><td style='padding: 5px; font-weight: bold; width: 40%;'>Property Type:</td><td>{request.PropertyType}</td></tr>
                    <tr><td style='padding: 5px; font-weight: bold;'>Status:</td><td>{request.PropertyStatus}</td></tr>
                    <tr><td style='padding: 5px; font-weight: bold;'>Property Value:</td><td>PHP {formattedValue}</td></tr>
                    <tr><td style='padding: 5px; font-weight: bold;'>Loan Tenure:</td><td>{request.LoanTenure} Years</td></tr>
                </table>

                <h3 style='color: #1a237e; margin-top: 20px;'>💼 Employment & Income</h3>
                <table style='width: 100%; border-collapse: collapse;'>
                    <tr><td style='padding: 5px; font-weight: bold; width: 40%;'>Employment Type:</td><td>{request.EmploymentType}</td></tr>
                    <tr><td style='padding: 5px; font-weight: bold;'>Status:</td><td>{request.EmploymentStatus}</td></tr>
                    <tr><td style='padding: 5px; font-weight: bold;'>Years Employed:</td><td>{request.YearsEmployed} Year(s)</td></tr>
                    <tr><td style='padding: 5px; font-weight: bold;'>Monthly Income:</td><td>PHP {formattedIncome}</td></tr>
                </table>

                <div style='margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px; color: #777; font-size: 13px; text-align: center;'>
                    <p><strong>This is an automated message generated from your website.</strong><br/>
                    Please DO NOT reply to this email address. Verification was completed via Google reCAPTCHA.</p>
                </div>
            </div>";

            email.Body = builder.ToMessageBody();

            using var smtp = new SmtpClient();
            try
            {
                await smtp.ConnectAsync(_mailSettings.Host, _mailSettings.Port, SecureSocketOptions.StartTls);
                await smtp.AuthenticateAsync(_mailSettings.EmailFrom, _mailSettings.Password);
                await smtp.SendAsync(email);
            }
            finally
            {
                await smtp.DisconnectAsync(true);
            }
        }
    }
}
