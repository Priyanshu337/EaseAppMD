using EaseAppMD.Interfaces;
using EaseAppMD.Model;
using Microsoft.EntityFrameworkCore;

namespace EaseAppMD.Repositories
{
    public class UsersRepository:IUsersRepository
    {
        private MyDbContext _context;
        public string QueryToExecute { get; set; }
        public UsersRepository(MyDbContext context) {
            _context = context;
        }
        public List<Users> GetUserById(int userId)
        {
            return _context.Users.Where(x => x.UserId == userId).ToList();
        }
        public Users Authenticate(string email, string password)
        {
            var users = _context.Users;

            if (users == null)
            {
                // Handle the case where _context.Users is null, possibly by throwing an exception or logging an error
                return null;
            }

            return users?.SingleOrDefault(x => x.Email == email && x.Password == password);
        }
        public int AddUsers(Users User)
        {
            _context.Users.Add(User);
            return _context.SaveChanges();
        }
        public int AddPatientFeedback(PatientFeedback patientFeedback)
        {
            _context.PatientFeedback.Add(patientFeedback);
            return _context.SaveChanges();
        }
    }
}
