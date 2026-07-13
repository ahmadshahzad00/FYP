import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";

function ListComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("subject");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    in_review: 0,
    in_progress: 0,
    resolved: 0,
    closed: 0,
  });
  const [statusFilter, setStatusFilter] = useState("");

  // Get admin token
  const getToken = () => {
    return localStorage.getItem("adminToken");
  };

  // Fetch complaints
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        setError("No authentication token found. Please login again.");
        setLoading(false);
        setTimeout(() => {
          window.location.href = "/admin-login";
        }, 2000);
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/complaints/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setComplaints(response.data.data);
        setFilteredComplaints(response.data.data);
        if (response.data.stats) {
          setStats(response.data.stats);
        }
      }
    } catch (err) {
      console.error("Error fetching complaints:", err);
      
      if (err.response?.status === 401) {
        setError("Your session has expired. Please login again.");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");
        setTimeout(() => {
          window.location.href = "/admin-login";
        }, 2000);
      } else {
        setError(err.response?.data?.message || "Failed to fetch complaints");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    filterComplaints();
  }, [searchTerm, searchField, complaints, statusFilter]);

  const filterComplaints = () => {
    let results = [...complaints];

    if (statusFilter) {
      results = results.filter(complaint => complaint.status === statusFilter);
    }

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      results = results.filter(complaint => {
        switch(searchField) {
          case "subject":
            return complaint.subject?.toLowerCase().includes(searchLower);
          case "customerName":
            return complaint.customerName?.toLowerCase().includes(searchLower);
          case "customerEmail":
            return complaint.customerEmail?.toLowerCase().includes(searchLower);
          case "productName":
            return complaint.productName?.toLowerCase().includes(searchLower);
          case "complaintType":
            return complaint.complaintType?.toLowerCase().includes(searchLower);
          case "businessName":
            return complaint.businessName?.toLowerCase().includes(searchLower);
          default:
            return complaint.subject?.toLowerCase().includes(searchLower);
        }
      });
    }

    setFilteredComplaints(results);
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
    setStatusFilter("");
    setFilteredComplaints(complaints);
  };

  const viewComplaint = async (id) => {
    try {
      const token = getToken();
      const response = await axios.get(
        `http://localhost:5000/api/complaints/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data.success) {
        setSelectedComplaint(response.data.data);
        setShowDetailModal(true);
      }
    } catch (err) {
      console.error("Error fetching complaint details:", err);
      alert(err.response?.data?.message || "Failed to load complaint details");
    }
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedComplaint(null);
  };

  const updateStatus = async (id, status, resolution = "") => {
    if (!window.confirm(`Mark this complaint as "${status}"?`)) return;

    try {
      const token = getToken();
      
      await axios.put(
        `http://localhost:5000/api/complaints/${id}/status`,
        { status, resolution },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      await fetchComplaints();
      if (selectedComplaint && selectedComplaint._id === id) {
        setSelectedComplaint({ ...selectedComplaint, status });
      }
      alert(`✅ Complaint marked as "${status}"!`);
    } catch (err) {
      console.error("Error updating status:", err);
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const deleteComplaint = async (id) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;

    try {
      const token = getToken();
      
      await axios.delete(
        `http://localhost:5000/api/complaints/admin/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      await fetchComplaints();
      if (selectedComplaint && selectedComplaint._id === id) {
        closeDetailModal();
      }
      alert("✅ Complaint deleted successfully!");
    } catch (err) {
      console.error("Error deleting complaint:", err);
      alert(err.response?.data?.message || "Failed to delete complaint");
    }
  };

  const getComplaintTypeLabel = (type) => {
    const labels = {
      quality_issue: "Quality Issue",
      delivery_delay: "Delivery Delay",
      wrong_product: "Wrong Product",
      damaged_product: "Damaged Product",
      quantity_mismatch: "Quantity Mismatch",
      price_issue: "Price Issue",
      customer_service: "Customer Service",
      payment_issue: "Payment Issue",
      other: "Other",
    };
    return labels[type] || type;
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-warning text-dark",
      in_review: "bg-info text-dark",
      in_progress: "bg-primary text-white",
      resolved: "bg-success text-white",
      closed: "bg-secondary text-white",
    };
    return badges[status] || "bg-secondary";
  };

  const getSeverityBadge = (severity) => {
    const badges = {
      low: "bg-success",
      medium: "bg-warning text-dark",
      high: "bg-danger",
      critical: "bg-danger",
    };
    return badges[severity] || "bg-secondary";
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: "⏳",
      in_review: "🔍",
      in_progress: "🔄",
      resolved: "✅",
      closed: "🔒",
    };
    return icons[status] || "📋";
  };

  if (loading) {
    return (
      <div className="d-flex">
        <AdminSidebar />
        <div className="flex-grow-1 p-4 d-flex justify-content-center align-items-center">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading complaints...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <AdminSidebar />

      <div className="flex-grow-1 p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <h3 className="fw-bold mb-0">
              <i className="bi bi-exclamation-triangle text-danger me-2"></i>
              Complaint Management
            </h3>
            <p className="text-muted mb-0">View and manage customer complaints</p>
          </div>
          <button
            className="btn btn-outline-primary"
            onClick={fetchComplaints}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-danger">
            <i className="bi bi-exclamation-circle me-2"></i>
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-2 col-6">
            <div className="card bg-primary text-white text-center p-2">
              <small>Total</small>
              <h4 className="mb-0">{stats.total}</h4>
            </div>
          </div>
          <div className="col-md-2 col-6">
            <div className="card bg-warning text-dark text-center p-2">
              <small>Pending</small>
              <h4 className="mb-0">{stats.pending}</h4>
            </div>
          </div>
          <div className="col-md-2 col-6">
            <div className="card bg-info text-dark text-center p-2">
              <small>In Review</small>
              <h4 className="mb-0">{stats.in_review}</h4>
            </div>
          </div>
          <div className="col-md-2 col-6">
            <div className="card bg-primary text-white text-center p-2">
              <small>In Progress</small>
              <h4 className="mb-0">{stats.in_progress}</h4>
            </div>
          </div>
          <div className="col-md-2 col-6">
            <div className="card bg-success text-white text-center p-2">
              <small>Resolved</small>
              <h4 className="mb-0">{stats.resolved}</h4>
            </div>
          </div>
          <div className="col-md-2 col-6">
            <div className="card bg-secondary text-white text-center p-2">
              <small>Closed</small>
              <h4 className="mb-0">{stats.closed}</h4>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
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
                  <option value="subject">Subject</option>
                  <option value="customerName">Customer Name</option>
                  <option value="customerEmail">Customer Email</option>
                  <option value="productName">Product Name</option>
                  <option value="complaintType">Complaint Type</option>
                  <option value="businessName">Business Name</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label fw-bold mb-1">
                  <i className="bi bi-filter"></i> Status Filter
                </label>
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_review">In Review</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div className="col-md-4">
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
              <div className="col-md-2">
                <div className="text-muted">
                  Total: {filteredComplaints.length} complaints
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Complaint List */}
        <div className="card shadow-sm border-0">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Subject</th>
                    <th>Customer</th>
                    <th>Business</th>
                    <th>Type</th>
                    <th>Severity</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComplaints.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center py-4 text-muted">
                        {searchTerm ? "No complaints found matching your search" : "No complaints found"}
                      </td>
                    </tr>
                  ) : (
                    filteredComplaints.map((complaint, index) => (
                      <tr key={complaint._id}>
                        <td>{index + 1}</td>
                        <td>
                          <span className="fw-semibold">{complaint.subject}</span>
                          {complaint.status === "pending" && (
                            <span className="badge bg-danger ms-1">New</span>
                          )}
                        </td>
                        <td>
                          <div>
                            <div>{complaint.customerName}</div>
                            <small className="text-muted">{complaint.customerEmail}</small>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-secondary">
                            {complaint.businessName}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-secondary">
                            {getComplaintTypeLabel(complaint.complaintType)}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${getSeverityBadge(complaint.severity)}`}>
                            {complaint.severity}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${getStatusBadge(complaint.status)}`}>
                            {getStatusIcon(complaint.status)} {complaint.status}
                          </span>
                        </td>
                        <td>
                          <small className="text-muted">
                            {new Date(complaint.createdAt).toLocaleDateString()}
                          </small>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary me-1"
                            onClick={() => viewComplaint(complaint._id)}
                            title="View Details"
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          {complaint.status === "pending" && (
                            <>
                              <button
                                className="btn btn-sm btn-success me-1"
                                onClick={() => updateStatus(complaint._id, "in_progress")}
                                title="Start working on this complaint"
                              >
                                <i className="bi bi-play"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-info me-1"
                                onClick={() => updateStatus(complaint._id, "in_review")}
                                title="Mark as in review"
                              >
                                <i className="bi bi-search"></i>
                              </button>
                            </>
                          )}
                          {complaint.status === "in_progress" && (
                            <button
                              className="btn btn-sm btn-success me-1"
                              onClick={() => updateStatus(complaint._id, "resolved")}
                              title="Mark as resolved"
                            >
                              <i className="bi bi-check-lg"></i>
                            </button>
                          )}
                          {complaint.status === "resolved" && (
                            <button
                              className="btn btn-sm btn-secondary me-1"
                              onClick={() => updateStatus(complaint._id, "closed")}
                              title="Close complaint"
                            >
                              <i className="bi bi-x-lg"></i>
                            </button>
                          )}
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => deleteComplaint(complaint._id)}
                            title="Delete complaint"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Complaint Detail Modal - Admin View Only (No Reply) */}
      {showDetailModal && selectedComplaint && (
        <div
          className="modal fade show d-block"
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 9999,
            overflow: "auto",
          }}
          onClick={closeDetailModal}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
            style={{ pointerEvents: "none" }}
          >
            <div
              className="modal-content"
              style={{ pointerEvents: "auto" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Complaint Details
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={closeDetailModal}
                ></button>
              </div>

              <div className="modal-body">
                {/* Customer Info */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <strong>Customer:</strong>
                    <p>{selectedComplaint.customerName}</p>
                  </div>
                  <div className="col-md-6">
                    <strong>Email:</strong>
                    <p>{selectedComplaint.customerEmail}</p>
                  </div>
                  <div className="col-md-6">
                    <strong>Phone:</strong>
                    <p>{selectedComplaint.customerPhone}</p>
                  </div>
                  <div className="col-md-6">
                    <strong>Status:</strong>
                    <p>
                      <span className={`badge ${getStatusBadge(selectedComplaint.status)}`}>
                        {selectedComplaint.status}
                      </span>
                    </p>
                  </div>
                </div>

                <hr />

                {/* Complaint Info */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <strong>Product:</strong>
                    <p>{selectedComplaint.productName}</p>
                  </div>
                  <div className="col-md-6">
                    <strong>Product Code:</strong>
                    <p>{selectedComplaint.productCode}</p>
                  </div>
                  <div className="col-md-6">
                    <strong>Complaint Type:</strong>
                    <p>{getComplaintTypeLabel(selectedComplaint.complaintType)}</p>
                  </div>
                  <div className="col-md-6">
                    <strong>Severity:</strong>
                    <p>
                      <span className={`badge ${getSeverityBadge(selectedComplaint.severity)}`}>
                        {selectedComplaint.severity}
                      </span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <strong>Business:</strong>
                    <p>{selectedComplaint.businessName}</p>
                  </div>
                  <div className="col-md-6">
                    <strong>Date:</strong>
                    <p>{new Date(selectedComplaint.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <hr />

                {/* Description */}
                <div className="mb-3">
                  <strong>Description:</strong>
                  <div className="bg-light p-3 rounded mt-1">
                    {selectedComplaint.description}
                  </div>
                </div>

                {/* Attachments */}
                {selectedComplaint.attachments && selectedComplaint.attachments.length > 0 && (
                  <>
                    <hr />
                    <h6>Attachments:</h6>
                    <div className="d-flex gap-2 flex-wrap">
                      {selectedComplaint.attachments.map((file, idx) => (
                        <a
                          key={idx}
                          href={`http://localhost:5000/${file.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-primary"
                        >
                          <i className="bi bi-file-earmark me-1"></i>
                          {file.name}
                        </a>
                      ))}
                    </div>
                  </>
                )}

                {/* Responses - View Only */}
                {selectedComplaint.responses && selectedComplaint.responses.length > 0 && (
                  <>
                    <hr />
                    <h6>Responses:</h6>
                    {selectedComplaint.responses.map((response, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded mb-2 ${
                          response.sender === "business_owner"
                            ? "bg-primary text-white"
                            : response.sender === "admin"
                            ? "bg-info text-white"
                            : "bg-secondary text-white"
                        }`}
                      >
                        <small>
                          {response.sender === "business_owner" ? "Business Owner" :
                           response.sender === "admin" ? "Admin" : "Customer"} •
                          {new Date(response.createdAt).toLocaleString()}
                        </small>
                        <p className="mb-0">{response.message}</p>
                      </div>
                    ))}
                  </>
                )}

                {/* Resolution */}
                {selectedComplaint.resolution && (
                  <>
                    <hr />
                    <div className="alert alert-success">
                      <strong>Resolution:</strong>
                      <p className="mb-0">{selectedComplaint.resolution}</p>
                    </div>
                  </>
                )}

                {/* ❌ REMOVED: Reply Form - Admin cannot reply */}

                {/* Status Info */}
                {selectedComplaint.status === "pending" && (
                  <div className="alert alert-warning mt-3">
                    <i className="bi bi-clock me-2"></i>
                    This complaint is pending. The business owner will respond shortly.
                  </div>
                )}

                {selectedComplaint.status === "in_progress" && (
                  <div className="alert alert-info mt-3">
                    <i className="bi bi-play me-2"></i>
                    This complaint is being worked on by the business owner.
                  </div>
                )}

                {selectedComplaint.status === "resolved" && (
                  <div className="alert alert-success mt-3">
                    <i className="bi bi-check-circle me-2"></i>
                    This complaint has been resolved by the business owner.
                  </div>
                )}

                {selectedComplaint.status === "closed" && (
                  <div className="alert alert-secondary mt-3">
                    <i className="bi bi-x-circle me-2"></i>
                    This complaint has been closed.
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={closeDetailModal}
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

export default ListComplaints;