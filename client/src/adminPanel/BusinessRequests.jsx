import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import "bootstrap/dist/css/bootstrap.min.css";

function BusinessRequests() {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("company");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(
        "http://localhost:5000/api/business/all",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setRequests(res.data);
      setFilteredRequests(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch business requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [searchTerm, searchField, requests]);

  const filterRequests = () => {
    if (!searchTerm.trim()) {
      setFilteredRequests(requests);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    
    const filtered = requests.filter(request => {
      switch(searchField) {
        case "company":
          return request.companyName?.toLowerCase().includes(searchLower);
        case "owner":
          return request.ownerName?.toLowerCase().includes(searchLower);
        case "category":
          return request.category?.toLowerCase().includes(searchLower);
        case "email":
          return request.email?.toLowerCase().includes(searchLower);
        case "phone":
          return request.phone?.toLowerCase().includes(searchLower);
        case "memberId":
          return request.memberId?.toLowerCase().includes(searchLower);
        case "status":
          return request.status?.toLowerCase().includes(searchLower);
        default:
          return request.companyName?.toLowerCase().includes(searchLower);
      }
    });
    
    setFilteredRequests(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchFieldChange = (e) => {
    setSearchField(e.target.value);
    setSearchTerm("");
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilteredRequests(requests);
  };

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
      alert(err.response?.data?.message || "Failed to update status");
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

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case "approved":
        return "bg-success";
      case "rejected":
        return "bg-danger";
      default:
        return "bg-warning text-dark";
    }
  };

  if (loading) {
    return (
      <div className="d-flex min-vh-100 bg-light">
        <AdminSidebar />
        <div className="flex-grow-1 p-4 d-flex justify-content-center align-items-center">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading business requests...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex min-vh-100 bg-light">
        <AdminSidebar />
        <div className="flex-grow-1 p-4 d-flex justify-content-center align-items-center">
          <div className="text-center">
            <div className="alert alert-danger" role="alert">
              <i className="bi bi-exclamation-triangle fs-1"></i>
              <h4 className="mt-2">Error</h4>
              <p>{error}</p>
              <button 
                className="btn btn-primary mt-2" 
                onClick={fetchRequests}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex min-vh-100 bg-light">
      <AdminSidebar />

      <div className="flex-grow-1 p-4">
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold mb-0">Business Requests</h3>
            <p className="text-muted mb-0">Manage and review business registration requests</p>
          </div>
          <div className="text-muted">
            Total: {filteredRequests.length} requests
          </div>
        </div>

        {/* SEARCH BAR SECTION */}
        <div className="card shadow-sm mb-4 border-0">
          <div className="card-body">
            <div className="row g-3 align-items-end">
              <div className="col-md-3">
                <label className="form-label fw-bold mb-1">
                  <i className="bi bi-search"></i> Search By
                </label>
                <select 
                  className="form-select" 
                  value={searchField} 
                  onChange={handleSearchFieldChange}
                >
                  <option value="company">Company Name</option>
                  <option value="owner">Owner Name</option>
                  <option value="category">Category</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="memberId">Member ID</option>
                  <option value="status">Status</option>
                </select>
              </div>
              <div className="col-md-7">
                <label className="form-label fw-bold mb-1">
                  <i className="bi bi-input-cursor"></i> Search Term
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`Search by ${searchField}...`}
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  {searchTerm && (
                    <button 
                      className="btn btn-outline-secondary" 
                      type="button"
                      onClick={clearSearch}
                    >
                      <i className="bi bi-x-lg"></i> Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Search Results Info */}
            {searchTerm && (
              <div className="mt-3 pt-2 border-top">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="text-info">
                    <i className="bi bi-info-circle"></i> 
                    Showing results for: <strong>"{searchTerm}"</strong> in <strong>{searchField}</strong>
                  </div>
                  <div className="text-muted">
                    Found {filteredRequests.length} of {requests.length} requests
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* STATISTICS CARDS */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card bg-primary text-white shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Total</h5>
                <h2 className="mb-0">{requests.length}</h2>
                <small>Total Requests</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-warning text-dark shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Pending</h5>
                <h2 className="mb-0">{requests.filter(r => r.status === "pending").length}</h2>
                <small>Awaiting Review</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-success text-white shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Approved</h5>
                <h2 className="mb-0">{requests.filter(r => r.status === "approved").length}</h2>
                <small>Approved Requests</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-danger text-white shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Rejected</h5>
                <h2 className="mb-0">{requests.filter(r => r.status === "rejected").length}</h2>
                <small>Rejected Requests</small>
              </div>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0 fw-bold">Business Registration Requests</h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Company</th>
                    <th>Owner</th>
                    <th>Category</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Member ID</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((r) => (
                    <tr key={r._id}>
                      <td className="fw-semibold">{r.companyName}</td>
                      <td>{r.ownerName}</td>
                      <td>{r.category}</td>
                      <td>{r.email}</td>
                      <td>{r.phone}</td>
                      <td>
                        <span className="badge bg-info text-dark">
                          {r.memberId || "N/A"}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(r.status)}`}>
                          {r.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => handleView(r)}
                        >
                          <i className="bi bi-eye"></i> View
                        </button>

                        {r.status === "pending" && (
                          <>
                            <button
                              className="btn btn-sm btn-success me-2"
                              onClick={() => handleAction(r._id, "approved")}
                            >
                              <i className="bi bi-check-lg"></i> Approve
                            </button>

                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleAction(r._id, "rejected")}
                            >
                              <i className="bi bi-x-lg"></i> Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Empty State */}
              {filteredRequests.length === 0 && (
                <div className="text-center py-5">
                  {searchTerm ? (
                    <>
                      <i className="bi bi-search fs-1 text-muted"></i>
                      <p className="text-muted mt-2">
                        No requests found matching "<strong>{searchTerm}</strong>" in {searchField}
                      </p>
                      <button 
                        className="btn btn-sm btn-outline-primary" 
                        onClick={clearSearch}
                      >
                        Clear Search
                      </button>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-inbox fs-1 text-muted"></i>
                      <p className="text-muted mt-2">No business requests found</p>
                    </>
                  )}
                </div>
              )}
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
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">

              {/* HEADER */}
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title">{selected.companyName}</h5>
                <button className="btn-close btn-close-white" onClick={closeModal}></button>
              </div>

              {/* BODY */}
              <div className="modal-body">

                {/* LOGO */}
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
                    <strong>Member ID</strong>
                    <p>
                      <span className="badge bg-info text-dark">
                        {selected.memberId || "N/A"}
                      </span>
                    </p>
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

                  {/* Status Badge */}
                  <div className="col-12">
                    <strong>Status</strong>
                    <div className="mt-1">
                      <span className={`badge ${getStatusBadgeClass(selected.status)} fs-6`}>
                        {selected.status}
                      </span>
                    </div>
                  </div>

                  {/* FILES */}
                  <div className="col-12">
                    <hr />
                    <strong>Documents</strong>
                    <div className="mt-2">

                      <a
                        className="btn btn-outline-primary btn-sm me-2 mb-2"
                        href={`http://localhost:5000/${selected.cnicFront}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <i className="bi bi-file-image"></i> CNIC Front
                      </a>

                      <a
                        className="btn btn-outline-primary btn-sm me-2 mb-2"
                        href={`http://localhost:5000/${selected.cnicBack}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <i className="bi bi-file-image"></i> CNIC Back
                      </a>

                      <a
                        className="btn btn-outline-dark btn-sm mb-2"
                        href={`http://localhost:5000/${selected.chamberMembership}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <i className="bi bi-file-pdf"></i> Chamber PDF
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
                      onClick={() => {
                        handleAction(selected._id, "approved");
                        closeModal();
                      }}
                    >
                      <i className="bi bi-check-lg"></i> Approve
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        handleAction(selected._id, "rejected");
                        closeModal();
                      }}
                    >
                      <i className="bi bi-x-lg"></i> Reject
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