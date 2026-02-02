import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setRegisterError] = useState({});

  const handleSubmitRegister = (event) => {
    event.preventDefault();
    setRegisterError({});

    axios
      .post(
        "http://localhost:3000/register",
        { fullname, email, password, confirmPassword },
        { withCredentials: true }
      )
      .then((response) => {
        navigate(response.data.redirect);
      })
      .catch((error) => {
        if (!error.response.data.success) {
          const registerErrors = {};
          error.response.data.message.forEach((err) => {
            registerErrors[err.path] = err.msg;
          });
          setRegisterError(registerErrors);
        }
      });
  };

  return (
    <div
      className="container-fluid vh-100 d-flex align-items-center justify-content-center"
      style={{ background: "linear-gradient(180deg, #2b58cc 0%, #f0f2f5 30%)" }}
    >
      <div
        className="card shadow border-0 p-4"
        style={{ maxWidth: "500px", width: "100%", borderRadius: "8px" }}
      >
        {/* Logo & Header */}
        <div className="text-center mb-4">
          <div className="d-flex align-items-center justify-content-center text-primary fw-bold h5 mb-3">
            <i className="bi bi-layers-fill me-2"></i> ToDo MERN App
          </div>
          <h3 className="fw-bold text-dark">Create an Account</h3>
          <p className="text-muted small">
            Sign up to manage your tasks efficiently.
          </p>
        </div>

        <form method="post" onSubmit={handleSubmitRegister}>
          <div className="mb-3">
            <label className="form-label fw-bold">Full Name</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-person text-muted"></i>
              </span>
              <input
                type="text"
                name="fullname"
                onChange={(e) => setFullname(e.target.value)}
                className={`form-control ${error.fullname ? "is-invalid" : ""}`}
                placeholder="Enter your full name"
              />
            </div>
            {error.fullname && (
              <small className="text-danger">{error.fullname}</small>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">E-mail Address</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-envelope text-muted"></i>
              </span>
              <input
                type="text"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                className={`form-control ${error.email ? "is-invalid" : ""}`}
                placeholder="Enter your email"
              />
            </div>
            {error.email && (
              <small className="text-danger">{error.email}</small>
            )}
          </div>

          <div className="row">
            <div className="mb-3 col">
              <label className="form-label fw-bold">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-lock text-muted"></i>
                </span>
                <input
                  type="password"
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  className={`form-control ${
                    error.password ? "is-invalid" : ""
                  }`}
                  placeholder="Enter your password"
                />
              </div>
              {error.password && (
                <small className="text-danger">{error.password}</small>
              )}
            </div>
            <div className="mb-3 col">
              <label className="form-label fw-bold">Confirm Password</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-lock text-muted"></i>
                </span>
                <input
                  type="password"
                  name="confirm_password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`form-control ${
                    error.confirmPassword ? "is-invalid" : ""
                  }`}
                  placeholder="Confirm your password"
                />
              </div>
              {error.confirmPassword && (
                <small className="text-danger">{error.confirmPassword}</small>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            className="btn btn-primary w-100 py-2 fw-bold mb-0"
            style={{ backgroundColor: "#2b58cc" }}
          >
            Register
          </button>

          {/* Toggle Link */}
          <div className="text-center mt-3 small text-muted">
            Already have an account?{" "}
            <a href="/" className="text-primary fw-bold">
              Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
