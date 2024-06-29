using EaseAppMD.Model;

namespace EaseAppMD.Interfaces
{
    public interface IAppointmentRepository
    {
        string QueryToExecute { get; set; }
        Appointment AddAppointment(Appointment appointment);
        List<AppointmentDetails> GetAppointmentById(int userId);
        List<AppointmentDetails> GetAppointmentByUserNameEmail(string userName, string email);
        int DeleteAppointment(int appointmentId);
        void SendReminders();
        Appointment RescheduleAppointment(Appointment appointment);
    }
}
