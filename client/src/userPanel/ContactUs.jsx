import React, { useState } from "react";
import axios from "axios";
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";

function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://localhost:5000/api/contact", form);
      
      if (response.data.success) {
        setSuccess("✅ Your message has been sent successfully! We'll get back to you soon.");
        setForm({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
        setTimeout(() => setSuccess(""), 6000);
      }
    } catch (err) {
      setError("❌ Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <UserHeader />

      {/* Hero Section with Gradient */}
      <section className="position-relative" style={{ 
        background: "linear-gradient(135deg, #0d6efd 0%, #0d6efd 100%)",
        padding: "80px 0 60px",
        overflow: "hidden"
      }}>
        <div className="container position-relative">
          <div className="row justify-content-center text-center"> 
            <div className="col-lg-8">
              <div className="mb-4">
                <span className="badge bg-light text-primary px-4 py-2 rounded-pill fw-bold">
                  <i className="bi bi-chat-dots me-2"></i> Contact Us
                </span>
              </div>
              <h1 className="display-3 fw-bold text-white mb-3">
                Get In Touch
              </h1>
              <p className="lead text-white-50 mb-0">
                We'd love to hear from you. Our team is always ready to help.
              </p>
            </div>
          </div>
        </div>
        {/* Decorative Elements */}
        <div style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "200px",
          height: "200px",
          background: "rgba(255,255,255,0.05)",
          borderRadius: "50%"
        }}></div>
        <div style={{
          position: "absolute",
          bottom: "-80px",
          left: "-30px",
          width: "300px",
          height: "300px",
          background: "rgba(255,255,255,0.03)",
          borderRadius: "50%"
        }}></div>
      </section>

      {/* Alert Messages */}
      {success && (
        <div className="container mt-4">
          <div className="alert alert-success alert-dismissible fade show border-0 shadow-sm" role="alert">
            <div className="d-flex align-items-center">
              <i className="bi bi-check-circle-fill fs-4 me-3"></i>
              <div>
                <strong>Success!</strong> {success}
              </div>
              <button type="button" className="btn-close ms-auto" onClick={() => setSuccess("")}></button>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="container mt-4">
          <div className="alert alert-danger alert-dismissible fade show border-0 shadow-sm" role="alert">
            <div className="d-flex align-items-center">
              <i className="bi bi-exclamation-circle-fill fs-4 me-3"></i>
              <div>
                <strong>Error!</strong> {error}
              </div>
              <button type="button" className="btn-close ms-auto" onClick={() => setError("")}></button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Cards */}
      <div className="container mt-4">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <div className="card border-0 shadow-sm h-100 text-center p-4 hover-card" style={{ transition: "all 0.3s ease" }}>
              <div className="card-body">
                <div className="icon-wrapper bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" 
                  style={{ width: "70px", height: "70px" }}>
                  <i className="bi bi-geo-alt fs-2 text-primary"></i>
                </div>
                <h5 className="fw-bold mb-2">Visit Us</h5>
                <p className="text-muted mb-0">
                  1-Km Main, 1.5 Km main Daska Rd, <br />
                  Sialkot, 51040, Pakistan
                </p>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="card border-0 shadow-sm h-100 text-center p-4 hover-card" style={{ transition: "all 0.3s ease" }}>
              <div className="card-body">
                <div className="icon-wrapper bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" 
                  style={{ width: "70px", height: "70px" }}>
                  <i className="bi bi-telephone fs-2 text-success"></i>
                </div>
                <h5 className="fw-bold mb-2">Call Us</h5>
                <p className="text-muted mb-0">
                  <a href="tel:+923190222174" className="text-decoration-none text-muted">
                    +92 319 0222 174
                  </a>
                </p>
                <small className="text-muted">Mon-Fri, 9AM - 6PM</small>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="card border-0 shadow-sm h-100 text-center p-4 hover-card" style={{ transition: "all 0.3s ease" }}>
              <div className="card-body">
                <div className="icon-wrapper bg-info bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" 
                  style={{ width: "70px", height: "70px" }}>
                  <i className="bi bi-envelope fs-2 text-info"></i>
                </div>
                <h5 className="fw-bold mb-2">Email Us</h5>
                <p className="text-muted mb-0">
                  <a href="mailto:iamahmadshahzad228576@gmail.com" className="text-decoration-none text-muted">
                    iamahmadshahzad228576@gmail.com
                  </a>
                </p>
                <small className="text-muted">We'll respond within 24 hours</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form and Map Section */}
      <div className="container my-5">
        <div className="row g-4">
          {/* Map */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100 overflow-hidden">
              <div className="card-header bg-white border-0 pt-4 pb-0">
                <h5 className="fw-bold mb-0">
                  <i className="bi bi-map me-2 text-primary"></i> Find Us
                </h5>
              </div>
              <div className="card-body p-0">
                <iframe 
                  title="map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3366.256350276577!2d74.51149557549113!3d32.46583447379515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391ec1fa58d5be41%3A0x4798a62d873730fd!2sUniversity%20of%20Sialkot!5e0!3m2!1sen!2s!4v1767015719291!5m2!1sen!2s"
                  style={{ width: "100%", height: "450px", border: 0 }}
                  allowFullScreen="" 
                  loading="lazy" 
                  className="rounded-bottom"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 pt-4">
                <h5 className="fw-bold mb-0">
                  <i className="bi bi-send me-2 text-primary"></i> Send Us a Message
                </h5>
                <p className="text-muted small mb-0 mt-1">
                  Fill in the form below and we'll get back to you as soon as possible.
                </p>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Full Name</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-0">
                          <i className="bi bi-person text-muted"></i>
                        </span>
                        <input
                          type="text"
                          name="name"
                          className="form-control border-0 bg-light"
                          placeholder="John Doe"
                          value={form.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Email Address</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-0">
                          <i className="bi bi-envelope text-muted"></i>
                        </span>
                        <input
                          type="email"
                          name="email"
                          className="form-control border-0 bg-light"
                          placeholder="john@example.com"
                          value={form.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold small">Subject</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-0">
                          <i className="bi bi-tag text-muted"></i>
                        </span>
                        <input
                          type="text"
                          name="subject"
                          className="form-control border-0 bg-light"
                          placeholder="How can we help?"
                          value={form.subject}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold small">Message</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-0 align-items-start pt-3">
                          <i className="bi bi-chat text-muted"></i>
                        </span>
                        <textarea
                          name="message"
                          className="form-control border-0 bg-light"
                          rows="5"
                          placeholder="Write your message here..."
                          value={form.message}
                          onChange={handleChange}
                          required
                        ></textarea>
                      </div>
                    </div>

                    <div className="col-12 mt-4">
                      <button 
                        className="btn btn-primary w-100 py-2 fw-bold"
                        type="submit"
                        disabled={loading}
                        style={{ 
                          background: "linear-gradient(135deg, #0d6efd 0%, #0d6efd 100%)",
                          border: "none",
                          transition: "all 0.3s ease"
                        }}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Sending...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-send me-2"></i>
                            Send Message
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Section */}
      <div className="container mb-5">
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-4">
            <h6 className="text-muted text-uppercase fw-bold small mb-3">Connect With Us</h6>
            <div className="d-flex justify-content-center gap-3">
              <a href="#" className="btn btn-outline-primary rounded-circle" style={{ width: "50px", height: "50px" }}>
                <i className="bi bi-facebook fs-5"></i>
              </a>
              <a href="#" className="btn btn-outline-info rounded-circle" style={{ width: "50px", height: "50px" }}>
                <i className="bi bi-twitter fs-5"></i>
              </a>
              <a href="#" className="btn btn-outline-danger rounded-circle" style={{ width: "50px", height: "50px" }}>
                <i className="bi bi-instagram fs-5"></i>
              </a>
              <a href="#" className="btn btn-outline-primary rounded-circle" style={{ width: "50px", height: "50px" }}>
                <i className="bi bi-linkedin fs-5"></i>
              </a>
              <a href="#" className="btn btn-outline-success rounded-circle" style={{ width: "50px", height: "50px" }}>
                <i className="bi bi-whatsapp fs-5"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for hover effects */}
      <style jsx>{`
        .hover-card {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .hover-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
        }
        .icon-wrapper {
          transition: all 0.3s ease;
        }
        .hover-card:hover .icon-wrapper {
          transform: scale(1.1);
        }
        .btn-primary {
          transition: all 0.3s ease;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }
        .form-control:focus {
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          border-color: #667eea;
        }
      `}</style>

      <UserFooter />
    </>
  );
}

export default ContactUs;