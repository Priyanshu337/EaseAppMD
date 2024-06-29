using EaseAppMD.Interfaces;
using EaseAppMD.Model;
using Microsoft.AspNetCore.Mvc;

namespace EaseAppMD.Controllers
{
    public class EmailController : ControllerBase
    {
        private readonly IEmailRepository _emailRepository;
        private readonly MyDbContext _context;
        private readonly IConfiguration _configuration;
        public EmailController(MyDbContext context, IEmailRepository emailRepository, IConfiguration configuration)
        {
            _context = context;
            _emailRepository = emailRepository;
            _configuration = configuration;
        }
        //[HttpPost]
        //public async Task<IActionResult> SendEmail(Appointment appointment)
        //{
        //    var templateId = _configuration.GetValue<string>("SendGrid:TemplateId");
        //    var templateData = new
        //    {
        //        PatientName = appointment.PatientName,
        //        PatientEmail = appointment.PatientEmail,
        //        DoctorsName = appointment.DoctorsName,
        //        AppointmentDate = appointment.AppointmentDate.ToString("yyyy-MM-dd"),
        //        AppointmentTime = appointment.AppointmentTime,
        //        ClinicsName = appointment.ClinicsName,
        //        ClinicsAddress = appointment.ClinicsAddress
        //    };

        //    await _emailRepository.SendEmailAsync(templateData.PatientEmail, "Appointment Confirmation", templateId, templateData);

        //    return Ok();
        //}
    }
}
