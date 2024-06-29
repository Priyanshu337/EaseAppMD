import React from 'react';
import { Link } from 'react-router-dom';
import './DoctorCard.css'; 

const DoctorCard = ({ doctor }) => {
  return (
    <div className="card">
      <div className="card-body">
        <div className="doctor-info">
          <div className="doctor-image">
            <img src={doctor.image_url} alt="Doctor" className="doctor-avatar" />
            <p className="fee-text">Total Fee: ${doctor.fee}</p>
          </div>
          <div className="doctor-details">
          <h5 style={{ fontWeight: 'bold', fontSize: '2rem' }}>{doctor.name}</h5>
           
            <a href="/#" className="details-link">See Details</a>
            <Link to={`/doctor-details/${doctor.id}`} className="btn btn-success" style={{ fontWeight: 'bold', fontSize: '14px' }}>
               Book an Appointment
          </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
