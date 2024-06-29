import React, { useState } from "react";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
} from "mdb-react-ui-kit";
import backGroundImg from "../../assets/login.png";
import { Link ,useNavigate} from "react-router-dom";
//import "./RegisterPage.css";

function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleValidation = () => {
    const errors = {};

    if (!fullName.trim()) {
      errors.fullName = "Full name is required";
    }

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Invalid email address";
    }

    if (!password.trim()) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (handleValidation()) {
      fetch("https://localhost:7012/api/Users/AddUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          username: fullName,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log({ data });
          if (data === 1) {
            // Registration successful logic
            navigate("/login");
          } else {
            // Registration failed logic
            setErrorMessage("Registration failed. Please try again."); // Set error message
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          setErrorMessage("Registration failed due to a network error."); // Set network error message
        });
    } else {
      setErrorMessage("");
    }
  };

  return (
    <MDBContainer fluid className="container-with-padding">
      <MDBRow>
        <MDBCol sm="6" className="d-none d-sm-block px-0">
          <img
            src={backGroundImg}
            alt="Register"
            className="w-100"
            style={{
              objectFit: "cover",
              objectPosition: "left",
              maxWidth: "100%", // Set maximum width of the image
              maxHeight: "80vh", // Set maximum height of the image (adjust as needed)
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
                Register
              </h3>

              <MDBInput
                wrapperClass="mb-4 mx-5 w-100"
                label="Full Name"
                id="fullName"
                type="text"
                size="lg"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                state={errors.fullName ? "invalid" : ""}
              />
              {errors.fullName && (
                <div className="text-danger ms-5 mb-3">{errors.fullName}</div>
              )}

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

              <MDBInput
                wrapperClass="mb-4 mx-5 w-100"
                label="Confirm Password"
                id="confirmPassword"
                type="password"
                size="lg"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                state={errors.confirmPassword ? "invalid" : ""}
              />
              {errors.confirmPassword && (
                <div className="text-danger ms-5 mb-3">
                  {errors.confirmPassword}
                </div>
              )}

              {!passwordMatch && (
                <div className="text-danger ms-5 mb-3">Passwords do not match</div>
              )}

              <MDBBtn
                className="mb-4 px-5 mx-5 w-100"
                color="info"
                size="lg"
                disabled={!passwordMatch}
                type="submit"
              >
                Register
              </MDBBtn>
              {errorMessage && <div className="text-danger ms-5 mb-3">{errorMessage}</div>}
              <p className="ms-5">
                Already have an account?{" "}
                <Link href="/login" className="link-info">
                  Login here
                </Link>
              </p>
            </div>
          </form>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default RegisterPage;
