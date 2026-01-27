import React, { useState } from "react";
import { Link } from "react-router-dom";
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log(form);
    // connect backend / API here
  };

  return (
    <>
      <UserHeader />

      {/* Hero Section */}
      <div className="bg-primary text-light py-5">
        <div className="container text-center">
          <div className="mb-3">
            <i className="bi bi-person-check-fill fs-1"></i>
          </div>
          <h2 className="fw-bold mb-2">Create Account</h2>
          <p className="opacity-75 fs-6 mb-4">
            Join Sialkot Export Mella and grow your business globally
          </p>
          <div className="d-flex justify-content-center">
            <span
              className="bg-light"
              style={{ width: "60px", height: "3px" }}
            ></span>
          </div>
        </div>
      </div>



      {/* Register Form */}
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-4">
                <h4 className="text-center fw-bold mb-4">
                  User Registration
                </h4>

                <form onSubmit={handleSubmit}>
                  {/* Full Name */}
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-person"></i>
                      </span>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Enter your full name"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

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
                        placeholder="Create password"
                        value={form.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-3">
                    <label className="form-label">Confirm Password</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-shield-lock"></i>
                      </span>
                      <input
                        type="password"
                        name="confirmPassword"
                        className="form-control"
                        placeholder="Re-enter password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <button className="btn btn-primary w-100 py-2 fw-semibold">
                    Create Account
                  </button>
                </form>

                {/* Login Link */}
                <p className="text-center mt-4 mb-0">
                  Already have an account?{" "}
                  <Link
                    to="/user-login"
                    className="text-decoration-none fw-semibold"
                  >
                    Login
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

export default Register;
