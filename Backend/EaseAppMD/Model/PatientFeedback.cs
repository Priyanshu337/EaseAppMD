using System.ComponentModel.DataAnnotations;

namespace EaseAppMD.Model
{
    public class PatientFeedback
    {
        [Key]
        public int FeedbackID { get; set; }
        public int PatientID { get; set; }
        public int DoctorID { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }

    }
}
