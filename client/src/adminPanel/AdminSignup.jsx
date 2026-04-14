import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function AdminSignup() {
  const navigate = useNavigate();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("business_handler"); 
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/admin-register",
        {
          firstname,
          lastname,
          phone,
          email,
          password,
          role 
        }
      );

      setMessage(res.data.message);

      // Clear form
      setFirstname("");
      setLastname("");
      setPhone("");
      setEmail("");
      setPassword("");
      setRole("business_handler");

      setTimeout(() => {
        navigate("/admin-login");
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "400px" }}>
        <h3 className="text-center mb-4 text-primary">Admin Registration</h3>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label>First Name</label>
            <input
              type="text"
              className="form-control"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label>Last Name</label>
            <input
              type="text"
              className="form-control"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label>Phone</label>
            <input
              type="tel"
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

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

          <div className="mb-3">
            <label>Select Role</label>
            <select
              className="form-control"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="super_admin">Super Admin</option>
              <option value="business_handler">Business Handler</option>
              <option value="product_manager">Product Manager</option>
              <option value="inquiry_manager">Inquiry Manager</option>
              <option value="contact_messages_handler">Contact Messages Handler</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>

          <p className="text-center mt-2">
            Already have an account? <Link to="/admin-login">Login</Link>
          </p>

        </form>
      </div>
    </div>
  );
}

export default AdminSignup;