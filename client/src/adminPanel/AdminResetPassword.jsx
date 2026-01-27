import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";

function AdminResetPassword() {
  const { token } = useParams(); // token from email link
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Confirm Password do not match");
      return;
    }

    // Call reset password API here
    // POST /api/admin/reset-password/:token
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "400px" }}>
        <h3 className="text-center mb-4 text-primary">Reset Password</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>New Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label>Confirm Password</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Update Password
          </button>

          <p className="d-flex justify-content-center mt-3">
            Back to <Link to="/admin-login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default AdminResetPassword;
