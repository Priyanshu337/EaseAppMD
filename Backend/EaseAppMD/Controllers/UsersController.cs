using Azure.Core;
using EaseAppMD.Interfaces;
using EaseAppMD.Model;
using Microsoft.AspNetCore.Mvc;

namespace EaseAppMD.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly IUsersRepository _usersRepository;
        public UsersController(MyDbContext context, IUsersRepository usersRepository)
        {
            _context = context;
            _usersRepository = usersRepository;
        }
        [HttpGet]
        [Route("GetCustomerById/{userId}")]
        public ActionResult<List<Users>> GetCustomerById(int userId)
        {

                return _usersRepository.GetUserById(userId);
           
        }
        [HttpPost("Authenticate")]
        public ActionResult<Users> AuthenticateUser([FromBody] Users user)
        {
            var userDetails = _usersRepository.Authenticate(user.Email , user.Password);

            if (userDetails == null)
            {
                return NotFound("Invalid username or password");
            }

            return Ok(userDetails);
        }
        [HttpPost]
        [Route("AddUser")]
        public ActionResult<int> AddUser(Users user)
        {
            try
            {
              return  _usersRepository.AddUsers(user);
            }
            catch (Exception ex)
            {
                return 0;
            }
        }
        [HttpPost]
        [Route("PatientFeedback")]
        public ActionResult<int> PatientFeedback(PatientFeedback patientFeedback)
        {
            try
            {
                return _usersRepository.AddPatientFeedback(patientFeedback);
            }
            catch (Exception ex)
            {
                return 0;
            }
        }
       

    }
}
