import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import heroBg from "../assets/hero-bg.jpg";
import axios from 'axios';

function HeroSection() {
  const [hasBusiness, setHasBusiness] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkBusinessAccount();
  }, []);

  const checkBusinessAccount = async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:5000/api/business/my-business",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data && response.data.status === "approved") {
        setHasBusiness(true);
      }
    } catch (error) {
      setHasBusiness(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section
        className="hero-section position-relative"
        style={{
          backgroundImage: `
            linear-gradient(135deg, rgba(13, 110, 253, 0.85) 0%, rgba(11, 94, 215, 0.9) 50%, rgba(10, 80, 190, 0.95) 100%),
            url(${heroBg})
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          minHeight: "600px",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated Background Elements */}
        <div className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden" style={{ pointerEvents: "none" }}>
          <div className="position-absolute rounded-circle" style={{
            width: "300px",
            height: "300px",
            background: "rgba(255,255,255,0.05)",
            top: "-100px",
            right: "-50px",
            animation: "float 8s ease-in-out infinite"
          }}></div>
          <div className="position-absolute rounded-circle" style={{
            width: "200px",
            height: "200px",
            background: "rgba(255,255,255,0.03)",
            bottom: "-50px",
            left: "-50px",
            animation: "float 10s ease-in-out infinite reverse"
          }}></div>
          <div className="position-absolute rounded-circle" style={{
            width: "150px",
            height: "150px",
            background: "rgba(255,255,255,0.04)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            animation: "pulse 6s ease-in-out infinite"
          }}></div>
        </div>

        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-lg-7 text-white">
              {/* Badge */}
              <div className="d-inline-block bg-black bg-opacity-20 rounded-pill px-4 py-2 mb-4">
                <i className="bi bi-award-fill me-2"></i>
                <span className="fw-semibold">Pakistan's Export Hub - Sialkot</span>
              </div>

              {/* Main Heading */}
              <h1 className="display-3 fw-bold mb-4">
                Sialkot Export <br />
                <span className="text-warning">Mella</span>
              </h1>

              {/* Description */}
              <p className="lead mb-4 opacity-90" style={{ fontSize: "1.25rem", maxWidth: "550px" }}>
                Premium products from trusted exporters. Connect Global Buyers with Sialkot's Manufacturing Excellence.
              </p>

              {/* Stats */}
              <div className="d-flex flex-wrap gap-4 mb-4">
                <div>
                  <h3 className="fw-bold text-white mb-0">100+</h3>
                  <small className="opacity-75">Trusted Exporters From Sialkot</small>
                </div>
                <div>
                  <h3 className="fw-bold text-white mb-0">1000+</h3>
                  <small className="opacity-75">Premium Products</small>
                </div>
                {/* <div>
                  <h3 className="fw-bold text-white mb-0">50+</h3>
                  <small className="opacity-75">Export Countries</small>
                </div> */}
              </div>

              {/* CTA Buttons */}
              {/* <div className="d-flex flex-wrap gap-3">
                <Link
                  to="/products"
                  className="btn btn-warning btn-lg px-5 shadow-lg"
                  style={{ fontWeight: "600" }}
                >
                  <i className="bi bi-grid-3x3-gap-fill me-2"></i>
                  Explore Products
                </Link>
                <Link
                  to="/business-register"
                  className="btn btn-outline-light btn-lg px-5"
                  style={{ fontWeight: "600" }}
                >
                  <i className="bi bi-building me-2"></i>
                  Join as Exporter
                </Link>
              </div> */}
            </div>

            {/* Right Side - Image/Illustration */}
            <div className="col-lg-5 d-none d-lg-block">
              <div className="position-relative">
                <div className="bg-white bg-opacity-10 rounded-4 p-4 backdrop-blur">
                  <div className="d-flex flex-column gap-3">
                    <div className="bg-white bg-opacity-20 rounded-3 p-3 d-flex align-items-center">
                      <div className="bg-warning rounded-circle p-2 me-3">
                        <i className="bi bi-box-seam text-dark"></i>
                      </div>
                      <div>
                        <h6 className="text-black mb-0 fw-bold">Quality Products</h6>
                        <small className="text-black-50">Premium manufacturing</small>
                      </div>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-3 p-3 d-flex align-items-center">
                      <div className="bg-success rounded-circle p-2 me-3">
                        <i className="bi bi-globe2 text-white"></i>
                      </div>
                      <div>
                        <h6 className="text-black mb-0 fw-bold">Global Reach</h6>
                        <small className="text-black-50">Export worldwide</small>
                      </div>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-3 p-3 d-flex align-items-center">
                      <div className="bg-info rounded-circle p-2 me-3">
                        <i className="bi bi-people text-white"></i>
                      </div>
                      <div>
                        <h6 className="text-black mb-0 fw-bold">Trusted Network</h6>
                        <small className="text-black-50">Verified exporters</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="position-absolute bottom-0 start-0 w-100" style={{ zIndex: 1 }}>
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60 C360 120 720 0 1080 60 C1260 90 1380 75 1440 60 L1440 120 L0 120 Z" fill="#f8f9fa" />
          </svg>
        </div>
      </section>

      {/* CTA Section - Only show if user doesn't have a business account */}
      {!loading && !hasBusiness && (
        <section className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-7">
                <h3 className="fw-bold mb-2">
                  <i className="bi bi-rocket-takeoff text-primary me-2"></i>
                  Are you a Manufacturer or Exporter?
                </h3>
                <p className="text-muted mb-0">
                  Register your business on <strong>Sialkot Export Mella</strong> and
                  showcase your products to buyers around the world. Join 100+ trusted exporters today!
                </p>
              </div>
              <div className="col-lg-5 text-lg-end mt-3 mt-lg-0">
                <Link
                  to="/business-register"
                  className="btn btn-primary btn-lg px-5 shadow"
                >
                  <i className="bi bi-building-add me-2"></i>
                  Register Your Business
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Business Dashboard CTA */}
      {!loading && hasBusiness && (
        <section className="py-5" style={{ backgroundColor: "#e8f5e9" }}>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-7">
                <h3 className="fw-bold text-success mb-2">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  Welcome to Your Business Dashboard!
                </h3>
                <p className="text-muted mb-0">
                  Manage your products, view inquiries, and grow your business on 
                  <strong> Sialkot Export Mella</strong>.
                </p>
              </div>
              <div className="col-lg-5 text-lg-end mt-3 mt-lg-0">
                <Link
                  to="/business-profile"
                  className="btn btn-success btn-lg px-5 shadow"
                >
                  <i className="bi bi-speedometer2 me-2"></i>
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Famous Products Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold display-6">
              {/* <i className="bi bi-star-fill text-warning me-2"></i> */}
              Famous Products Made in Sialkot
            </h2>
            <p className="text-muted">
              Discover world-class products manufactured by skilled exporters in Sialkot
            </p>
          </div>

          <div className="row g-4">
            {/* Football */}
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0 text-center p-4 product-type-card" style={{ transition: "transform 0.3s ease" }}>
                <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: "80px", height: "80px" }}>
                  <i className="bi bi-dribbble display-4 text-primary"></i>
                </div>
                <h5 className="fw-bold">Football</h5>
                <p className="text-muted">
                  International-standard hand-stitched footballs exported worldwide.
                </p>
                <button 
                  className="btn btn-outline-primary mt-auto"
                  onClick={() => window.location.href = "/products?category=football"}
                >
                  Explore Businesses
                  <i className="bi bi-arrow-right ms-2"></i>
                </button>
              </div>
            </div>

            {/* Leather Jackets */}
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0 text-center p-4 product-type-card" style={{ transition: "transform 0.3s ease" }}>
                <div className="bg-warning bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: "80px", height: "80px" }}>
                  <i className="bi bi-journal-text display-4 text-warning"></i>
                </div>
                <h5 className="fw-bold">Leather Jackets</h5>
                <p className="text-muted">
                  Premium leather garments crafted with excellence and durability.
                </p>
                <button 
                  className="btn btn-outline-warning mt-auto"
                  onClick={() => window.location.href = "/products?category=leather"}
                >
                  Explore Businesses
                  <i className="bi bi-arrow-right ms-2"></i>
                </button>
              </div>
            </div>

            {/* Sports Gloves */}
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0 text-center p-4 product-type-card" style={{ transition: "transform 0.3s ease" }}>
                <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: "80px", height: "80px" }}>
                  <i className="bi bi-handbag display-4 text-success"></i>
                </div>
                <h5 className="fw-bold">Sports Gloves</h5>
                <p className="text-muted">
                  High-quality boxing, fitness, and industrial gloves.
                </p>
                <button 
                  className="btn btn-outline-success mt-auto"
                  onClick={() => window.location.href = "/products?category=gloves"}
                >
                  Explore Businesses
                  <i className="bi bi-arrow-right ms-2"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add CSS animations */}
      <style jsx="true">{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.04; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.08; }
        }
        
        .product-type-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .product-type-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
        }
        
        .backdrop-blur {
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
      `}</style>
    </>
  );
}

export default HeroSection;