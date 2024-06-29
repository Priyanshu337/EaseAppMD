using EaseAppMD.Interfaces;
using EaseAppMD.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace EaseAppMD.Repositories
{
    public class AppointmentRepository: IAppointmentRepository
    {
        private MyDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IEmailRepository _emailRepository;
        public string QueryToExecute { get; set; }
        public AppointmentRepository(MyDbContext context, IConfiguration configuration, IEmailRepository emailRepository)
        {
            _context = context;
            _configuration = configuration;
            _emailRepository = emailRepository;
        }
        public Appointment AddAppointment(Appointment appointment)
        {
            _context.Appointment.Add(appointment);
            _context.SaveChanges();
            return appointment;
        }
        public Appointment RescheduleAppointment (Appointment appointment)
        {
            // return _context.Appointment.FromSqlRaw<Appointment>(QueryToExecute,appointment.AppointmentDate,appointment.TimeslotStart,appointment.TimeslotEnd,appointment.AppointmentID).FirstOrDefault();
            _context.Appointment.Update(appointment);
            _context.SaveChanges();
            return appointment;
        }
       public List<AppointmentDetails> GetAppointmentById(int userId)
        {
          return  _context.AppointmentDetails.FromSqlRaw<AppointmentDetails>(QueryToExecute, userId).AsNoTracking().ToList();
        }
        public List<AppointmentDetails> GetAppointmentByUserNameEmail(string userName, string email)
        {
            return _context.AppointmentDetails.FromSqlRaw<AppointmentDetails>(QueryToExecute, userName,email).AsNoTracking().ToList();
        }
        public int DeleteAppointment(int  appointmentId)  
        {
            string query = "DELETE FROM Appointment WHERE AppointmentID = {0}";

            int affectedRows = _context.Database.ExecuteSqlRaw(query, appointmentId);

            return affectedRows;
        }
        public async void SendReminders()
        {
            var nextDay = DateTime.Today.AddDays(1);
            var nextDayEnd = nextDay.AddDays(1);

            // Retrieve appointments for the next day
            //var appointments = _context.Appointment
            //                           .Where(a => a.AppointmentDate >= nextDay && a.AppointmentDate < nextDayEnd)
            //                           .ToList();
            string query = "SELECT * FROM Appointment";
            var appointments = _context.AppointmentDef.FromSqlRaw<AppointmentDef>(query).AsNoTracking().ToList();
            var tomorrowAppointments = appointments
      .Where(a => a.AppointmentDate >= nextDay && a.AppointmentDate < nextDayEnd)
      .ToList();

            foreach (var appointment in tomorrowAppointments)
            {
                var templateId = _configuration.GetValue<string>("SendGrid:RemainderTemplateId");
                List<Users> user = _context.Users.Where(x => x.UserId == appointment.PatientUserID).ToList();
                List<Doctors> doctorDetails = _context.Doctors.Where(x => x.Id == appointment.DoctorID).ToList();
                var templateData = new
                {
                    PatientName = user?.FirstOrDefault().Username,
                    PatientEmail = user?.FirstOrDefault().Email,
                    DoctorsName = doctorDetails?.FirstOrDefault().Name,
                    AppointmentDate = appointment.AppointmentDate,
                    AppointmentTime = appointment.TimeslotStart,
                    ClinicsName = "AppEaseMD",
                    ClinicsAddress = "275 larch st"
                };
                await _emailRepository.SendEmailAsync(templateData.PatientEmail, "Appointment Remainder", templateId, templateData);
            }
        }

    }
}
