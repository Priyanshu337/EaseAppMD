using Castle.Core.Configuration;
using EaseAppMD.Controllers;
using EaseAppMD.Interfaces;
using EaseAppMD.Model;
using EaseAppMD.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Moq;
using NUnit.Framework;
using SendGrid.Helpers.Mail;

namespace EaseAppMD.Tests
{
    [TestFixture]
    public class AppointmentControllerTests
    {
        private MyDbContext _dbContext;
        private IAppointmentRepository _appointmentRepository;
        private IDoctorsRepository _doctorsRepository;
        private IUsersRepository _usersRepository;


        [SetUp]
        public void Setup()
        {
            var connectionString = "Server=tcp:appeasemdcapstone.database.windows.net,1433;Initial Catalog=AppEaseMD;Persist Security Info=False;User ID=AppEaseMD;Password=Capstone@123;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;";

            var options = new DbContextOptionsBuilder<MyDbContext>()
           .UseSqlServer(connectionString)
           .Options;

            _dbContext = new MyDbContext(options);
            _appointmentRepository = new AppointmentRepository(_dbContext, Mock.Of<Microsoft.Extensions.Configuration.IConfiguration>(), Mock.Of<IEmailRepository>());
            _doctorsRepository = new DoctorsRepository(_dbContext);
            _usersRepository = new UsersRepository(_dbContext);
        }

        [Test]
        public void GetAppointmentDetailsById_NotNull()
        {

            int userId = 5; // Provide a valid user id
            _appointmentRepository.QueryToExecute = "SELECT A.AppointmentID, D.name AS DoctorName, D.id AS DoctorID, U.UserId AS UserID, U.Username, A.AppointmentDate, A.TimeslotStart AS StartTime, A.TimeslotEnd AS EndTime FROM Appointment A JOIN Doctors D ON A.DoctorID = D.id JOIN Users U ON A.PatientUserID = U.UserID WHERE U.UserID = {0}";
            // Act
            var result = _appointmentRepository.GetAppointmentById(userId);

            // Assert
            Assert.IsNotNull(result);
            // Assert.AreEqual(0, result.Count);

        }
        [Test]
        public void GetAppointmentDetailsById_Count7()
        {

            int userId = 5; // Provide a valid user id
            _appointmentRepository.QueryToExecute = "SELECT A.AppointmentID, D.name AS DoctorName, D.id AS DoctorID, U.UserId AS UserID, U.Username, A.AppointmentDate, A.TimeslotStart AS StartTime, A.TimeslotEnd AS EndTime FROM Appointment A JOIN Doctors D ON A.DoctorID = D.id JOIN Users U ON A.PatientUserID = U.UserID WHERE U.UserID = {0}";
            // Act
            var result = _appointmentRepository.GetAppointmentById(userId);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(0, result.Count);

        }
        [Test]
        public void GetAppointmentDetailsByNameEmail_NotNull()
        {
            string username = "akshithreddy";
            string email = "akshithreddythummala@gmail.com";

            int userId = 5; // Provide a valid user id
            _appointmentRepository.QueryToExecute = "SELECT A.AppointmentID, D.name AS DoctorName, D.id AS DoctorID, U.UserId AS UserID, U.Username, A.AppointmentDate, A.TimeslotStart AS StartTime, A.TimeslotEnd AS EndTime FROM Appointment A JOIN Doctors D ON A.DoctorID = D.id JOIN Users U ON A.PatientUserID = U.UserID WHERE U.Username = {0} and U.Email={1}";
            // Act
            var result = _appointmentRepository.GetAppointmentByUserNameEmail(username, email);

            // Assert
            Assert.IsNotNull(result);

        }
        [Test]
        public void GetAppointmentDetailsByNameEmail_Count7()
        {
            string username = "akshithreddy";
            string email = "akshithreddythummala@gmail.com";

            int userId = 5; // Provide a valid user id
            _appointmentRepository.QueryToExecute = "SELECT A.AppointmentID, D.name AS DoctorName, D.id AS DoctorID, U.UserId AS UserID, U.Username, A.AppointmentDate, A.TimeslotStart AS StartTime, A.TimeslotEnd AS EndTime FROM Appointment A JOIN Doctors D ON A.DoctorID = D.id JOIN Users U ON A.PatientUserID = U.UserID WHERE U.Username = {0} and U.Email={1}";
            // Act
            var result = _appointmentRepository.GetAppointmentByUserNameEmail(username, email);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(0, result.Count);

        }
        [Test]
        public void BookAppointment_ValidData_Passes()
        {
            var validAppointment = new Appointment
            {
                AppointmentID = 0,
                DoctorID = 1,
                PatientUserID = 5,
                AppointmentDate = DateTime.Parse("2023-11-29"),
                TimeslotStart = "15:00:00",
                TimeslotEnd = "16:00:00",
                CreationDate = DateTime.Now
            };
            var result = _appointmentRepository.AddAppointment(validAppointment);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOf<Appointment>(result);

            // Add more specific assertions if needed
            Assert.AreEqual(validAppointment, result);
        }
        [Test]
        public void BookAppointment_InValidData_Passes()
        {
            var invalidAppointment = new Appointment
            {
                AppointmentID = 0,
                DoctorID = -1, // Invalid doctor ID (assuming it should be a positive integer)
                PatientUserID = 5,
                AppointmentDate = DateTime.Parse("2023-11-29"),
                TimeslotStart = "15:00:00",
                TimeslotEnd = "16:00:00",
                CreationDate = DateTime.Now
            };
            var result = _appointmentRepository.AddAppointment(invalidAppointment);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOf<Appointment>(result);

            // Add more specific assertions if needed
            Assert.AreEqual(invalidAppointment, result);
        }
        [Test]
        public void DeleteAppointment_InvalidId_Fails()
        {
            // Arrange
            int invalidAppointmentId = -1; // Assuming an invalid appointment ID


            // Act
            int result = _appointmentRepository.DeleteAppointment(invalidAppointmentId);

            // Assert
            Assert.AreEqual(1, result);
        }
        [Test]
        public void DeleteAppointment_validId()
        {
            // Arrange
            int invalidAppointmentId = 40; // 


            // Act
            int result = _appointmentRepository.DeleteAppointment(invalidAppointmentId);

            // Assert
            Assert.AreEqual(1, result);
        }

        [Test]
        public void GetDoctors_ValidData_ReturnsListOfDoctors()
        {
            var doctors = _doctorsRepository.GetDoctors();
            Assert.IsNotNull(doctors);
            Assert.AreEqual(9, doctors.Count);
        }
        [Test]
        public void GetDoctors_InValidData_ReturnsListOfDoctors()
        {
            var doctors = _doctorsRepository.GetDoctors();
            Assert.IsNotNull(doctors);
            Assert.AreEqual(7, doctors.Count);
        }
        [Test]
        public void GetDoctorsById_NotNull()
        {

            int userId = 1; // Provide a valid user id
            _doctorsRepository.QueryToExecute = "SELECT d.id AS DoctorId, d.name AS DoctorName, d.speciality AS Speciality, d.image_url AS ImageUrl, d.fee as Fee,d.Biography, s.slot_id as SlotId, s.day_of_week AS DayOfWeek, s.start_time AS StartTime, s.end_time AS EndTime FROM [dbo].[Doctors] d JOIN [dbo].[DoctorSlots] s ON d.id = s.doctor_id WHERE d.id = {0}";

            // Act
            var result = _doctorsRepository.GetDoctorById(userId);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);

        }
        [Test]
        public void GetDoctorsById_NotNull_Invaliddata()
        {

            int userId = -1; // Provide a valid user id
            _doctorsRepository.QueryToExecute = "SELECT d.id AS DoctorId, d.name AS DoctorName, d.speciality AS Speciality, d.image_url AS ImageUrl, d.fee as Fee,d.Biography, s.slot_id as SlotId, s.day_of_week AS DayOfWeek, s.start_time AS StartTime, s.end_time AS EndTime FROM [dbo].[Doctors] d JOIN [dbo].[DoctorSlots] s ON d.id = s.doctor_id WHERE d.id = {0}";
            // Act
            var result = _doctorsRepository.GetDoctorById(userId);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);

        }

        [Test]
        public void GetUsersById_NotNull()
        {

            int userId = 1; // Provide a valid user id

            // Act
            var result = _usersRepository.GetUserById(userId);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);

        }
        [Test]
        public void GetUsersById_NotNull_Invaliddata()
        {

            int userId = -1; // Provide a valid user id

            // Act
            var result = _usersRepository.GetUserById(userId);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);

        }
        [Test]
        public void AddUsers_ValidData_ReturnsSuccess()
        {
            var newUser = new Users
            {
                Username = "newUser",
                Password = "password123",
                Email = "newuser@example.com"
            };
            var result = _usersRepository.AddUsers(newUser);
            Assert.AreEqual(1, result);
        }
        [Test]
        public void AddUsers_ValidData_ReturnsFail()
        {
            var newUser = new Users
            {
                UserId = -1,
                Username = "newUser",
                Password = "password123",
                Email = "newuser@example.com"
            };
            var result = _usersRepository.AddUsers(newUser);
            Assert.AreEqual(1, result);
        }
    }
}