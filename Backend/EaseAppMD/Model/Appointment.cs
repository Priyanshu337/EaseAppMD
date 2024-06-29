using System.ComponentModel.DataAnnotations;

namespace EaseAppMD.Model
{
    public class Appointment
    {
        public int AppointmentID { get; set; }
        public int DoctorID { get; set; }
        public int PatientUserID { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string TimeslotStart { get; set; }
        public string TimeslotEnd { get; set; }
        public DateTime CreationDate { get; set; }

    }
    public class AppointmentDef
    {
        [Key]
        public int AppointmentID { get; set; }
        public int DoctorID { get; set; }
        public int PatientUserID { get; set; }
        public DateTime AppointmentDate { get; set; }
        public TimeSpan TimeslotStart { get; set; }
        public TimeSpan TimeslotEnd { get; set; }
        public DateTime CreationDate { get; set; }

    }

}
