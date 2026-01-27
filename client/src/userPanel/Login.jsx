import React, { useState } from "react";
import { Link } from "react-router-dom";
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    // connect backend here
  };

  return (
    <>
      <UserHeader />

      {/* Hero Section */}
      <div className="bg-primary text-light py-5">
        <div className="container text-center">
          <h2 className="fw-bold mb-3">Welcome Back</h2>
          <p className="opacity-75 fs-5 mb-4">
            Login to continue to your account
          </p>
          <div className="d-flex justify-content-center">
            <span
              className="bg-light"
              style={{ width: "60px", height: "3px" }}
            ></span>
          </div>
        </div>
      </div>


      {/* Login Form */}
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-4">
                <h4 className="text-center fw-bold mb-4">
                  User Login
                </h4>

                <form onSubmit={handleSubmit}>
                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-envelope"></i>
                      </span>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="Enter your email"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-lock"></i>
                      </span>
                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        placeholder="Enter your password"
                        value={form.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Options */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="rememberMe"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="rememberMe"
                      >
                        Remember me
                      </label>
                    </div>

                    <Link to="/forgot-password" className="small text-decoration-none">
                      Forgot Password?
                    </Link>
                  </div>

                  {/* Button */}
                  <button className="btn btn-primary w-100 py-2 fw-semibold">
                    Login
                  </button>
                </form>

                {/* Register */}
                <p className="text-center mt-4 mb-0">
                  Don’t have an account?{" "}
                  <Link to="/user-register" className="text-decoration-none fw-semibold">
                    Register
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <UserFooter />
    </>
  );
}

export default Login;
