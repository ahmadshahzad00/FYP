import React, { useEffect, useState } from "react";
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserProfile() {
  const [user, setUser] = useState(null);
  const [preview, setPreview] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      navigate("/user-login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    setFormData({
      name: parsedUser.name,
      phone: parsedUser.phone,
      address: parsedUser.address,
      email: parsedUser.email,
    });
  }, [navigate]);

  /* IMAGE UPLOAD */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    const formDataImg = new FormData();
    formDataImg.append("image", file);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/upload-profile",
        formDataImg,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const updatedUser = { ...user, image: res.data.image };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch {
      alert("Upload failed");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        "http://localhost:5000/api/auth/edit-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setShowModal(false);
      alert("Profile updated");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  if (!user) return null;

  return (
    <>
      <UserHeader />

      {/* HEADER */}
      <div
        className="py-5 text-white text-center"
        style={{ background: "linear-gradient(90deg, #0d6efd, #084298)" }}
      >
        <div className="container">
          <h2 className="fw-bold">My Profile</h2>
          <p className="opacity-75">Manage your account information</p>
        </div>
      </div>

      <div className="container my-5">
        <div className="row g-4">

          {/* LEFT CARD */}
          <div className="col-md-4">
            <div className="card shadow-sm text-center p-4">

              <label style={{ cursor: "pointer" }}>
                <img
                  src={
                    preview ||
                    (user.image
                      ? `http://localhost:5000/uploads/userProfile/${user.image}`
                      : "https://cdn-icons-png.flaticon.com/512/149/149071.png")
                  }
                  className="rounded-circle border mb-3"
                  style={{ width: 140, height: 140, objectFit: "cover" }}
                  alt=""
                />
                <input type="file" hidden onChange={handleImageUpload} />
              </label>

              <h5 className="fw-bold">{user.name}</h5>

              <p className="text-muted">
                Member since{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </p>

              {/* EDIT BUTTON AT BOTTOM */}
              <button
                className="btn btn-outline-primary btn-sm mt-2"
                onClick={() => setShowModal(true)}
              >
                Edit Profile
              </button>
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
                  <p className="text-muted">Full Name</p>
                  <p>{user.name}</p>
                </div>

                <div className="col-md-6">
                  <p className="text-muted">Email</p>
                  <p>{user.email}</p>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <p className="text-muted">Phone</p>
                  <p>{user.phone}</p>
                </div>

                <div className="col-md-6">
                  <p className="text-muted">Address</p>
                  <p>{user.address}</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 shadow">

              <div className="modal-header border-0">
                <h5 className="fw-bold">Edit Profile</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">

                <input
                  className="form-control mb-3"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                />

                <input
                  className="form-control mb-3"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                />

                <input
                  className="form-control mb-3"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                />

                <input
                  className="form-control"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Address"
                />

              </div>

              <div className="modal-footer border-0">
                <button
                  className="btn btn-light"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button className="btn btn-primary px-4" onClick={handleUpdate}>
                  Save Changes
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      <UserFooter />
    </>
  );
}

export default UserProfile;