using System.ComponentModel.DataAnnotations;

namespace EaseAppMD.Model
{
    public class DoctorDetails
    {
        [Key]
        public int DoctorId { get; set; }
        public string? DoctorName { get; set; }
        public string? Speciality { get; set; }
        public string? ImageUrl { get; set; }
        public decimal Fee { get; set; }
        public string Biography { get; set; }
        public int SlotId { get; set; }
        public int DayOfWeek { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }      
        
    }
    public class DoctorSlots
    {
        [Key]
        public int SlotId { get; set; }
        public int DayOfWeek { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
    }
    public class DoctorDetailsWithSlots
    {
        public int DoctorId { get; set; }
        public string? DoctorName { get; set; }
        public string? Speciality { get; set; }
        public string? ImageUrl { get; set; }
        public decimal Fee { get; set; }
        public string Biography { get; set; }
        public List<DoctorSlots> DoctorDetailSlots { get; set; }
    }
}
