using EaseAppMD.Interfaces;
using EaseAppMD.Model;
using EaseAppMD.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace EaseAppMD.Controllers
{
    public class AppointmentController : ControllerBase
    {
        private readonly IEmailRepository _emailRepository;
        private readonly MyDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IDoctorsRepository _doctorsRepository;
        private IAppointmentRepository appointmentRepository;

        public AppointmentController(MyDbContext context, IAppointmentRepository appointmentRepository, IEmailRepository emailRepository, IConfiguration configuration, IDoctorsRepository doctorsRepository)
        {
            _context = context;
           _appointmentRepository = appointmentRepository;
            _emailRepository = emailRepository;
            _configuration = configuration;
            _doctorsRepository = doctorsRepository;
        }

        [HttpPost]
        [Route("BookAppointment")]
        public async Task<IActionResult> BookAppointment([FromBody] Appointment appointment)
        {
            Appointment appointment1 = new Appointment();
            string templateId;
            string message;
            if ( appointment.AppointmentID == 0)
            {
                 appointment1 = _appointmentRepository.AddAppointment(appointment);
                templateId = _configuration.GetValue<string>("SendGrid:TemplateId");
                message = _configuration.GetValue<string>("SendGrid:AppointmentConfirmationMessage");
            }
            else
            {
                _appointmentRepository.QueryToExecute = _configuration.GetValue<string>("SqlQueries:RescheduleAppointment");
                appointment1 = _appointmentRepository.RescheduleAppointment(appointment);
                templateId = _configuration.GetValue<string>("SendGrid:AppointmentReschedule");
                message = _configuration.GetValue<string>("SendGrid:AppointmentRescheduleMessage");
            }
           
            List<Users> user = _context.Users.Where(x => x.UserId == appointment1.PatientUserID).ToList();
            List<Doctors> doctorDetails = _context.Doctors.Where(x => x.Id == appointment1.DoctorID).ToList();
            var templateData = new
            {
                PatientName = user?.FirstOrDefault().Username,
                PatientEmail = user?.FirstOrDefault().Email,
                DoctorsName = doctorDetails?.FirstOrDefault().Name,
                AppointmentDate = appointment1.AppointmentDate,
                AppointmentTime = appointment1.TimeslotStart,
                ClinicsName = "AppEaseMD",
                ClinicsAddress = "275 larch st"
            };

            await _emailRepository.SendEmailAsync(templateData.PatientEmail, message, templateId, templateData);

             return Ok(templateData);
        }
        [HttpGet]
        [Route("GetAppointmentDetails/{userId}")]
        public ActionResult<List<AppointmentDetails>> GetDoctorDetails(int userId)
        {
            _appointmentRepository.QueryToExecute = _configuration.GetValue<string>("SqlQueries:AppointmentsByUserId");
            return _appointmentRepository.GetAppointmentById(userId).ToList();
        }
        [HttpGet]
        [Route("GetAppointmentDetails/{userName}/{email}")]
        public ActionResult<List<AppointmentDetails>> GetAppointmentDetails(string userName, string email)
        {
            _appointmentRepository.QueryToExecute = _configuration.GetValue<string>("SqlQueries:AppointmentsByUserName");
            return _appointmentRepository.GetAppointmentByUserNameEmail(userName,email).ToList();
        }
        [HttpDelete]
        [Route("DeleteAppointment/{appointmentId}")]
        public ActionResult<int> DeleteAppointment(int appointmentId)
        {
            try
            {
                return _appointmentRepository.DeleteAppointment(appointmentId);
            }
            catch (Exception ex)
            {
                return 0;
            }
        }
       
     }
}
