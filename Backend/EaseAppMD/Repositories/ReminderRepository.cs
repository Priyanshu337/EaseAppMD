using EaseAppMD.Interfaces;

namespace EaseAppMD.Repositories
{
    public class ReminderRepository
    {
        private readonly IAppointmentRepository _appointmentRepository;

        public ReminderRepository(IAppointmentRepository appointmentRepository)
        {
            _appointmentRepository = appointmentRepository;
        }

        public void SendReminders()
        {
            _appointmentRepository.SendReminders();
        }
    }
}
