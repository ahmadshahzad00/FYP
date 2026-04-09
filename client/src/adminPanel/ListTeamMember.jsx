import React, { useState } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const ListTeamMember = () => {
  const [members, setMembers] = useState([
    {
      id: 1,
      name: "Ali Khan",
      designation: "CEO",
      description: "Leading the company with vision and strategy.",
      image: "https://via.placeholder.com/100",
    },
    {
      id: 2,
      name: "Ahmed Raza",
      designation: "Marketing Manager",
      description: "Expert in digital marketing and branding.",
      image: "https://via.placeholder.com/100",
    },
  ]);

  const [editMember, setEditMember] = useState(null);

  // Delete
  const handleDelete = (id) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  // Open Edit Modal
  const handleEdit = (member) => {
    setEditMember(member);
  };

  // Handle Edit Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditMember({ ...editMember, [name]: value });
  };

  // Save Update
  const handleUpdate = () => {
    setMembers(
      members.map((m) => (m.id === editMember.id ? editMember : m))
    );
  };

  return (
    <div className="d-flex">
      <AdminSidebar />

      <div className="container-fluid p-4">

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <h3 className="fw-bold mb-0">Team Members</h3>

          <Link to="/team-members" className="btn btn-primary px-4 shadow-sm">
            + Add Team Member
          </Link>
        </div>

        {/* List */}
        <div className="row">
          {members.length === 0 ? (
            <p className="text-muted">No team members found.</p>
          ) : (
            members.map((member) => (
              <div className="col-lg-4 col-md-6 mb-4" key={member.id}>
                <div className="card border-0 shadow-sm h-100 text-center p-4 rounded-4">

                  <img
                    src={member.image}
                    alt={member.name}
                    className="rounded-circle mx-auto mb-3 shadow-sm"
                    style={{
                      width: "110px",
                      height: "110px",
                      objectFit: "cover",
                      border: "3px solid #f1f1f1",
                    }}
                  />

                  <h5 className="fw-semibold mb-1">{member.name}</h5>

                  <p className="text-primary mb-2 fw-medium">
                    {member.designation}
                  </p>

                  <p className="text-muted small px-2">
                    {member.description}
                  </p>

                  {/* Buttons */}
                  <div className="d-flex justify-content-center gap-2 mt-3">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#editModal"
                      onClick={() => handleEdit(member)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(member.id)}
                    >
                      Delete
                    </button>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>

        {/* Edit Modal */}
        <div
          className="modal fade"
          id="editModal"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 shadow">

              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">Edit Team Member</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                ></button>
              </div>

              <div className="modal-body">
                {editMember && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={editMember.name}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Designation</label>
                      <input
                        type="text"
                        className="form-control"
                        name="designation"
                        value={editMember.designation}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        name="description"
                        value={editMember.description}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </>
                )}
              </div>

              <div className="modal-footer border-0">
                <button
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                  onClick={handleUpdate}
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ListTeamMember;