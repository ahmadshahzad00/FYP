import React, { useState } from "react";
import { Link } from "react-router-dom";

function AdminForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Forgot Password Email:", email);
    // Call your forgot password API here
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "400px" }}>
        <h3 className="text-center mb-4 text-primary">Forgot Password</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your correct Email.."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Verify
          </button>

          <p className="d-flex justify-content-center mt-3">
            Back to <Link to="/admin-login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default AdminForgotPassword;
