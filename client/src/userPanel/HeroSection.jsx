import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import heroBg from "../assets/hero-bg.jpg";
import axios from 'axios';

function HeroSection({ search, setSearch }) {
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
      
      // If business exists and is approved, hide CTA
      if (response.data && response.data.status === "approved") {
        setHasBusiness(true);
      }
    } catch (error) {
      // If no business found or error, show CTA
      console.log("No business account found");
      setHasBusiness(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section
        className="hero-section"
        style={{
          backgroundImage: `
            linear-gradient(rgba(13,110,253,0.75), rgba(11,94,215,0.75)),
            url(${heroBg})
          `,
        }}
      >
        <div className="container text-center">
          <h1 className="fw-bold display-5 mb-3">
            Sialkot Export Mella
          </h1>

          <p className="lead mb-4">
            Premium products from trusted exporters & Connect Global Buyers with Sialkot's Manufacturing
          </p>
          <div className="row justify-content-center">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control form-control-lg shadow"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      <section>
        {/* CTA - Only show if user doesn't have a business account */}
        {!loading && !hasBusiness && (
          <div className="container my-5">
            <div className="row align-items-center bg-light rounded-4 shadow-sm p-4 p-md-5">
              {/* Left Content */}
              <div className="col-md-8 text-center text-md-start">
                <h4 className="fw-bold mb-2">
                  Are you a Manufacturer or Exporter?
                </h4>
                <p className="text-muted mb-0">
                  Register your business on <strong>Sialkot Export Mella</strong> and
                  showcase your products to buyers around the world.
                </p>
              </div>

              {/* Right Button */}
              <div className="col-md-4 text-center text-md-end mt-3 mt-md-0">
                <Link
                  to="/business-register"
                  className="btn btn-primary btn-lg px-5 shadow-sm"
                >
                  Register Your Business
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* If user has a business, show dashboard link instead */}
        {!loading && hasBusiness && (
          <div className="container my-5">
            <div className="row align-items-center bg-success bg-opacity-10 rounded-4 shadow-sm p-4 p-md-5">
              {/* Left Content */}
              <div className="col-md-8 text-center text-md-start">
                <h4 className="fw-bold mb-2 text-success">
                  Welcome to Your Business Dashboard!
                </h4>
                <p className="text-muted mb-0">
                  Manage your products, view inquiries, and grow your business on 
                  <strong> Sialkot Export Mella</strong>.
                </p>
              </div>

              {/* Right Button */}
              <div className="col-md-4 text-center text-md-end mt-3 mt-md-0">
                <Link
                  to="/business-profile"
                  className="btn btn-success btn-lg px-5 shadow-sm"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Famous Products Section */}
        <div className="container my-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Famous Products Made in Sialkot</h2>
            <p className="text-muted">
              Discover world-class products manufactured by skilled exporters in Sialkot
            </p>
          </div>

          <div className="row g-4">
            {/* Football */}
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0 text-center p-4 product-type-card">
                <i className="bi bi-dribbble display-4 text-primary mb-3"></i>
                <h5 className="fw-bold">Football</h5>
                <p className="text-muted">
                  International-standard hand-stitched footballs exported worldwide.
                </p>
                <button 
                  className="btn btn-outline-primary mt-auto"
                  onClick={() => window.location.href = "/products?category=football"}
                >
                  Explore Businesses
                </button>
              </div>
            </div>

            {/* Leather Jackets */}
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0 text-center p-4 product-type-card">
                <i className="bi bi-journal-text display-4 text-primary mb-3"></i>
                <h5 className="fw-bold">Leather Jackets</h5>
                <p className="text-muted">
                  Premium leather garments crafted with excellence and durability.
                </p>
                <button 
                  className="btn btn-outline-primary mt-auto"
                  onClick={() => window.location.href = "/products?category=leather"}
                >
                  Explore Businesses
                </button>
              </div>
            </div>

            {/* Sports Gloves */}
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0 text-center p-4 product-type-card">
                <i className="bi bi-handbag display-4 text-primary mb-3"></i>
                <h5 className="fw-bold">Sports Gloves</h5>
                <p className="text-muted">
                  High-quality boxing, fitness, and industrial gloves.
                </p>
                <button 
                  className="btn btn-outline-primary mt-auto"
                  onClick={() => window.location.href = "/products?category=gloves"}
                >
                  Explore Businesses
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HeroSection;