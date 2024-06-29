using EaseAppMD.Model;

namespace EaseAppMD.Interfaces
{
    public interface IUsersRepository
    {
        string QueryToExecute { get; set; }
        List<Users> GetUserById(int userId);
        Users Authenticate(string email, string password);
        int AddUsers(Users User);
        int AddPatientFeedback(PatientFeedback patientFeedback);
    }
}
