import React, { useEffect, useState } from "react";
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserProfile() {
  const [user, setUser] = useState(null);
  const [preview, setPreview] = useState(null);

  const navigate = useNavigate();

  /* ================= LOAD USER ================= */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      navigate("/user-login");
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [navigate]);

  /* ================= IMAGE UPLOAD ================= */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/upload-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // update localStorage user
      const updatedUser = {
        ...user,
        image: res.data.image,
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("Profile image updated successfully");
    } catch (err) {
      alert("Image upload failed");
    }
  };

  if (!user) return null;

  return (
    <>
      <UserHeader />

      {/* ===== HEADER ===== */}
      <div
        className="py-5 text-white text-center"
        style={{
          background: "linear-gradient(90deg, #0d6efd, #084298)",
        }}
      >
        <div className="container">
          <h2 className="fw-bold">My Profile</h2>
          <p className="mb-0 opacity-75">
            Manage your account information
          </p>
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="container my-5">
        <div className="row g-4">

          {/* LEFT CARD */}
          <div className="col-md-4">
            <div className="card shadow-sm text-center p-4">

              {/* PROFILE IMAGE */}
              <label style={{ cursor: "pointer" }}>
                <img
                  src={
                    preview ||
                    (user.image
                      ? `http://localhost:5000/uploads/userProfile/${user.image}`
                      : "https://cdn-icons-png.flaticon.com/512/149/149071.png")
                  }
                  alt="Profile"
                  className="rounded-circle border mb-3"
                  style={{
                    width: "140px",
                    height: "140px",
                    objectFit: "cover",
                  }}
                />

                <input
                  type="file"
                  hidden
                  onChange={handleImageUpload}
                />
              </label>

              <h5 className="fw-bold">{user.name}</h5>

              <p className="text-muted mb-0">
                Member since{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* RIGHT CARD */}
          <div className="col-md-8">
            <div className="card shadow-sm p-4">

              <h5 className="fw-bold border-bottom pb-2 mb-4">
                Personal Information
              </h5>

              <div className="row mb-3">
                <div className="col-md-6">
                  <p className="text-muted mb-1">Full Name</p>
                  <p className="fw-semibold">{user.name}</p>
                </div>

                <div className="col-md-6">
                  <p className="text-muted mb-1">Email</p>
                  <p className="fw-semibold">{user.email}</p>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <p className="text-muted mb-1">Phone</p>
                  <p className="fw-semibold">{user.phone}</p>
                </div>

                <div className="col-md-6">
                  <p className="text-muted mb-1">Address</p>
                  <p className="fw-semibold">{user.address}</p>
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