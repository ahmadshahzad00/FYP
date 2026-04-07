import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import "bootstrap/dist/css/bootstrap.min.css";

function BusinessRequests() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const dummyRequests = [
      {
        id: 1,
        name: "Ali Sports",
        owner: "Ali Khan",
        email: "ali@gmail.com",
        category: "Sports Goods",
        status: "pending",
        createdAt: "2026-03-01",
        description: "Manufacturer of high-quality sports goods from Sialkot.",
      },
      {
        id: 2,
        name: "Leather Hub",
        owner: "Usman",
        email: "usman@gmail.com",
        category: "Leather",
        status: "pending",
        createdAt: "2026-03-05",
        description: "Exporter of premium leather jackets and bags.",
      },
    ];

    setRequests(dummyRequests);
  }, []);

  const handleView = (id) => {
    const req = requests.find((r) => r.id === id);
    if (req) {
      setSelectedRequest(req);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
  };

  const handleAction = (id, action) => {
    const updated = requests.map((req) =>
      req.id === id ? { ...req, status: action } : req
    );
    setRequests(updated);

    if (selectedRequest?.id === id) {
      setSelectedRequest({ ...selectedRequest, status: action });
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      <AdminSidebar />

      <div className="flex-grow-1 p-4">
        <h2 className="text-center mb-4">Business Register Requests</h2>

        <div className="table-responsive shadow-sm bg-white rounded">
          <table className="table table-striped table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Business</th>
                <th>Owner</th>
                <th>Email</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((req) => (
                <tr key={req.id}>
                  <td>{req.id}</td>

                  <td>
                    <div className="fw-bold">{req.name}</div>
                    <small className="text-muted">Requested</small>
                  </td>

                  <td>{req.owner}</td>
                  <td>{req.email}</td>
                  <td>{req.category}</td>

                  <td>
                    <span
                      className={`badge ${
                        req.status === "approved"
                          ? "bg-success"
                          : req.status === "rejected"
                          ? "bg-danger"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>

                  <td>
                    <div className="btn-group btn-group-sm">
                      <button
                        className="btn btn-info"
                        onClick={() => handleView(req.id)}
                      >
                        <i className="bi bi-eye"></i> View
                      </button>

                      {req.status === "pending" && (
                        <>
                          <button
                            className="btn btn-success"
                            onClick={() =>
                              handleAction(req.id, "approved")
                            }
                          >
                            Approve
                          </button>

                          <button
                            className="btn btn-danger"
                            onClick={() =>
                              handleAction(req.id, "rejected")
                            }
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {requests.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showModal && selectedRequest && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              
              <div className="modal-header">
                <h5 className="modal-title">Business Details</h5>
                <button
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>

              <div className="modal-body">
                <h4 className="mb-2">{selectedRequest.name}</h4>
                <p className="text-muted">{selectedRequest.description}</p>

                <dl className="row">
                  <dt className="col-4">Owner</dt>
                  <dd className="col-8">{selectedRequest.owner}</dd>

                  <dt className="col-4">Email</dt>
                  <dd className="col-8">{selectedRequest.email}</dd>

                  <dt className="col-4">Category</dt>
                  <dd className="col-8">{selectedRequest.category}</dd>

                  <dt className="col-4">Requested At</dt>
                  <dd className="col-8">{selectedRequest.createdAt}</dd>

                  <dt className="col-4">Status</dt>
                  <dd className="col-8">
                    <span
                      className={`badge ${
                        selectedRequest.status === "approved"
                          ? "bg-success"
                          : selectedRequest.status === "rejected"
                          ? "bg-danger"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {selectedRequest.status}
                    </span>
                  </dd>
                </dl>
              </div>

              <div className="modal-footer">
                {selectedRequest.status === "pending" && (
                  <>
                    <button
                      className="btn btn-success"
                      onClick={() =>
                        handleAction(selectedRequest.id, "approved")
                      }
                    >
                      Approve
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() =>
                        handleAction(selectedRequest.id, "rejected")
                      }
                    >
                      Reject
                    </button>
                  </>
                )}

                <button
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BusinessRequests;