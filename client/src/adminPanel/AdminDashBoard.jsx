import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import axios from "axios";

function AdminDashBoard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState({
    businesses: { total: 25, approved: 18, pending: 7 },
    products: { total: 120 },
    messages: { read: 30, unread: 12 },
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("adminToken");
    const adminData = localStorage.getItem("adminData");
    
    console.log("=== Dashboard Auth Check ===");
    console.log("Token exists:", !!token);
    console.log("Admin data exists:", !!adminData);
    
    if (!token || !adminData) {
      console.log("No credentials found, redirecting to login");
      navigate("/admin-login");
      return;
    }

    try {
      console.log("Verifying token with backend...");
      const response = await axios.get(
        "http://localhost:5000/api/admin/verify-token",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log("Verification response:", response.data);
      
      if (response.data.valid) {
        setAdmin(response.data.admin);
        console.log("Authentication successful!");
      } else {
        console.log("Token invalid, clearing storage");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");
        navigate("/admin-login");
      }
    } catch (error) {
      console.error("Auth error:", error);
      console.error("Error response:", error.response?.data);
      
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");
      navigate("/admin-login");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "#f5f7fb" }}>
      <AdminSidebar />
      <div className="flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-primary">Admin Dashboard</h2>
            <p className="text-muted mb-0">
              Welcome back, {admin?.firstname} {admin?.lastname}!
            </p>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="card shadow border-0">
              <div className="card-body">
                <h5 className="fw-bold text-primary">
                  <i className="bi bi-building me-2"></i>Businesses
                </h5>
                <div className="mt-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Total</span>
                    <strong>{stats.businesses.total}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-success">Approved</span>
                    <strong className="text-success">{stats.businesses.approved}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-warning">Pending</span>
                    <strong className="text-warning">{stats.businesses.pending}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow border-0">
              <div className="card-body text-center">
                <h5 className="fw-bold text-success">
                  <i className="bi bi-box-seam me-2"></i>Products
                </h5>
                <p className="display-4 fw-bold text-success mt-2">{stats.products.total}</p>
                <small className="text-muted">Total Products Listed</small>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow border-0">
              <div className="card-body">
                <h5 className="fw-bold text-danger">
                  <i className="bi bi-envelope me-2"></i>Messages
                </h5>
                <div className="mt-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-success">Read</span>
                    <strong className="text-success">{stats.messages.read}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-danger">Unread</span>
                    <strong className="text-danger">{stats.messages.unread}</strong>
                  </div>
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