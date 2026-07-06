import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";

const ListTeamMember = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Add Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    designation: "",
    description: "",
  });
  const [addImage, setAddImage] = useState(null);
  const [addImagePreview, setAddImagePreview] = useState(null);
  const [addLoading, setAddLoading] = useState(false);

  // Edit Modal States
  const [editMember, setEditMember] = useState(null);
  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  // Fetch team members
  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/team");
      if (response.data.success) {
        setMembers(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching members:", err);
      setError("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // ADD FUNCTIONS
  // ============================================
  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddForm({ ...addForm, [name]: value });
  };

  const handleAddImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAddImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAddImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openAddModal = () => {
    setAddForm({
      name: "",
      designation: "",
      description: "",
    });
    setAddImage(null);
    setAddImagePreview(null);
    setAddLoading(false);
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setAddForm({
      name: "",
      designation: "",
      description: "",
    });
    setAddImage(null);
    setAddImagePreview(null);
    setAddLoading(false);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAddLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      const data = new FormData();
      data.append("name", addForm.name);
      data.append("designation", addForm.designation);
      data.append("description", addForm.description);
      if (addImage) {
        data.append("image", addImage);
      }

      const response = await axios.post(
        "http://localhost:5000/api/team",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setMembers([response.data.data, ...members]);
        closeAddModal();
        alert("Team member added successfully!");
      }
    } catch (err) {
      console.error("Error adding team member:", err);
      alert(err.response?.data?.message || "Failed to add team member");
    } finally {
      setAddLoading(false);
    }
  };

  // ============================================
  // DELETE FUNCTIONS
  // ============================================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this team member?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`http://localhost:5000/api/team/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers(members.filter((m) => m._id !== id));
      alert("Team member deleted successfully!");
    } catch (err) {
      console.error("Error deleting member:", err);
      alert("Failed to delete team member");
    }
  };

  // ============================================
  // EDIT FUNCTIONS
  // ============================================
  const openEditModal = (member) => {
    setEditMember({
      ...member,
      _id: member._id,
    });
    setEditImage(null);
    setEditImagePreview(null);
    setEditLoading(false);
  };

  const closeEditModal = () => {
    setEditMember(null);
    setEditImage(null);
    setEditImagePreview(null);
    setEditLoading(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditMember({ ...editMember, [name]: value });
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      const data = new FormData();
      data.append("name", editMember.name);
      data.append("designation", editMember.designation);
      data.append("description", editMember.description);
      data.append("isActive", editMember.isActive !== undefined ? editMember.isActive : true);
      if (editImage) {
        data.append("image", editImage);
      }

      const response = await axios.put(
        `http://localhost:5000/api/team/${editMember._id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setMembers(
          members.map((m) =>
            m._id === editMember._id ? response.data.data : m
          )
        );
        closeEditModal();
        alert("Team member updated successfully!");
      }
    } catch (err) {
      console.error("Error updating member:", err);
      alert(err.response?.data?.message || "Failed to update team member");
    } finally {
      setEditLoading(false);
    }
  };

  // ============================================
  // HELPER FUNCTIONS
  // ============================================
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/100";
    return `http://localhost:5000/${imagePath}`;
  };

  if (loading) {
    return (
      <div className="d-flex">
        <AdminSidebar />
        <div className="container-fluid p-4 text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading team members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <AdminSidebar />

      <div className="container-fluid p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <h3 className="fw-bold mb-0">Team Members</h3>
            <p className="text-muted mb-0">{members.length} team members</p>
          </div>

          <button
            className="btn btn-primary px-4 shadow-sm"
            onClick={openAddModal}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Add Team Member
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-danger">
            <i className="bi bi-exclamation-circle me-2"></i>
            {error}
          </div>
        )}

        {/* List */}
        <div className="row">
          {members.length === 0 ? (
            <div className="col-12 text-center py-5">
              <i className="bi bi-people fs-1 text-muted"></i>
              <p className="text-muted mt-2">No team members found.</p>
              <button className="btn btn-primary" onClick={openAddModal}>
                <i className="bi bi-plus-circle me-2"></i>
                Add Your First Team Member
              </button>
            </div>
          ) : (
            members.map((member) => (
              <div className="col-lg-4 col-md-6 mb-4" key={member._id}>
                <div className="card border-0 shadow-sm h-100 text-center p-4 rounded-4">
                  <img
                    src={getImageUrl(member.image)}
                    alt={member.name}
                    className="rounded-circle mx-auto mb-3 shadow-sm"
                    style={{
                      width: "110px",
                      height: "110px",
                      objectFit: "cover",
                      border: "3px solid #f1f1f1",
                    }}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/100";
                    }}
                  />

                  <h5 className="fw-semibold mb-1">{member.name}</h5>
                  <p className="text-primary mb-2 fw-medium">
                    {member.designation}
                  </p>
                  <p className="text-muted small px-2">{member.description}</p>

                  {!member.isActive && (
                    <span className="badge bg-secondary mb-2">Inactive</span>
                  )}

                  <div className="d-flex justify-content-center gap-2 mt-3">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => openEditModal(member)}
                    >
                      <i className="bi bi-pencil me-1"></i>
                      Edit
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(member._id)}
                    >
                      <i className="bi bi-trash me-1"></i>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ============================================
          ADD MODAL
      ============================================ */}
      {showAddModal && (
        <div
          className="modal fade show d-block"
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 9999,
            overflow: "auto",
          }}
          onClick={closeAddModal}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            style={{ pointerEvents: "none" }}
          >
            <div
              className="modal-content rounded-4 shadow"
              style={{ pointerEvents: "auto" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-person-plus me-2 text-primary"></i>
                  Add Team Member
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeAddModal}
                ></button>
              </div>

              <div className="modal-body">
                <form onSubmit={handleAddSubmit}>
                  <div className="row g-3">
                    {/* Image */}
                    <div className="col-md-4">
                      <label className="form-label fw-bold">Profile Image</label>
                      <div
                        className="border rounded-3 p-3 text-center"
                        style={{ minHeight: "150px", cursor: "pointer" }}
                        onClick={() => document.getElementById("addImageInput").click()}
                      >
                        {addImagePreview ? (
                          <img
                            src={addImagePreview}
                            alt="Preview"
                            style={{
                              maxWidth: "100%",
                              maxHeight: "130px",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />
                        ) : (
                          <div className="py-3">
                            <i className="bi bi-image fs-2 text-muted"></i>
                            <p className="text-muted small mb-0">Click to upload</p>
                          </div>
                        )}
                        <input
                          type="file"
                          id="addImageInput"
                          className="d-none"
                          accept="image/*"
                          onChange={handleAddImageChange}
                        />
                      </div>
                      <small className="text-muted">JPG, PNG, GIF up to 5MB</small>
                      {addImage && (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger mt-2 w-100"
                          onClick={() => {
                            setAddImage(null);
                            setAddImagePreview(null);
                          }}
                        >
                          <i className="bi bi-x-circle me-1"></i>
                          Remove Image
                        </button>
                      )}
                    </div>

                    {/* Fields */}
                    <div className="col-md-8">
                      <div className="mb-3">
                        <label className="form-label fw-bold">Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={addForm.name}
                          onChange={handleAddChange}
                          required
                          placeholder="Enter full name"
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-bold">Designation *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="designation"
                          value={addForm.designation}
                          onChange={handleAddChange}
                          required
                          placeholder="e.g., CEO, Marketing Manager"
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-bold">Description *</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          name="description"
                          value={addForm.description}
                          onChange={handleAddChange}
                          required
                          placeholder="Describe the team member's role"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer border-0 mt-3">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={closeAddModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={addLoading}
                    >
                      {addLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Adding...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-plus-circle me-2"></i>
                          Add Member
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          EDIT MODAL
      ============================================ */}
      {editMember && (
        <div
          className="modal fade show d-block"
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 9999,
            overflow: "auto",
          }}
          onClick={closeEditModal}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            style={{ pointerEvents: "none" }}
          >
            <div
              className="modal-content rounded-4 shadow"
              style={{ pointerEvents: "auto" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-pencil-square me-2 text-primary"></i>
                  Edit Team Member
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeEditModal}
                ></button>
              </div>

              <div className="modal-body">
                <form onSubmit={handleEditSubmit}>
                  <div className="row g-3">
                    {/* Image */}
                    <div className="col-md-4">
                      <label className="form-label fw-bold">Profile Image</label>
                      <div
                        className="border rounded-3 p-3 text-center"
                        style={{ minHeight: "150px", cursor: "pointer" }}
                        onClick={() => document.getElementById("editImageInput").click()}
                      >
                        {editImagePreview ? (
                          <img
                            src={editImagePreview}
                            alt="Preview"
                            style={{
                              maxWidth: "100%",
                              maxHeight: "130px",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />
                        ) : editMember.image ? (
                          <img
                            src={getImageUrl(editMember.image)}
                            alt={editMember.name}
                            style={{
                              maxWidth: "100%",
                              maxHeight: "130px",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />
                        ) : (
                          <div className="py-3">
                            <i className="bi bi-image fs-2 text-muted"></i>
                            <p className="text-muted small mb-0">Click to upload</p>
                          </div>
                        )}
                        <input
                          type="file"
                          id="editImageInput"
                          className="d-none"
                          accept="image/*"
                          onChange={handleEditImageChange}
                        />
                      </div>
                      <small className="text-muted">JPG, PNG, GIF up to 5MB</small>
                      {editImage && (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger mt-2 w-100"
                          onClick={() => {
                            setEditImage(null);
                            setEditImagePreview(null);
                          }}
                        >
                          <i className="bi bi-x-circle me-1"></i>
                          Remove New Image
                        </button>
                      )}
                    </div>

                    {/* Fields */}
                    <div className="col-md-8">
                      <div className="mb-3">
                        <label className="form-label fw-bold">Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={editMember.name || ""}
                          onChange={handleEditChange}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-bold">Designation *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="designation"
                          value={editMember.designation || ""}
                          onChange={handleEditChange}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-bold">Description</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          name="description"
                          value={editMember.description || ""}
                          onChange={handleEditChange}
                        ></textarea>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-bold">Status</label>
                        <select
                          className="form-select"
                          name="isActive"
                          value={editMember.isActive !== undefined ? editMember.isActive : true}
                          onChange={handleEditChange}
                        >
                          <option value={true}>Active</option>
                          <option value={false}>Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer border-0 mt-3">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={closeEditModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={editLoading}
                    >
                      {editLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListTeamMember;