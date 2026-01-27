import React from "react";
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";
import profileImage from "../assets/image.png";

function UserProfile() {
  return (
    <>
      <UserHeader />

      {/* ===== Profile Banner Section ===== */}
      <div
        className="py-5 text-light text-center"
        style={{
            background: "linear-gradient(90deg, #0d6efd, #084298)",
        }}
        >
        <div className="container">
            <h2 className="fw-bold mb-2">My Profile</h2>
            <p className="mb-0 opacity-75">
            Manage your personal information and account details
            </p>
        </div>
        </div>

      {/* ===== Profile Content ===== */}
      <div className="container my-5">
        <div className="row g-4">

          {/* Left Profile Card */}
          <div className="col-md-4">
            <div className="card shadow-sm text-center p-4">
              <img
                src={profileImage}
                alt="User"
                className="rounded-circle mx-auto mb-3 border"
                style={{
                  width: "140px",
                  height: "140px",
                  objectFit: "cover",
                }}
              />

              <h4 className="fw-bold mb-0">Ahmad Shahzad</h4>
              <p className="text-muted">Registered User</p>

              <button className="btn btn-outline-primary btn-sm mt-2">
                <i className="bi bi-pencil-square me-1"></i> Edit Profile
              </button>
            </div>
          </div>

          {/* Right Details Card */}
          <div className="col-md-8">
            <div className="card shadow-sm p-4">
              <h5 className="fw-bold border-bottom pb-2 mb-4">
                Personal Information
              </h5>

              <div className="row mb-3">
                <div className="col-sm-6">
                  <p className="text-muted mb-1">Full Name</p>
                  <p className="fw-semibold">Ahmad Shahzad</p>
                </div>
                <div className="col-sm-6">
                  <p className="text-muted mb-1">Username</p>
                  <p className="fw-semibold">ahmad123</p>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-sm-6">
                  <p className="text-muted mb-1">Email</p>
                  <p className="fw-semibold">ahmad@email.com</p>
                </div>
                <div className="col-sm-6">
                  <p className="text-muted mb-1">Phone</p>
                  <p className="fw-semibold">+92 300 1234567</p>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-sm-12">
                  <p className="text-muted mb-1">Address</p>
                  <p className="fw-semibold">
                    Sialkot, Punjab, Pakistan
                  </p>
                </div>
              </div>

              <h5 className="fw-bold border-bottom pb-2 mt-4 mb-3">
                Account Details
              </h5>

              <div className="row">
                <div className="col-sm-6">
                  <p className="text-muted mb-1">Account Status</p>
                  <span className="badge bg-success">Active</span>
                </div>
                <div className="col-sm-6">
                  <p className="text-muted mb-1">Member Since</p>
                  <p className="fw-semibold">January 2025</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      <UserFooter />
    </>
  );
}

export default UserProfile;
