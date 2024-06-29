using EaseAppMD.Interfaces;
using EaseAppMD.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace EaseAppMD.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorsController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly IDoctorsRepository _doctorsRepository;
        private readonly IConfiguration _configuration; 
        public string QueryToExecute { get; set; }
        public DoctorsController(MyDbContext context, IDoctorsRepository doctorsRepository, IConfiguration configuration)
        {
            _context = context;
            _doctorsRepository = doctorsRepository;
            _configuration = configuration;
        }
        [HttpGet]
        [Route("GetAllDoctors")]
        public ActionResult<List<Doctors>> GetAllDoctors()
        {
            return _doctorsRepository.GetDoctors().ToList();
        }
        [HttpGet]
        [Route("GetDoctorDetails/{doctorId}")]
        public ActionResult<List<DoctorDetailsWithSlots>> GetDoctorDetails(int doctorId)
        {
            _doctorsRepository.QueryToExecute = _configuration.GetValue<string>("SqlQueries:DoctorById");
            return _doctorsRepository.GetDoctorById(doctorId).ToList();
        }
        [HttpGet]
        [Route("GetPatientFeedbackByDoctorId")]
        public ActionResult<List<FeedbackModel>> PatientFeedbackByDoctorId(int doctorId)
        {
            _doctorsRepository.QueryToExecute = _configuration.GetValue<string>("SqlQueries:PatientFeedbackByDoctorId");
            return _doctorsRepository.PatientFeedbackByDoctorId(doctorId).ToList();
        }

    }
}
