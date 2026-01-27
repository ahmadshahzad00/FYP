import React from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminSidebar() {
//   const navigate = useNavigate();

//   const user = JSON.parse(localStorage.getItem("user"));
//   if (!user) {
//     navigate("/login");
//     return null;
//   }

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

  return (
    <div
      className="bg-dark text-white p-3 d-flex flex-column justify-content-between"
      style={{ width: "250px", minHeight: "100vh" }}
    >
      <div>
        <h3 className="text-center mb-4">Admin Panel</h3>
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link to="/admin-dashboard" className="nav-link text-white">
              <i className="bi bi-speedometer2"></i> Dashboard
            </Link>
          </li>
        </ul>
      </div>
      <button className="btn btn-danger w-100 mb-4">
        Logout
      </button>
    </div>
  );
}

export default AdminSidebar;
