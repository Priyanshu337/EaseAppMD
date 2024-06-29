import '../Appointment/AppointmentConfirmation.css'
const AppointmentConfirmation = ({ doctorsName, appointmentDate, appointmentTime, patientEmail }) => {
    return (
        <div className="appointment-confirmation-container">
            <div className="appointment-details">
                <h2>Your Appointment Has Been Confirmed</h2>
                <p>Please save these appointment details for future reference:</p>
                <p>You have scheduled an appointment with {doctorsName}</p>
                <ul>
                    <li><strong>Appointment Date:</strong> {appointmentDate}</li>
                    <li><strong>Appointment Time:</strong> {appointmentTime}</li>
                    {/* <li><strong>Provider:</strong> {provider}</li> */}
                </ul>
                <div className="confirmation-footer">
                    <p>Confirmation email has been sent to you on {patientEmail}.</p>
                </div>
            </div>
        </div>
    );
};
export default AppointmentConfirmation;