import React, { useState } from "react";
import { Link } from "react-router-dom";

function AdminSignin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Data:", { email, password });
    // Call your API here
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "400px" }}>
        <h3 className="text-center mb-4 text-primary">Admin Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email Address</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
          <p className="d-flex justify-content-center mt-2">
            Don’t have an account? <Link to="/admin-registration">Register</Link>
          </p>
          <p className="d-flex justify-content-center mt-2">
            <Link to="/admin-forgot-password">Forgot Password</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default AdminSignin;