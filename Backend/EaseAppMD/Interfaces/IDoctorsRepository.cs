using EaseAppMD.Model;

namespace EaseAppMD.Interfaces
{
    public interface IDoctorsRepository
    {
        string QueryToExecute { get; set; }
        List<Doctors> GetDoctors();
        List<DoctorDetailsWithSlots> GetDoctorById(int doctorId);
        List<FeedbackModel> PatientFeedbackByDoctorId(int doctorId);
    }
}
