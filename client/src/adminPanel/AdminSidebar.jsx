import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminSidebar() {
  const navigate = useNavigate();

  const adminToken = localStorage.getItem("adminToken");
  const adminData = localStorage.getItem("adminData");

  // Check authentication on component mount
  useEffect(() => {
    if (!adminToken || !adminData) {
      navigate("/admin-login");
    }
  }, [adminToken, adminData, navigate]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");
      navigate("/admin-login");
    }
  };

  // If not authenticated, return null (will redirect via useEffect)
  if (!adminToken || !adminData) {
    return null;
  }

  // Parse admin data
  let admin = null;
  try {
    admin = JSON.parse(adminData);
  } catch (e) {
    console.error("Error parsing admin data:", e);
    localStorage.removeItem("adminData");
    navigate("/admin-login");
    return null;
  }

  return (
    <div
      className="bg-dark text-white p-3 d-flex flex-column justify-content-between"
      style={{ width: "250px", minHeight: "100vh" }}
    >
      <div>
        <h3 className="text-center mb-4">Admin Panel</h3>
        
        {admin && (
          <div className="text-center mb-3 pb-3 border-bottom border-secondary">
            <i className="bi bi-person-circle fs-1"></i>
            <p className="mt-2 mb-0">
              {admin.firstname} {admin.lastname}
            </p>
            <small className="text-muted">{admin.role}</small>
          </div>
        )}
        
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link to="/admin-dashboard" className="nav-link text-white">
              <i className="bi bi-speedometer2 me-2"></i> Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/productList" className="nav-link text-white">
              <i className="bi bi-box-seam me-2"></i> Products List
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/businessRequests" className="nav-link text-white">
              <i className="bi bi-envelope-paper me-2"></i> Business Requests
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/contactMessages" className="nav-link text-white">
              <i className="bi bi-chat-dots me-2"></i> Contact Messages
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/team-members-list" className="nav-link text-white">
              <i className="bi bi-people me-2"></i> Team
            </Link>
          </li>
        </ul>
      </div>
      
      <button className="btn btn-danger w-100 mb-4" onClick={handleLogout}>
        <i className="bi bi-box-arrow-right me-2"></i>
        Logout
      </button>
    </div>
  );
}

export default AdminSidebar;