import React, { useState } from "react";
import Header from "./components/Header/Header";
import LoginPage from "./components/LoginPage/LoginPage";
import Footer from "./components/Footer/Footer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegisterPage from "./components/Register/Register";
import DoctorDashboard from "./components/DoctorPage/DoctorDashboard";
import DoctorDetails from "./components/DoctorPage/DoctorDetails";
import AppointmentsCalendar from "./components/Appointment/AppointmentCalendar";
// import { useNavigation } from 'react-router-dom';

function App() {
  const [userId, setUserId] = useState(sessionStorage.getItem('userId'));
  const [navKey, setNavKey] = useState(0); // Add a state to hold a key
  // const navigation = useNavigation();
  const handleLogin = (id) => {
    sessionStorage.setItem('userId', id);
    setUserId(id);
    setNavKey(prevKey => prevKey + 1); // Update the key on login
  };

  const handleLogout = () => {
    sessionStorage.removeItem('userId');
    setUserId(null);
    setNavKey(prevKey => prevKey + 1); // Update the key on logout
    // navigation.navigate('/');
  };

  return (
    <Router>
      <Header key={navKey} userId={userId} onLogout={handleLogout} />
      <Routes>
        <Route exact path="/" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/appointmentCalendar" element={<AppointmentsCalendar />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        {/* <Route path="/doctor-details" element={<DoctorDetails />} /> */}
        <Route path="/doctor-details/:id" element={<DoctorDetails />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
