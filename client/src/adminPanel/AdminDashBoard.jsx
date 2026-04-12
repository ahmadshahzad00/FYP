import React from "react";
import AdminSidebar from "./AdminSidebar";
import myImage from "../assets/image.png";

function AdminDashBoard() {

  // Dummy data (later replace with API)
  const stats = {
    businesses: {
      total: 25,
      approved: 18,
      pending: 7,
    },
    products: {
      total: 120,
    },
    messages: {
      read: 30,
      unread: 12,
    },
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "#f5f7fb" }}>
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-grow-1 p-4">

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-primary">Admin Dashboard</h2>

          <div className="d-flex align-items-center">
            <span className="me-3 fw-semibold">Ahmad Shahzad</span>
            <img
              src={myImage}
              alt="profile"
              className="rounded-circle border"
              style={{ width: "50px", height: "50px", objectFit: "cover" }}
            />
          </div>
        </div>

        {/* CARDS */}
        <div className="row g-4">

          {/* BUSINESS CARD */}
          <div className="col-md-4">
            <div className="card shadow border-0 h-100">
              <div className="card-body">
                <h5 className="fw-bold mb-3 text-primary">
                  <i className="bi bi-building me-2"></i>Businesses
                </h5>

                <div className="d-flex justify-content-between mb-2">
                  <span>Total</span>
                  <span className="fw-bold">{stats.businesses.total}</span>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-success">Approved</span>
                  <span className="fw-bold text-success">
                    {stats.businesses.approved}
                  </span>
                </div>

                <div className="d-flex justify-content-between">
                  <span className="text-warning">Pending</span>
                  <span className="fw-bold text-warning">
                    {stats.businesses.pending}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* PRODUCTS CARD */}
          <div className="col-md-4">
            <div className="card shadow border-0 h-100">
              <div className="card-body text-center">
                <h5 className="fw-bold mb-3 text-success">
                  <i className="bi bi-box-seam me-2"></i>Products
                </h5>

                <p className="display-5 fw-bold text-success">
                  {stats.products.total}
                </p>

                <small className="text-muted">Total Products Listed</small>
              </div>
            </div>
          </div>

          {/* CONTACT MESSAGES CARD */}
          <div className="col-md-4">
            <div className="card shadow border-0 h-100">
              <div className="card-body">
                <h5 className="fw-bold mb-3 text-danger">
                  <i className="bi bi-envelope me-2"></i>Contact Messages
                </h5>

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-success">Read</span>
                  <span className="fw-bold text-success">
                    {stats.messages.read}
                  </span>
                </div>

                <div className="d-flex justify-content-between">
                  <span className="text-danger">Unread</span>
                  <span className="fw-bold text-danger">
                    {stats.messages.unread}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default AdminDashBoard;