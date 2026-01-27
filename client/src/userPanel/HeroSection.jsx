import React from "react";
import { Link } from "react-router-dom";
import heroBg from "../assets/hero-bg.jpg";

function HeroSection({ search, setSearch }) {
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
                // onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/*  */}
      <section>
        {/* CTA */}
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
                <button className="btn btn-outline-primary mt-auto">
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
                <button className="btn btn-outline-primary mt-auto">
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
                <button className="btn btn-outline-primary mt-auto">
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
