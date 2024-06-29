using EaseAppMD.Interfaces;
using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace EaseAppMD.Repositories
{
    public class EmailRepository :IEmailRepository
    {
        private readonly SendGridClient _client;
        private readonly string _fromEmail;
        private readonly string _fromName;

        public EmailRepository(IConfiguration configuration)
        {
            var apiKey = configuration.GetValue<string>("SendGrid:ApiKey");
            _fromEmail = configuration.GetValue<string>("SendGrid:FromEmail");
            _fromName = configuration.GetValue<string>("SendGrid:FromName");

            _client = new SendGridClient(apiKey);
        }
        public async Task SendEmailAsync(string toEmail, string subject, string templateId, object dynamicTemplateData)
        {
            var message = new SendGridMessage
            {
                From = new EmailAddress(_fromEmail,_fromName ),
                Subject = subject,
                TemplateId = templateId,
            };

            message.AddTo(toEmail);
            message.SetTemplateData(dynamicTemplateData);

            await _client.SendEmailAsync(message);
        }
    }
}
