import React, { useState, useEffect } from 'react';
import './AppointmentCalendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-toastify/dist/ReactToastify.css';
import StarRating from '../DoctorPage/StarRating';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
Modal.setAppElement('#root');



const localizer = momentLocalizer(moment);
const eventStyleGetter = (event, start, end, isSelected) => {
  const style = {
    // Existing styles
    backgroundColor: 'lightblue',
    borderRadius: '5px',
    opacity: 0.8,
    color: 'black',
    border: '1px solid #ccc',
    display: 'block',
    paddingLeft: '4px',
    // Add a minimum height for the event container
    minHeight: '100px', // Adjust this value based on your needs
  };
  return { style };
};
// commented becuase giving error of no use
// const customStyles = {
//   content: {
//     top: '50%',
//     left: '50%',
//     right: 'auto',
//     bottom: 'auto',
//     marginRight: '-50%',
//     transform: 'translate(-50%, -50%)',
//     zIndex: 1000 // Ensure it's above other content
//   },
//   overlay: {
//     backgroundColor: 'rgba(0, 0, 0, 0.75)', // Semi-transparent background
//     zIndex: 999 // Ensure it's above other content but below the modal
//   }
// };
const textareaStyles = {
  width: '100%',       // Full width
  minHeight: '120px',  // Minimum height
  padding: '10px',     // Padding inside the textarea
  margin: '10px 0',    // Margin around the textarea
  border: '1px solid #ccc', // Border color
  borderRadius: '4px', // Rounded corners
  fontSize: '1rem',    // Font size
  lineHeight: '1.5',   // Line height
  resize: 'vertical',  // Allow vertical resizing only
  boxSizing: 'border-box', // Box sizing to include padding in width and height
};

const AppointmentsCalendar = () => {
  const [events, setEvents] = useState([]); // Initialize with an empty array
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [feedback, setFeedback] = useState({ rating: 0, comment: '' });
  const userId = sessionStorage.getItem('userId');
  const navigate = useNavigate();
  console.log({ events });
  const isPastAppointment = (appointmentDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to 00:00:00 for comparison
    return new Date(appointmentDate) < today;
  };
  const openFeedbackModal = (appointmentId, doctorName) => {
    setSelectedDoctor(doctorName);
    setSelectedAppointmentId(appointmentId);
    setIsFeedbackModalOpen(true);
  };
  const handleRatingChange = (newRating) => {
    setFeedback({ ...feedback, rating: newRating });
  };
  const handleFeedbackSubmit = (appointmentId) => {
    console.log("appointment id in handleFeedbackSubmit " + appointmentId);
    console.log({ events });
    const patientID = parseInt(sessionStorage.getItem('userId'), 10);
    const selectedEvent = events.find((event) => event.id === appointmentId);
    const doctorId = selectedEvent ? selectedEvent.doctorId : null;
    // const doctorId = 1;

    // Prepare the feedback object
    const feedbackData = {
      feedbackID: 0,
      patientID: patientID,
      doctorID: doctorId,
      rating: feedback.rating,
      comment: feedback.comment,
    };
    console.log({ feedbackData });

    // Make a POST request to the API
    fetch('https://localhost:7012/api/Users/PatientFeedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedbackData),
    })
      .then((response) => {
        if (response.ok) {
          // Display success message or handle as needed
          toast.success('Feedback submitted successfully!');
        } else {
          // Handle error response
          toast.error('Failed to submit feedback.');
        }
      })
      .catch((error) => {
        // Handle network error
        console.error('Error submitting feedback:', error);
        toast.error('There was an error submitting feedback.');
      })
      .finally(() => {
        // Close the feedback modal and reset the feedback state
        setIsFeedbackModalOpen(false);
        setFeedback({ rating: 0, comment: '' });
      });
  };
  useEffect(() => {
    // Fetch data from API when component mounts
    fetchAppointments();
  }, [userId]);

  const fetchAppointments = () => {
    fetch(`https://localhost:7012/GetAppointmentDetails/${userId}`)
      .then(response => response.json())
      .then(data => {
        const fetchedEvents = data.map(appointment => {
          const startDate = new Date(appointment.appointmentDate);
          const startTimeParts = appointment.startTime.split(':');
          const endDate = new Date(appointment.appointmentDate);
          const endTimeParts = appointment.endTime.split(':');

          startDate.setHours(parseInt(startTimeParts[0], 10));
          startDate.setMinutes(parseInt(startTimeParts[1], 10));

          endDate.setHours(parseInt(endTimeParts[0], 10));
          endDate.setMinutes(parseInt(endTimeParts[1], 10));

          return {
            start: startDate,
            end: endDate,
            title: `${appointment.doctorName} (${startTimeParts.slice(0, 2).join(':')} - ${endTimeParts.slice(0, 2).join(':')})`,
            id: appointment.appointmentID,
            doctorName: appointment.doctorName,
            doctorId: appointment.doctorID,
            startTime: appointment.startTime,
            endTime: appointment.endTime,
          };
        });

        setEvents(fetchedEvents); // Update the state with fetched data
      })
      .catch(error => {
        console.error("There was an error fetching the appointments:", error);
      });
  }
  const handleDelete = (appointmentId) => {
    fetch(`https://localhost:7012/DeleteAppointment/${appointmentId}`, { method: 'DELETE' })
      .then(response => {
        if (response.ok) {
          // Log the state before the update for debugging
          console.log('Before delete:', events);
          setEvents(prevEvents => {
            // Make sure to use the correct identifier and compare it properly
            const updatedEvents = prevEvents.filter(event => event.AppointmentID !== appointmentId);
            // Log the state after the update for debugging
            console.log('After delete:', updatedEvents);
            toast.success('Appointment deleted successfully!');
            return updatedEvents;
          });
          fetchAppointments();

        } else {
          toast.error('Failed to delete the appointment.');
        }
      })
      .catch(error => {
        console.error('There was an error making the delete request:', error);
        toast.error('There was an error making the delete request.');
      });
  };



  const handleReschedule = (appointmentId, doctorId, appointmentDate, startTime, endTime) => {
    // Perform reschedule operation if needed

    // Navigate to the doctor details page with appointment details
    const path = `/doctor-details/${doctorId}?appointmentId=${encodeURIComponent(appointmentId)}&date=${encodeURIComponent(appointmentDate)}&startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(endTime)}`;
    navigate(path);

  };
  // Inside the return statement of the component
  return (
    <div style={{ height: 500 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: '25px' }}
        eventPropGetter={eventStyleGetter}
        components={{
          event: ({ event }) => (
            <div style={{
              padding: '2px', // Reduced padding inside the event container         
              borderRadius: '4px',
              overflow: 'hidden',
              fontWeight: 'bold' // Prevents content from overflowing
            }}>
              <div style={{ fontSize: '0.85em', marginBottom: '2px' }}>{event.title}</div>
              <div>
                <button
                  onClick={() => handleDelete(event.id)}
                  style={{
                    backgroundColor: '#ff6868',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 6px', // Reduced padding to fit the button
                    margin: '2px 5px', // Reduced margin to fit the button
                    cursor: 'pointer',
                    fontSize: '0.75em', // Reduce font size to fit the button
                  }}
                >
                  Delete
                </button>
                <button
                  onClick={() => handleReschedule(event.id, event.doctorId, event.start.toISOString(), event.startTime, event.endTime)}
                  style={{
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 6px', // Reduced padding to fit the button
                    margin: '2px 5px', // Reduced margin to fit the button
                    cursor: 'pointer',
                    fontSize: '0.75em', // Reduce font size to fit the button
                  }}
                >
                  Reschedule
                </button>
                {isPastAppointment(event.start) && (
                  <button
                    onClick={() => openFeedbackModal(event.id, event.doctorName)}
                    style={{
                      backgroundColor: 'rgb(61 57 30)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 6px', // Reduced padding to fit the button
                      margin: '2px 0', // Reduced margin to fit the button
                      cursor: 'pointer',
                      fontSize: '0.75em', // Reduce font size to fit the button
                    }}
                  >
                    Feedback
                  </button>
                )}
              </div>
            </div>
          ),
        }}
      />
      <Modal
        isOpen={isFeedbackModalOpen}
        onRequestClose={() => setIsFeedbackModalOpen(false)}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)', // Semi-transparent background
            zIndex: 999 // Ensure it's above other content but below the modal
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000 // Ensure it's above other content
          },
        }}
      >
        <h2>{`Review for ${selectedDoctor}`}</h2>
        <StarRating rating={feedback.rating} onRatingChange={handleRatingChange} />
        <textarea
          value={feedback.comment}
          onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
          placeholder="Leave a comment..."
          style={textareaStyles}
        />
        <button onClick={() => handleFeedbackSubmit(selectedAppointmentId)}>Submit</button>
        <button style={{
          backgroundColor: 'red', // Set the background color to red
          // Adjust font size as needed
        }} onClick={() => setIsFeedbackModalOpen(false)}>Cancel</button>
      </Modal>
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );


}

export default AppointmentsCalendar;