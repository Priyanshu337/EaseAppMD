using System.ComponentModel.DataAnnotations;

namespace EaseAppMD.Model
{
    public class AppointmentDetails
    {
        [Key]
        public int AppointmentID { get; set; }
        public string DoctorName { get; set; }
        public int DoctorID { get; set; }
        public int UserID { get; set; }
        public string Username { get; set; }
        public DateTime AppointmentDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
    }
}
