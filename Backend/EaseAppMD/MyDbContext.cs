using EaseAppMD.Model;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace EaseAppMD
{
    public class MyDbContext:DbContext
    {
        public MyDbContext(DbContextOptions<MyDbContext> options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Users>()
                    .Property(u => u.UserId)
                    .ValueGeneratedOnAdd();
            builder.Entity<Users>().ToTable("Users");
        }
        public DbSet<Users> Users { get; set; }
        public DbSet<Doctors> Doctors { get; set; }
        public DbSet<DoctorDetails> DoctorDetails { get; set; }
        public DbSet<Appointment> Appointment { get; set; }
        public DbSet<AppointmentDef> AppointmentDef { get; set; }
        public DbSet<AppointmentDetails> AppointmentDetails { get; set; }
        public DbSet<PatientFeedback> PatientFeedback { get; set; }
        public DbSet<FeedbackModel> PatientFeedbackModel { get; set; }

    }
}
