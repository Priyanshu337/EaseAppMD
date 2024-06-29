using EaseAppMD.Interfaces;
using EaseAppMD.Model;
using Microsoft.EntityFrameworkCore;

namespace EaseAppMD.Repositories
{
    public class DoctorsRepository :IDoctorsRepository
    {
        private MyDbContext _context;
        public string QueryToExecute { get; set; }
        public DoctorsRepository(MyDbContext context)
        {
            _context = context;
        }
        public List<Doctors> GetDoctors()
        {
            return _context.Doctors.ToList();
        }
        public List<DoctorDetailsWithSlots> GetDoctorById(int doctorId)
        {
            var doctorResults = _context.DoctorDetails.FromSqlRaw<DoctorDetails>(QueryToExecute, doctorId).AsNoTracking().ToList();

            // Check if there are no results and return empty list if true.
            if (!doctorResults.Any()) return new List<DoctorDetailsWithSlots>();

            var finalResults = new List<DoctorDetailsWithSlots>();

            var doctorRes = new DoctorDetailsWithSlots
            {
                DoctorId = doctorResults.First().DoctorId,
                DoctorName = doctorResults.First().DoctorName,
                Speciality = doctorResults.First().Speciality,
                ImageUrl = doctorResults.First().ImageUrl,
                Fee = doctorResults.First().Fee,
                Biography = doctorResults.First().Biography,
                DoctorDetailSlots = new List<DoctorSlots>()  // Initialize the list of slots
            };

            foreach (var doctor in doctorResults)
            {
                var doctorSlots = new DoctorSlots
                {
                    SlotId = doctor.SlotId,
                    DayOfWeek = doctor.DayOfWeek,
                    StartTime = doctor.StartTime,
                    EndTime = doctor.EndTime
                };

                doctorRes.DoctorDetailSlots.Add(doctorSlots);  // Add the slot to the list
            }

            finalResults.Add(doctorRes);  // Add the populated doctorRes object to finalResults

            return finalResults;
        }

        public List<FeedbackModel> PatientFeedbackByDoctorId(int doctorId)
        {
            return _context.PatientFeedbackModel.FromSqlRaw<FeedbackModel>(QueryToExecute, doctorId).AsNoTracking().ToList();
        }

    }
}
