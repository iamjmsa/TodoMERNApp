import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});

  const handleSubmitLogin = (event) => {
    event.preventDefault();
    setError({});

    axios
      .post(
        "http://localhost:3000/login",
        { email, password },
        { withCredentials: true }
      )
      .then((response) => {
        navigate(response.data.redirect);
        console.log(response.data);
      })
      .catch((error) => {
        if (!error.response.data.success) {
          const loginErrors = {};
          error.response.data.message.forEach((err) => {
            loginErrors[err.path] = err.msg;
          });
          setError(loginErrors);
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
          <h3 className="fw-bold text-dark">Welcome Back!</h3>
          <p
            className={`small ${error.invalid ? "text-danger" : "text-muted"}`}
          >
            {error.invalid ? error.invalid : "Please login to your account."}
          </p>
        </div>

        <form method="post" onSubmit={handleSubmitLogin}>
          {/* Email Field */}
          <div className="mb-3">
            <label className="form-label fw-bold">Email</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-envelope text-muted"></i>
              </span>
              <input
                type="email"
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

          {/* Password Field */}
          <div className="mb-3">
            <label className="form-label fw-bold">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-lock text-muted"></i>
              </span>
              <input
                type="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                className={`form-control ${error.password ? "is-invalid" : ""}`}
                placeholder="Enter your password"
              />
            </div>
            {error.password && (
              <small className="text-danger">{error.password}</small>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-100 py-2 fw-bold mb-3"
            style={{ backgroundColor: "#2b58cc" }}
          >
            Login
          </button>

          {/* Toggle Link */}
          <div className="text-center mt-0 small text-muted">
            Don't have an account?{" "}
            <a href="/register" className="btn-link fw-bold">
              Register
            </a>
            {/* {isLogin ? (
              <>
                Don't have an account?{" "}
                <span
                  className="text-primary fw-bold cursor-pointer"
                  style={{ cursor: "pointer" }}
                  onClick={() => setIsLogin(false)}
                >
                  Sign Up
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span
                  className="text-primary fw-bold cursor-pointer"
                  style={{ cursor: "pointer" }}
                  onClick={() => setIsLogin(true)}
                >
                  Login
                </span>
              </>
            )} */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
