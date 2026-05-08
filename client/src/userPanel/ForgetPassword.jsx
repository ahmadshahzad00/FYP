import React, { useState } from "react";
import axios from "axios";
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );

      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error occurred");
    }

    setLoading(false);
  };

  return (
    <>
      <UserHeader />

      <div className="bg-primary text-light py-5">
        <div className="container text-center">
          <h2 className="fw-bold">Forgot Password</h2>
          <p>Enter email to receive reset link</p>
        </div>
      </div>

      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card shadow p-4">
              <h4 className="text-center mb-3">Reset Password</h4>

              {message && (
                <div className="alert alert-info text-center">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <input
                  type="email"
                  className="form-control mb-3"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <button className="btn btn-primary w-100" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <UserFooter />
    </>
  );
}

export default ForgetPassword;