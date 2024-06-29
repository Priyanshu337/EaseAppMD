using Azure;

namespace EaseAppMD.Interfaces
{
    //The interface (IEmailRepository in this case) only declares the method signatures (like SendEmailAsync) without specifying how these methods are implemented.
    //Other parts of the application, like controllers or services, rely on this interface to invoke email-related operations.They don't need to know about the underlying mechanics of how emails are sent
    public interface IEmailRepository
    {
        Task SendEmailAsync(string toEmail, string subject, string templateId, object dynamicTemplateData);
    }
}
