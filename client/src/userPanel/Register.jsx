import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";

function Register() {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[0-9])(?=.*[@$!%*#?&])[A-Za-z0-9@$!%*#?&]{8,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });

    let newErrors = { ...errors };

    if (name === "email") {
      if (!emailRegex.test(value)) {
        newErrors.email = "Invalid email format";
      } else {
        delete newErrors.email;
      }
    }

    if (name === "password") {
      if (!passwordRegex.test(value)) {
        newErrors.password =
          "Min 8 chars, 1 number & 1 special character required";
      } else {
        delete newErrors.password;
      }
    }

    if (name === "confirmPassword") {
      if (value !== form.password) {
        newErrors.confirmPassword = "Passwords do not match";
      } else {
        delete newErrors.confirmPassword;
      }
    }

    setErrors(newErrors);
  };

  const sendOtp = async (e) => {
    e.preventDefault();

    if (Object.keys(errors).length > 0) {
      alert("Please fix errors first");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/send-otp", form);
      setStep(2);
      alert("OTP sent to email");
    } catch (err) {
      alert(err.response?.data?.message || "Error sending OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        {
          ...form,
          otp,
        }
      );

      alert("Registration successful");

      setStep(1);
      setForm({
        name: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        confirmPassword: "",
      });
      setOtp("");
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <>
      <UserHeader />

      {/* HERO */}
      <div className="bg-primary text-white py-5 text-center shadow-sm">
        <div className="container">
          <h1 className="fw-bold display-6">Create Your Account</h1>
          <p className="mt-2 mb-0">
            Join and explore top-quality products
          </p>
        </div>
      </div>

      {/* FORM */}
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div
              className="card shadow p-4"
              style={{ borderRadius: "16px" }}
            >
              <h4 className="text-center mb-4 fw-semibold">
                {step === 1 ? "Register" : "OTP Verification"}
              </h4>

              {step === 1 && (
                <form onSubmit={sendOtp}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    className="form-control mb-3"
                    onChange={handleChange}
                    required
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="form-control mb-2"
                    onChange={handleChange}
                    required
                  />
                  {errors.email && (
                    <small className="text-danger">{errors.email}</small>
                  )}

                  {/* PHONE + ADDRESS SAME ROW */}
                  <div className="row mt-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        className="form-control"
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        className="form-control"
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* PASSWORD */}
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="form-control mt-3"
                    onChange={handleChange}
                    required
                  />
                  {errors.password && (
                    <small className="text-danger">{errors.password}</small>
                  )}

                  {/* CONFIRM PASSWORD */}
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className="form-control mt-3"
                    onChange={handleChange}
                    required
                  />
                  {errors.confirmPassword && (
                    <small className="text-danger">{errors.confirmPassword}</small>
                  )}

                  <button className="btn btn-primary w-100 mt-4">
                    Send OTP
                  </button>
                </form>
              )}

              {/* OTP STEP */}
              {step === 2 && (
                <div>
                  <p className="text-center mb-3">
                    Enter OTP sent to your email
                  </p>

                  <input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="form-control mb-3"
                  />

                  <button
                    className="btn btn-success w-100"
                    onClick={verifyOtp}
                  >
                    Verify & Register
                  </button>
                </div>
              )}

              <p className="text-center mt-3 mb-0">
                Already have account?{" "}
                <Link to="/user-login">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <UserFooter />
    </>
  );
}

export default Register;