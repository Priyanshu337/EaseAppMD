import React, { useState } from "react";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
} from "mdb-react-ui-kit";
import backGroundImg from "../../assets/login.png";
import "./LoginPage.css";
import { Link,useNavigate } from "react-router-dom";

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();


  const handleValidation = () => {
    const errors = {};

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Invalid email address";
    }

    if (!password.trim()) {
      errors.password = "Password is required";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //navigate("/doctor-dashboard");
    if (handleValidation()) {
      console.log("Login successful!");

      fetch("https://localhost:7012/api/Users/Authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Check the response from the API
          if (data && data.userId) {
            // Successful login, redirect to DoctorDashboard page
            sessionStorage.setItem('userId', data.userId);
            onLogin(data.userId);
            navigate("/doctor-dashboard");
          } else {
            // Invalid credentials, handle the error (show a message, etc.)
            setErrorMessage("Invalid email or password. Please try again.");
          }
        })
        .catch((error) => {
          // Handle network or server errors
          setErrorMessage("An error occurred. Please try again later.");
        });
    } else {
      console.log("Login failed. Please check the errors.");
    }
  };

  return (
    <MDBContainer fluid className="container-with-padding">
      <MDBRow className="row-container">
        <MDBCol sm="6" className="d-none d-sm-block px-0">
          <img
            src={backGroundImg}
            alt="Login"
            className="w-100"
            style={{
              objectFit: "cover",
              objectPosition: "left",
              maxWidth: "100%", 
              maxHeight: "80vh", 
            }}
          />
        </MDBCol>

        <MDBCol sm="6">
          <form onSubmit={handleSubmit}>
            <div className="d-flex flex-column justify-content-center h-custom-2 w-75 pt-4">
              <h3
                className="fw-normal mb-3 ps-5 pb-3"
                style={{ letterSpacing: "1px" }}
              >
                Log in
              </h3>

              <MDBInput
                wrapperClass="mb-4 mx-5 w-100"
                label="Email address"
                id="email"
                type="email"
                size="lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                state={errors.email ? "invalid" : ""}
              />
              {errors.email && (
                <div className="text-danger ms-5 mb-3">{errors.email}</div>
              )}

              <MDBInput
                wrapperClass="mb-4 mx-5 w-100"
                label="Password"
                id="password"
                type="password"
                size="lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                state={errors.password ? "invalid" : ""}
              />
              {errors.password && (
                <div className="text-danger ms-5 mb-3">{errors.password}</div>
              )}

              <MDBBtn
                className="mb-4 px-5 mx-5 w-100"
                color="info"
                size="lg"
                type="submit"
              >
                Login
              </MDBBtn>
              {errorMessage && <div className="text-danger ms-5 mb-3">{errorMessage}</div>}
              <p className="small mb-5 pb-lg-3 ms-5">
                <a className="text-muted" href="#!">
                  Forgot password?
                </a>
              </p>
              <p className="ms-5">
                Don't have an account?{" "}
                <Link to="/register" className="link-info">
                  Register here
                </Link>
              </p>
            </div>
          </form>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default LoginPage;
