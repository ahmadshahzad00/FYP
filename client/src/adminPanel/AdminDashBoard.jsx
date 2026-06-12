import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import axios from "axios";

function AdminDashBoard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState({
    businesses: { total: 0, approved: 0, pending: 0, rejected: 0 },
    products: { total: 0 },
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
        // Fetch stats after successful authentication
        await fetchStats(token);
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

  const fetchStats = async (token) => {
    try {
      // Fetch all businesses
      const businessResponse = await axios.get(
        "http://localhost:5000/api/business/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const businesses = businessResponse.data;
      const totalBusinesses = businesses.length;
      const approvedBusinesses = businesses.filter(b => b.status === "approved").length;
      const pendingBusinesses = businesses.filter(b => b.status === "pending").length;
      const rejectedBusinesses = businesses.filter(b => b.status === "rejected").length;
      
      // Fetch all products
      const productResponse = await axios.get(
        "http://localhost:5000/api/product/products-with-business"
      );
      
      const totalProducts = productResponse.data.count || 0;
      
      setStats({
        businesses: {
          total: totalBusinesses,
          approved: approvedBusinesses,
          pending: pendingBusinesses,
          rejected: rejectedBusinesses,
        },
        products: {
          total: totalProducts,
        },
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      // Keep default values if fetch fails
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
          <div className="text-muted">
            <i className="bi bi-calendar3 me-1"></i>
            {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="row g-4">
          {/* Businesses Card */}
          <div className="col-md-6">
            <div className="card shadow border-0 h-100">
              <div className="card-header bg-white border-0 pt-4">
                <h5 className="fw-bold text-primary mb-0">
                  <i className="bi bi-building me-2"></i>Businesses Overview
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-6 mb-3">
                    <div className="p-3 bg-light rounded">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted">Total Businesses</span>
                        <i className="bi bi-building fs-4 text-primary"></i>
                      </div>
                      <h2 className="fw-bold mt-2 mb-0">{stats.businesses.total}</h2>
                    </div>
                  </div>
                  <div className="col-6 mb-3">
                    <div className="p-3 bg-light rounded">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted">Approved</span>
                        <i className="bi bi-check-circle fs-4 text-success"></i>
                      </div>
                      <h2 className="fw-bold mt-2 mb-0 text-success">{stats.businesses.approved}</h2>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 bg-light rounded">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted">Pending</span>
                        <i className="bi bi-clock-history fs-4 text-warning"></i>
                      </div>
                      <h2 className="fw-bold mt-2 mb-0 text-warning">{stats.businesses.pending}</h2>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 bg-light rounded">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted">Rejected</span>
                        <i className="bi bi-x-circle fs-4 text-danger"></i>
                      </div>
                      <h2 className="fw-bold mt-2 mb-0 text-danger">{stats.businesses.rejected}</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Card */}
          <div className="col-md-6">
            <div className="card shadow border-0 h-100">
              <div className="card-header bg-white border-0 pt-4">
                <h5 className="fw-bold text-success mb-0">
                  <i className="bi bi-box-seam me-2"></i>Products Overview
                </h5>
              </div>
              <div className="card-body d-flex flex-column justify-content-center">
                <div className="text-center">
                  <div className="p-4 bg-light rounded">
                    <i className="bi bi-box-seam fs-1 text-success"></i>
                    <h1 className="display-1 fw-bold text-success mt-3 mb-0">{stats.products.total}</h1>
                    <p className="text-muted mt-2 mb-0">Total Products Listed</p>
                    <hr className="my-3" />
                    <div className="d-flex justify-content-center gap-3">
                      <div className="text-center">
                        <small className="text-muted d-block">Active Products</small>
                        <strong className="fs-5">{stats.products.total}</strong>
                      </div>
                      <div className="text-center">
                        <small className="text-muted d-block">Categories</small>
                        <strong className="fs-5">-</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card shadow border-0">
              <div className="card-header bg-white border-0 pt-4">
                <h5 className="fw-bold mb-0">
                  <i className="bi bi-lightning-charge me-2 text-warning"></i>Quick Actions
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-4">
                    <Link to="/businessRequests" 
                      className="btn btn-outline-primary w-100 py-3"
                      // onClick={() => window.location.href = "/businessRequests"}
                    >
                      <i className="bi bi-building fs-4 d-block mb-2"></i>
                      Manage Business Requests
                    </Link>
                  </div>
                  <div className="col-md-4">
                    <Link to="/productList" 
                      className="btn btn-outline-success w-100 py-3"
                      // onClick={() => "/productList"}
                    >
                      <i className="bi bi-box-seam fs-4 d-block mb-2"></i>
                      View All Products
                    </Link>
                  </div>
                  <div className="col-md-4">
                    <Link to="/businessList" 
                      className="btn btn-outline-info w-100 py-3"
                      // onClick={() => window.location.href = "/admin-profile"}
                    >
                      <i className="bi bi-person fs-4 d-block mb-2"></i>
                      Admin Profile
                    </Link>
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