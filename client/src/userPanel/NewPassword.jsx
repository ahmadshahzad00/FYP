import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";

function NewPassword() {
  const { token } = useParams();

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return setMessage("Passwords do not match");
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        {
          token,
          password: form.password,
        }
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

      <div className="bg-primary text-light py-5 text-center">
        <h2>Set New Password</h2>
      </div>

      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card p-4 shadow">
              <h4 className="text-center mb-3">New Password</h4>

              {message && (
                <div className="alert alert-info text-center">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <input
                  type="password"
                  name="password"
                  className="form-control mb-3"
                  placeholder="New password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />

                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control mb-3"
                  placeholder="Confirm password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />

                <button className="btn btn-primary w-100" disabled={loading}>
                  {loading ? "Updating..." : "Update Password"}
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

export default NewPassword;