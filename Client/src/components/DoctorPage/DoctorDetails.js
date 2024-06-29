import React, { useState, useEffect } from "react";
import "./DoctorDetails.css";
import DatePicker from "./DatePicker";
import { useLocation, useParams } from "react-router-dom";
import AppointmentConfirmation from '../Appointment/AppointmentConfirmation';
import DoctorReviewCard from "./DoctorReviewCard";

const DoctorDetails = () => {
  const params = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // Access individual parameters as needed
  const { id } = params;
  const appointmentId = searchParams.get('appointmentId');
  const date = searchParams.get('date');
  const startTime = searchParams.get('startTime');
  const endTime = searchParams.get('endTime');

  console.log('Route Parameters:', params);
  console.log('Query Parameters:', { appointmentId, date, startTime, endTime });

  const [doctorData, setDoctorData] = useState({});
  const [appointment, setAppointment] = useState({
    selectedDate: null,
    selectedTimeSlot: null
  });


  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookedAppointmentDetails, setBookedAppointmentDetails] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (id) {
      fetch(`https://localhost:7012/api/Doctors/GetDoctorDetails/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setDoctorData({
            doctor: {
              image_url: data[0].imageUrl,
              name: data[0].doctorName,
              speciality: data[0].speciality,
              biography: data[0].biography,
              doctorDetailSlots: data[0].doctorDetailSlots
            },
            reviews: [],
          });
        })
        .catch((error) => {
          console.error("There was an error fetching the data:", error);
        });

      fetch(`https://localhost:7012/api/Doctors/GetPatientFeedbackByDoctorId?doctorId=${id}`)
        .then((response) => response.json())
        .then((data) => {
          setReviews(data);
        })
        .catch((error) => {
          console.error("There was an error fetching the reviews:", error);
        });
    }
  }, [id]);

  const extractTimeFromSlot = (timeSlot) => {
    const timeSlots = timeSlot.split(" - ");
    const startTime = timeSlots[0].trim().slice(0, -3);
    const endTime = timeSlots[1].trim().slice(0, -3);
    return { startTime, endTime };
  };
  const convertDateFormat = (inputDate) => {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // +1 because months are 0-indexed
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  const handleDateAndTimeSelection = (date, timeSlot) => {
    const { startTime, endTime } = extractTimeFromSlot(timeSlot);
    setAppointment({
      selectedDate: date,
      selectedTimeSlot: {
        start: startTime,
        end: endTime
      }
    });
  };
  console.log({ appointment });
  const bookAppointment = () => {
    const userId = sessionStorage.getItem('userId');

    if (!userId) {
      console.error("User not logged in.");
      return;
    }
    const convertDateFormat = (date) => {

      return date.toISOString().split('T')[0];
    };

    const convertTimeFormat = (time) => {

      const [hours, minutes = '00'] = time.split(':');
      return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
    };
    const convertDateToISO = (dateStr) => {
      const months = {
        Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
        Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
      };

      const parts = dateStr.split(' ');
      const year = parts[3];
      const month = months[parts[1]];
      const day = parts[2].padStart(2, '0');

      return `${year}-${month}-${day}`;
    };
    console.log("Appointment date is " + appointment.selectedDate);
    console.log("Appointment time is " + appointment.selectedTimeSlot.start);
    const payload = {

      doctorID: parseInt(id),
      patientUserID: parseInt(userId),
      appointmentDate: convertDateToISO(appointment.selectedDate),
      timeslotStart: convertTimeFormat(appointment.selectedTimeSlot.start),
      timeslotEnd: convertTimeFormat(appointment.selectedTimeSlot.end),
      creationDate: new Date().toISOString(),
      ...(appointmentId && { AppointmentID: parseInt(appointmentId) })


    };
    console.log({ payload });
    fetch("https://localhost:7012/BookAppointment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        console.log("Appointment booked:", data);
        setBookedAppointmentDetails(data);
        setShowConfirmation(true);
      })
      .catch(error => {
        console.error("There was an error booking the appointment:", error);
      });
  };

  return (
    <div className="container-fluid doctor-details-page" style={{ padding: "0 5%" }}>
      {showConfirmation ? (
        <AppointmentConfirmation
          doctorsName={bookedAppointmentDetails.doctorsName}
          appointmentDate={bookedAppointmentDetails.appointmentDate}
          appointmentTime={bookedAppointmentDetails.appointmentTime}
          patientEmail={bookedAppointmentDetails.patientEmail}
        />

      ) : (
        <>
          <h3 className="detail">Details</h3>
          <div className="details">
            <section className="doctor-details">
              <div className="details-container">
                <div className="doctor-profile">
                  <img
                    src={doctorData?.doctor?.image_url}
                    alt={doctorData?.doctor?.name}
                  />
                  <div>
                    <h1>{doctorData?.doctor?.name}</h1>
                    <h2>{doctorData?.doctor?.speciality}</h2>
                  </div>
                </div>

                <div className="doctor-biography">
                  <p className="biography">{doctorData?.doctor?.biography}</p>
                </div>
              </div>
            </section>

            <div className="appointment-details">
              <DatePicker slots={doctorData?.doctor?.doctorDetailSlots} onSelection={handleDateAndTimeSelection}
                preselectedDate={date}
                preselectedStartTime={startTime} // Pass the start time for preselection
                preselectedEndTime={endTime} />
              <button onClick={bookAppointment} className="btn btn-primary center-button">
                Book Appointment
              </button>
            </div>
          </div>
          {/* Render DoctorReviewCard for each review */}
          <h3 className="reviewheader">Reviews</h3>
          <div className="reviews-container">

            {reviews.map((review) => (
              <DoctorReviewCard
                key={review.feedbackId}
                name={review.userName}
                reviewText={review.comment}
                rating={review.rating}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DoctorDetails;
