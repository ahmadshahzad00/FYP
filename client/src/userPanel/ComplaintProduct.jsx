import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";

const ComplaintProduct = ({ product, onComplaintSubmitted }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    complaintType: "quality_issue",
    description: "",
    severity: "medium",
  });
  const [attachments, setAttachments] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const complaintTypes = [
    { value: "quality_issue", label: "Quality Issue" },
    { value: "delivery_delay", label: "Delivery Delay" },
    { value: "wrong_product", label: "Wrong Product Received" },
    { value: "damaged_product", label: "Damaged Product" },
    { value: "quantity_mismatch", label: "Quantity Mismatch" },
    { value: "price_issue", label: "Price Issue" },
    { value: "customer_service", label: "Customer Service" },
    { value: "payment_issue", label: "Payment Issue" },
    { value: "other", label: "Other" },
  ];

  const severityLevels = [
    { value: "low", label: "Low", color: "success" },
    { value: "medium", label: "Medium", color: "warning" },
    { value: "high", label: "High", color: "danger" },
    { value: "critical", label: "Critical", color: "danger" },
  ];

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert("Maximum 5 files allowed");
      return;
    }
    setAttachments(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Please login to submit a complaint");
        setLoading(false);
        return;
      }

      // Validate form
      if (!formData.subject.trim()) {
        setError("Subject is required");
        setLoading(false);
        return;
      }
      if (!formData.description.trim()) {
        setError("Description is required");
        setLoading(false);
        return;
      }

      console.log("Submitting complaint for product:", product);

      const data = new FormData();
      data.append("productId", product._id);
      data.append("productCode", product.productCode || product._id);
      data.append("productName", product.name);
      data.append("businessId", product.businessId);
      data.append("businessName", product.businessName || "Business");
      data.append("subject", formData.subject);
      data.append("complaintType", formData.complaintType);
      data.append("description", formData.description);
      data.append("severity", formData.severity);

      for (const file of attachments) {
        data.append("attachments", file);
      }

      console.log("Sending request to API...");

      const response = await axios.post(
        "http://localhost:5000/api/complaints",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response:", response.data);

      if (response.data.success) {
        setSuccess(true);
        setFormData({
          subject: "",
          complaintType: "quality_issue",
          description: "",
          severity: "medium",
        });
        setAttachments([]);
        setTimeout(() => {
          setShowModal(false);
          setSuccess(false);
          if (onComplaintSubmitted) onComplaintSubmitted();
        }, 2000);
      } else {
        setError(response.data.message || "Failed to submit complaint");
      }
    } catch (err) {
      console.error("Full error:", err);
      console.error("Error response:", err.response);
      console.error("Error message:", err.message);
      
      // Show detailed error message
      if (err.response) {
        // Server responded with error
        setError(err.response.data?.message || err.response.data?.msg || "Server error occurred");
      } else if (err.request) {
        // Request made but no response
        setError("No response from server. Please check your connection.");
      } else {
        setError(err.message || "Failed to submit complaint");
      }
    } finally {
      setLoading(false);
    }
  };

  const openModal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to submit a complaint");
      window.location.href = "/login";
      return;
    }
    setShowModal(true);
    setError("");
    setSuccess(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      subject: "",
      complaintType: "quality_issue",
      description: "",
      severity: "medium",
    });
    setAttachments([]);
    setError("");
    setSuccess(false);
  };

  const modalContent = showModal ? (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.6)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        animation: "fadeIn 0.3s ease",
      }}
      onClick={closeModal}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          maxWidth: "600px",
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          animation: "slideUp 0.3s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: "20px 25px",
            borderBottom: "1px solid #e9ecef",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            top: 0,
            backgroundColor: "#fff",
            zIndex: 10,
            borderRadius: "12px 12px 0 0",
          }}
        >
          <h5 className="modal-title fw-bold" style={{ margin: 0 }}>
            <i className="bi bi-exclamation-triangle text-danger me-2"></i>
            Report Complaint
          </h5>
          <button
            type="button"
            onClick={closeModal}
            style={{
              border: "none",
              background: "transparent",
              fontSize: "24px",
              cursor: "pointer",
              color: "#6c757d",
              padding: "0 5px",
            }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: "25px" }}>
          {success ? (
            <div className="alert alert-success text-center py-4">
              <i className="bi bi-check-circle-fill fs-1 d-block mb-3 text-success"></i>
              <h5>Complaint Submitted Successfully!</h5>
              <p className="text-muted">
                The business owner will review your complaint and respond shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Product Info */}
              <div className="bg-light p-3 rounded-3 mb-4">
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-2">
                    <i className="bi bi-box text-primary"></i>
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold">{product.name}</h6>
                    <small className="text-muted">
                      Product Code: {product.productCode || product._id}
                    </small>
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div className="mb-3">
                <label className="form-label fw-bold">Subject *</label>
                <input
                  type="text"
                  className="form-control"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Brief subject of your complaint"
                  required
                />
              </div>

              {/* Complaint Type */}
              <div className="mb-3">
                <label className="form-label fw-bold">Complaint Type *</label>
                <select
                  className="form-select"
                  name="complaintType"
                  value={formData.complaintType}
                  onChange={handleChange}
                  required
                >
                  {complaintTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Severity */}
              <div className="mb-3">
                <label className="form-label fw-bold">Severity Level</label>
                <select
                  className="form-select"
                  name="severity"
                  value={formData.severity}
                  onChange={handleChange}
                >
                  {severityLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="mb-3">
                <label className="form-label fw-bold">Description *</label>
                <textarea
                  className="form-control"
                  rows="4"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Please provide detailed description of your complaint..."
                  required
                ></textarea>
              </div>

              {/* Attachments */}
              <div className="mb-3">
                <label className="form-label fw-bold">Attachments</label>
                <input
                  type="file"
                  className="form-control"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
                <small className="text-muted">
                  Max 5 files, 10MB each. Supported: JPG, PNG
                </small>
                {attachments.length > 0 && (
                  <div className="mt-2">
                    <small className="text-success">
                      <i className="bi bi-check-circle me-1"></i>
                      {attachments.length} file(s) selected
                    </small>
                  </div>
                )}
              </div>

              {error && (
                <div className="alert alert-danger">
                  <i className="bi bi-exclamation-circle me-2"></i>
                  {error}
                </div>
              )}

              <div className="d-flex gap-2 mt-3">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-danger"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send me-2"></i>
                      Submit Complaint
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  ) : null;

  return (
    <>
      <button
        className="btn btn-outline-danger btn-sm"
        onClick={openModal}
        title="Report a complaint about this product"
        style={{ position: "relative", zIndex: 1 }}
      >
        <i className="bi bi-exclamation-triangle me-1"></i>
        Complaint
      </button>

      {modalContent && ReactDOM.createPortal(modalContent, document.body)}
    </>
  );
};

export default ComplaintProduct;