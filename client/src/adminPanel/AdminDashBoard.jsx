import React from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import myImage from "../assets/image.png";

function AdminDashBoard() {
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <AdminSidebar/>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-primary">Dashboard</h2>
          <div>
            <span className="me-3 fw-bold">
              {/* {user.firstname} {user.lastname} */}
              Ahmad Shahazad
            </span>
            <img
              src={myImage}
              alt="profile"
              className="rounded-circle"
              style={{ width: "60px", height: "60px", objectFit: "cover" }}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-4">
            <div className="card text-center shadow-sm p-4">
              <h5>Total account create on our plateform</h5>
              <p className="display-6 text-primary">12</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center shadow-sm p-4">
              <h5>Tasks Completed</h5>
              <p className="display-6 text-success">45</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center shadow-sm p-4">
              <h5>Notifications</h5>
              <p className="display-6 text-warning">3</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashBoard;
