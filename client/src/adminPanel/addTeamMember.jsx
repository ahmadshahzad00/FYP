import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { Link, useNavigate } from "react-router-dom";


const AddTeamMember = () => {
  const [members, setMembers] = useState([]);
  const [showList, setShowList] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    description: "",
    image: null,
    preview: "",
  });

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image upload
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  // Add member
  const handleSubmit = (e) => {
    e.preventDefault();

    const newMember = {
      id: Date.now(),
      ...formData,
    };

    setMembers([...members, newMember]);

    // Reset form
    setFormData({
      name: "",
      designation: "",
      description: "",
      image: null,
      preview: "",
    });

    // Switch to list view
    setShowList(true);
  };

  // Delete member
  const handleDelete = (id) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  return (
    <div className="d-flex">
      <AdminSidebar />

      <div className="container-fluid p-4">

        {/* Top Header + Toggle Button */}
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold mb-0">
                Add Team Member
            </h3>
            <Link to="/team-members-list" className="btn btn-primary">
               Team Member
            </Link>
        </div>

        {/* ================= ADD FORM ================= */}
        {!showList && (
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">

                  <div className="col-md-6">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Designation</label>
                    <input
                      type="text"
                      className="form-control"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Image</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={handleImage}
                      accept="image/*"
                      required
                    />
                  </div>

                  <div className="col-md-6 text-center">
                    {formData.preview && (
                      <img
                        src={formData.preview}
                        alt="preview"
                        className="rounded shadow-sm"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </div>

                </div>

                <button className="btn btn-success mt-3 px-4">
                  Add Member
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ================= MEMBERS LIST ================= */}
        {showList && (
          <div className="row">
            {members.length === 0 ? (
              <p className="text-muted">No team members added yet.</p>
            ) : (
              members.map((member) => (
                <div className="col-md-4 mb-4" key={member.id}>
                  <div className="card border-0 shadow-sm h-100 text-center p-3">

                    <img
                      src={member.preview}
                      alt={member.name}
                      className="rounded-circle mx-auto mb-3"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />

                    <h5 className="fw-semibold">{member.name}</h5>
                    <p className="text-primary mb-1">
                      {member.designation}
                    </p>

                    <p className="text-muted small">
                      {member.description}
                    </p>

                    <button
                      className="btn btn-sm btn-outline-danger mt-2"
                      onClick={() => handleDelete(member.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default AddTeamMember;