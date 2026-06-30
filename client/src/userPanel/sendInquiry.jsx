import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";

function SendInquiry() {
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [businessInfo, setBusinessInfo] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerCountry: "",
    customerCity: "",
    subject: "",
    message: "",
    inquiryType: "general",
    quantity: 1,
    preferredDeliveryDate: "",
    agreeTerms: false,
  });

  // Inquiry types
  const inquiryTypes = [
    { value: "general", label: "General Question", icon: "💬" },
    { value: "price", label: "Price Inquiry", icon: "💰" },
    { value: "bulk_order", label: "Bulk Order", icon: "📦" },
    { value: "customization", label: "Customization Request", icon: "🎨" },
    { value: "shipping", label: "Shipping/Delivery", icon: "🚚" },
    { value: "availability", label: "Stock Availability", icon: "📊" },
    { value: "warranty", label: "Warranty Information", icon: "🛡️" },
    { value: "specification", label: "Technical Specifications", icon: "🔧" },
    { value: "sample", label: "Sample Request", icon: "🧪" },
    { value: "other", label: "Other", icon: "📝" },
  ];

  // Get product ID from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const productId = params.get("product");
    
    if (productId) {
      fetchProductDetails(productId);
    } else {
      setError("No product specified");
      setLoading(false);
    }
  }, [location]);

  // Fetch product details
  const fetchProductDetails = async (productId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/product/product/${productId}`
      );
      
      if (response.data.success) {
        setProduct(response.data.product);
        setFormData(prev => ({
          ...prev,
          subject: `Inquiry about ${response.data.product.name}`,
        }));
        
        // Fetch business info
        await fetchBusinessInfo(response.data.product.businessId);
      } else {
        setError("Product not found");
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  // Fetch business info
  const fetchBusinessInfo = async (businessId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/business/business/${businessId}`
      );
      
      if (response.data.success) {
        setBusinessInfo(response.data.business);
      }
    } catch (err) {
      console.error("Error fetching business:", err);
    }
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.agreeTerms) {
      setError("Please agree to the terms before submitting");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      // Get user token if logged in
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const payload = {
        product: product._id,
        productName: product.name,
        productPrice: product.price,
        business: product.businessId,
        ...formData,
      };

      const response = await axios.post(
        "http://localhost:5000/api/inquiry",
        payload,
        { headers }
      );

      if (response.data.success) {
        setSuccess(true);
        // Reset form
        setFormData({
          customerName: "",
          customerEmail: "",
          customerPhone: "",
          customerCountry: "",
          customerCity: "",
          subject: "",
          message: "",
          inquiryType: "general",
          quantity: 1,
          preferredDeliveryDate: "",
          agreeTerms: false,
        });
        // Scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      console.error("Error submitting inquiry:", err);
      setError(
        err.response?.data?.message || "Failed to send inquiry. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <>
        <UserHeader />
        <div className="container text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 className="mt-3">Loading Product Details...</h4>
        </div>
        <UserFooter />
      </>
    );
  }

  // Error state
  if (error && !product) {
    return (
      <>
        <UserHeader />
        <div className="container py-5">
          <div className="text-center">
            <i className="bi bi-exclamation-triangle fs-1 text-danger"></i>
            <h3 className="mt-3">Something Went Wrong</h3>
            <p className="text-muted">{error}</p>
            <button className="btn btn-primary" onClick={() => navigate(-1)}>
              <i className="bi bi-arrow-left me-2"></i>Go Back
            </button>
          </div>
        </div>
        <UserFooter />
      </>
    );
  }

  return (
    <>
      <UserHeader />

      {/* ===== HERO SECTION ===== */}
      <section className="inquiry-hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="hero-content">
                <div className="badge bg-primary text-white mb-3">
                  <i className="bi bi-envelope me-2"></i>
                  Product Inquiry
                </div>
                <h1 className="hero-title">
                  Get More Information About
                  <span className="text-primary"> {product?.name}</span>
                </h1>
                <p className="hero-text">
                  Fill out the form below and the business owner will get back to you
                  with all the details you need.
                </p>
                <div className="hero-stats">
                  <div className="stat-item">
                    <i className="bi bi-building text-primary"></i>
                    <span>{businessInfo?.companyName || "Business"}</span>
                  </div>
                  <div className="stat-item">
                    <i className="bi bi-tag text-success"></i>
                    <span>Rs. {product?.price}</span>
                  </div>
                  <div className="stat-item">
                    <i className="bi bi-box text-warning"></i>
                    <span>{product?.availableQuantity || 0} in stock</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="hero-image-wrapper">
                {product?.images && product.images.length > 0 ? (
                  <img
                    src={`http://localhost:5000/${product.images[0]}`}
                    alt={product.name}
                    className="hero-image"
                  />
                ) : (
                  <div className="hero-image-placeholder">
                    <i className="bi bi-box fs-1"></i>
                    <p>No Image Available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SUCCESS ALERT ===== */}
      {success && (
        <div className="container mt-4">
          <div className="alert alert-success alert-dismissible fade show">
            <div className="d-flex align-items-center">
              <i className="bi bi-check-circle-fill fs-3 me-3"></i>
              <div>
                <h5 className="mb-1">✅ Inquiry Sent Successfully!</h5>
                <p className="mb-0">
                  The business owner will respond to your inquiry shortly. 
                  You will receive a response at your email address.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={() => setSuccess(false)}
            ></button>
          </div>
          {/* <div className="text-center mt-3">
            <button
              className="btn btn-outline-primary"
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back to Product
            </button>
          </div> */}
        </div>
      )}

      {/* ===== MAIN FORM SECTION ===== */}
      {!success && (
        <section className="inquiry-form-section">
          <div className="container">
            <div className="row">
              {/* Form Column */}
              <div className="col-lg-8 mx-auto">
                <div className="inquiry-form-card">
                  <div className="form-header">
                    <div className="d-flex align-items-center">
                      <div className="form-header-icon">
                        <i className="bi bi-pencil-square"></i>
                      </div>
                      <div>
                        <h4 className="mb-0">Send Your Inquiry</h4>
                        <p className="text-muted small mb-0">
                          Fill in the details below and we'll connect you with the business
                        </p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit}>
                    {/* Error Alert */}
                    {error && (
                      <div className="alert alert-danger">
                        <i className="bi bi-exclamation-circle me-2"></i>
                        {error}
                      </div>
                    )}

                    {/* Product Info Card */}
                    <div className="product-info-card">
                      <div className="d-flex align-items-center">
                        {product?.images && product.images.length > 0 ? (
                          <img
                            src={`http://localhost:5000/${product.images[0]}`}
                            alt={product.name}
                            className="product-thumbnail"
                          />
                        ) : (
                          <div className="product-thumbnail-placeholder">
                            <i className="bi bi-box"></i>
                          </div>
                        )}
                        <div className="ms-3 flex-grow-1">
                          <h6 className="mb-1">{product?.name}</h6>
                          <div className="d-flex gap-3">
                            <span className="badge bg-primary">
                              Rs. {product?.price}
                            </span>
                            <span className="badge bg-secondary">
                              {product?.category}
                            </span>
                            <span className="badge bg-info">
                              {product?.method || "N/A"}
                            </span>
                          </div>
                        </div>
                        {/* <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => navigate(`/product/${product._id}`)}
                        >
                          <i className="bi bi-eye me-1"></i> View
                        </button> */}
                      </div>
                    </div>

                    <div className="row g-3">
                      {/* Section Title */}
                      <div className="col-12">
                        <h6 className="section-title">
                          <i className="bi bi-person me-2"></i>
                          Your Information
                        </h6>
                        <hr />
                      </div>

                      {/* Customer Name */}
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input
                            type="text"
                            name="customerName"
                            className="form-control"
                            id="customerName"
                            placeholder="Your Full Name"
                            value={formData.customerName}
                            onChange={handleChange}
                            required
                          />
                          <label htmlFor="customerName">
                            <i className="bi bi-person me-2"></i>
                            Full Name *
                          </label>
                        </div>
                      </div>

                      {/* Customer Email */}
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input
                            type="email"
                            name="customerEmail"
                            className="form-control"
                            id="customerEmail"
                            placeholder="your@email.com"
                            value={formData.customerEmail}
                            onChange={handleChange}
                            required
                          />
                          <label htmlFor="customerEmail">
                            <i className="bi bi-envelope me-2"></i>
                            Email Address *
                          </label>
                        </div>
                      </div>

                      {/* Customer Phone */}
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input
                            type="tel"
                            name="customerPhone"
                            className="form-control"
                            id="customerPhone"
                            placeholder="+92 300 1234567"
                            value={formData.customerPhone}
                            onChange={handleChange}
                            required
                          />
                          <label htmlFor="customerPhone">
                            <i className="bi bi-phone me-2"></i>
                            Phone Number *
                          </label>
                        </div>
                      </div>

                      {/* Customer Country */}
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input
                            type="text"
                            name="customerCountry"
                            className="form-control"
                            id="customerCountry"
                            placeholder="Pakistan"
                            value={formData.customerCountry}
                            onChange={handleChange}
                          />
                          <label htmlFor="customerCountry">
                            <i className="bi bi-geo me-2"></i>
                            Country
                          </label>
                        </div>
                      </div>

                      {/* Customer City */}
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input
                            type="text"
                            name="customerCity"
                            className="form-control"
                            id="customerCity"
                            placeholder="Lahore"
                            value={formData.customerCity}
                            onChange={handleChange}
                          />
                          <label htmlFor="customerCity">
                            <i className="bi bi-geo-alt me-2"></i>
                            City
                          </label>
                        </div>
                      </div>

                      {/* Section Title */}
                      <div className="col-12 mt-4">
                        <h6 className="section-title">
                          <i className="bi bi-chat me-2"></i>
                          Inquiry Details
                        </h6>
                        <hr />
                      </div>

                      {/* Inquiry Type */}
                      <div className="col-md-6">
                        <div className="form-floating">
                          <select
                            name="inquiryType"
                            className="form-select"
                            id="inquiryType"
                            value={formData.inquiryType}
                            onChange={handleChange}
                            required
                          >
                            {inquiryTypes.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                          <label htmlFor="inquiryType">
                            <i className="bi bi-tag me-2"></i>
                            Inquiry Type *
                          </label>
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input
                            type="number"
                            name="quantity"
                            className="form-control"
                            id="quantity"
                            placeholder="1"
                            min="1"
                            value={formData.quantity}
                            onChange={handleChange}
                          />
                          <label htmlFor="quantity">
                            <i className="bi bi-box-seam me-2"></i>
                            Quantity
                          </label>
                        </div>
                      </div>

                      {/* Subject */}
                      <div className="col-12">
                        <div className="form-floating">
                          <input
                            type="text"
                            name="subject"
                            className="form-control"
                            id="subject"
                            placeholder="Brief subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                          />
                          <label htmlFor="subject">
                            <i className="bi bi-topic me-2"></i>
                            Subject *
                          </label>
                        </div>
                      </div>

                      {/* Message */}
                      <div className="col-12">
                        <div className="form-floating">
                          <textarea
                            name="message"
                            className="form-control"
                            id="message"
                            placeholder="Write your detailed message here..."
                            style={{ height: "150px" }}
                            value={formData.message}
                            onChange={handleChange}
                            required
                          ></textarea>
                          <label htmlFor="message">
                            <i className="bi bi-chat-dots me-2"></i>
                            Message *
                          </label>
                        </div>
                      </div>

                      {/* Preferred Delivery Date */}
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input
                            type="date"
                            name="preferredDeliveryDate"
                            className="form-control"
                            id="preferredDeliveryDate"
                            value={formData.preferredDeliveryDate}
                            onChange={handleChange}
                          />
                          <label htmlFor="preferredDeliveryDate">
                            <i className="bi bi-calendar me-2"></i>
                            Preferred Delivery Date
                          </label>
                        </div>
                      </div>

                      {/* Terms */}
                      <div className="col-12">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            name="agreeTerms"
                            className="form-check-input"
                            id="agreeTerms"
                            checked={formData.agreeTerms}
                            onChange={handleChange}
                            required
                          />
                          <label className="form-check-label" htmlFor="agreeTerms">
                            I agree that my information will be shared with the business owner
                            to respond to my inquiry. I understand this is a genuine inquiry
                            and not spam.
                          </label>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="col-12">
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg w-100 submit-btn"
                          disabled={submitting}
                        >
                          {submitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              Sending Inquiry...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-send me-2"></i>
                              Send Inquiry
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Trust Badges */}
                <div className="trust-badges text-center mt-4">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="trust-item">
                        <i className="bi bi-shield-check text-success"></i>
                        <span>Secure & Private</span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="trust-item">
                        <i className="bi bi-clock text-primary"></i>
                        <span>Quick Response</span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="trust-item">
                        <i className="bi bi-person-check text-info"></i>
                        <span>Verified Businesses</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <UserFooter />

      {/* ===== STYLES ===== */}
      <style jsx>{`
        /* Hero Section */
        .inquiry-hero {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 60px 0 50px;
          border-bottom: 1px solid #dee2e6;
        }

        .hero-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .hero-title .text-primary {
          color: #0d6efd !important;
        }

        .hero-text {
          font-size: 1.1rem;
          color: #6c757d;
          margin-bottom: 1.5rem;
          max-width: 500px;
        }

        .hero-stats {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
          padding: 0.5rem 1rem;
          border-radius: 50px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .stat-item i {
          font-size: 1.2rem;
        }

        .hero-image-wrapper {
          background: white;
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          text-align: center;
        }

        .hero-image {
          width: 100%;
          height: 300px;
          object-fit: contain;
          border-radius: 12px;
        }

        .hero-image-placeholder {
          height: 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #f8f9fa;
          border-radius: 12px;
          color: #adb5bd;
        }

        .hero-image-placeholder i {
          font-size: 4rem;
        }

        /* Form Section */
        .inquiry-form-section {
          padding: 50px 0 70px;
          background: white;
        }

        .inquiry-form-card {
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.08);
          border: 1px solid #e9ecef;
        }

        .form-header {
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #f8f9fa;
        }

        .form-header-icon {
          width: 50px;
          height: 50px;
          background: #0d6efd;
          color: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin-right: 15px;
        }

        .product-info-card {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 15px 20px;
          margin-bottom: 25px;
          border: 1px solid #e9ecef;
        }

        .product-thumbnail {
          width: 70px;
          height: 70px;
          object-fit: cover;
          border-radius: 8px;
        }

        .product-thumbnail-placeholder {
          width: 70px;
          height: 70px;
          background: #dee2e6;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #adb5bd;
          font-size: 1.5rem;
        }

        .section-title {
          font-weight: 600;
          color: #212529;
        }

        .section-title i {
          color: #0d6efd;
        }

        .form-floating {
          margin-bottom: 5px;
        }

        .form-floating .form-control,
        .form-floating .form-select {
          border-radius: 12px;
          border: 1.5px solid #dee2e6;
          transition: all 0.3s ease;
        }

        .form-floating .form-control:focus,
        .form-floating .form-select:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15);
        }

        .submit-btn {
          border-radius: 12px;
          padding: 15px;
          font-size: 1.1rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(13, 110, 253, 0.3);
        }

        /* Trust Badges */
        .trust-badges {
          padding: 10px 0;
        }

        .trust-item {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          font-size: 0.95rem;
          color: #495057;
        }

        .trust-item i {
          font-size: 1.5rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .inquiry-hero {
            padding: 40px 0 30px;
          }

          .hero-title {
            font-size: 1.8rem;
          }

          .hero-text {
            font-size: 1rem;
          }

          .hero-stats {
            gap: 0.8rem;
          }

          .hero-image-wrapper {
            margin-top: 30px;
          }

          .hero-image {
            height: 200px;
          }

          .inquiry-form-card {
            padding: 20px;
          }

          .trust-item {
            font-size: 0.85rem;
          }
        }

        @media (max-width: 576px) {
          .hero-title {
            font-size: 1.5rem;
          }

          .stat-item {
            font-size: 0.85rem;
            padding: 0.3rem 0.8rem;
          }

          .inquiry-form-card {
            padding: 15px;
          }

          .product-info-card .d-flex {
            flex-wrap: wrap;
          }

          .product-info-card .btn {
            margin-top: 10px;
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}

export default SendInquiry;