import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import "bootstrap/dist/css/bootstrap.min.css";

function BusinessRequests() {
  const [requests, setRequests] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/business/all",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/business/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const handleView = (data) => {
    setSelected(data);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelected(null);
    setShowModal(false);
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      <AdminSidebar />

      <div className="container-fluid p-4">

        {/* HEADER */}
        <div className="mb-3">
          <h3 className="fw-bold">Business Requests</h3>
        </div>

        {/* TABLE */}
        <div className="card shadow-sm border-0">
          <div className="card-body p-0">

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">

                <thead className="table-dark">
                  <tr>
                    <th>Company</th>
                    <th>Owner</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {requests.map((r) => (
                    <tr key={r._id}>
                      <td className="fw-semibold">{r.companyName}</td>
                      <td>{r.ownerName}</td>
                      <td>{r.category}</td>

                      <td>
                        <span
                          className={`badge ${
                            r.status === "approved"
                              ? "bg-success"
                              : r.status === "rejected"
                              ? "bg-danger"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>

                      <td>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => handleView(r)}
                        >
                          View
                        </button>

                        {r.status === "pending" && (
                          <>
                            <button
                              className="btn btn-sm btn-success me-2"
                              onClick={() => handleAction(r._id, "approved")}
                            >
                              Approve
                            </button>

                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleAction(r._id, "rejected")}
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && selected && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">

              {/* HEADER */}
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title">{selected.companyName}</h5>
                <button className="btn-close btn-close-white" onClick={closeModal}></button>
              </div>

              {/* BODY */}
              <div className="modal-body">

                {/* ✅ LOGO */}
                {selected.logo && (
                  <div className="text-center mb-3">
                    <img
                      src={`http://localhost:5000/${selected.logo}`}
                      alt="Logo"
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        border: "1px solid #ddd",
                        padding: "5px",
                      }}
                    />
                  </div>
                )}

                <div className="row g-3">

                  <div className="col-md-6">
                    <strong>Owner</strong>
                    <p>{selected.ownerName}</p>
                  </div>

                  <div className="col-md-6">
                    <strong>Email</strong>
                    <p>{selected.email}</p>
                  </div>

                  <div className="col-md-6">
                    <strong>Phone</strong>
                    <p>{selected.phone}</p>
                  </div>

                  <div className="col-md-6">
                    <strong>WhatsApp</strong>
                    <p>{selected.whatsapp}</p>
                  </div>

                  <div className="col-md-6">
                    <strong>Category</strong>
                    <p>{selected.category}</p>
                  </div>

                  <div className="col-md-6">
                    <strong>NTN</strong>
                    <p>{selected.ntnNumber}</p>
                  </div>

                  <div className="col-12">
                    <strong>Address</strong>
                    <p>{selected.factoryAddress}</p>
                  </div>

                  <div className="col-12">
                    <strong>Products</strong>
                    <p>{selected.products}</p>
                  </div>

                  <div className="col-12">
                    <strong>Description</strong>
                    <p>{selected.description}</p>
                  </div>

                  {/* FILES */}
                  <div className="col-12">
                    <hr />
                    <strong>Documents</strong>
                    <div className="mt-2">

                      <a
                        className="btn btn-outline-primary btn-sm me-2"
                        href={`http://localhost:5000/${selected.cnicFront}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        CNIC Front
                      </a>

                      <a
                        className="btn btn-outline-primary btn-sm me-2"
                        href={`http://localhost:5000/${selected.cnicBack}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        CNIC Back
                      </a>

                      <a
                        className="btn btn-outline-dark btn-sm"
                        href={`http://localhost:5000/${selected.chamberMembership}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Chamber PDF
                      </a>

                    </div>
                  </div>

                </div>
              </div>

              {/* FOOTER */}
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>

                {selected.status === "pending" && (
                  <>
                    <button
                      className="btn btn-success"
                      onClick={() => handleAction(selected._id, "approved")}
                    >
                      Approve
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() => handleAction(selected._id, "rejected")}
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default BusinessRequests;