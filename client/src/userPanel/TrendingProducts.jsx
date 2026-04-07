import React, { useState } from "react";
import { Link } from "react-router-dom";
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";

function TrendingProducts() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(0);

  const trendingProducts = [
    {
      id: 1,
      name: "Sports Gloves",
      price: 4500,
      rating: 4.8,
      tag: "Hot",
      company: "Sialkot Sports Co.",
      description:
        "Premium sports gloves made with export-quality leather from Sialkot.",
    },
    {
      id: 2,
      name: "Leather Jacket",
      price: 18500,
      rating: 4.7,
      tag: "Trending",
      company: "Pak Leather Works",
      description:
        "Stylish and durable leather jacket suitable for international markets.",
    },
    {
      id: 3,
      name: "Cricket Bat",
      price: 12000,
      rating: 4.9,
      tag: "Best Seller",
      company: "Champion Cricket Gear",
      description:
        "Handcrafted cricket bat made from high-grade willow wood.",
    },
    {
      id: 4,
      name: "Football",
      price: 3500,
      rating: 4.6,
      tag: "Popular",
      company: "Global Sports Pvt Ltd",
      description:
        "FIFA-standard football designed for professional and training use.",
    },
    {
      id: 5,
      name: "Surgical Instruments Set",
      price: 22000,
      rating: 4.8,
      tag: "Export Quality",
      company: "MedTech Instruments",
      description:
        "Precision surgical instruments set used by medical professionals.",
    },
    {
      id: 6,
      name: "Gym Accessories",
      price: 7800,
      rating: 4.5,
      tag: "New",
      company: "Elite Fitness Gear",
      description:
        "Complete gym accessories kit for home and professional workouts.",
    },
  ];

  return (
    <>
      <UserHeader />

      {/* Header */}
      <section className="bg-primary text-light py-5">
        <div className="container text-center">
          <h1 className="fw-bold mb-3">Trending Products</h1>
          <p className="opacity-75 fs-5 mb-4">
            Discover the most popular products from Sialkot exporters
          </p>
          <span className="bg-light" style={{ width: "70px", height: "3px", display: "inline-block" }}></span>
        </div>
      </section>

      {/* CTA */}
      <div className="container my-5">
        <div className="row align-items-center bg-light rounded-4 shadow-sm p-4 p-md-5">
          <div className="col-md-8 text-center text-md-start">
            <h4 className="fw-bold mb-2">
              Are you a Manufacturer or Exporter?
            </h4>
            <p className="text-muted mb-0">
              Register your business on <strong>Sialkot Export Mella</strong> and
              showcase your products worldwide.
            </p>
          </div>

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

      {/* Products */}
      <section className="container my-5">
        <div className="row">
          {trendingProducts.map((product) => (
            <div className="col-xl-3 col-lg-3 col-md-6 mb-4" key={product.id}>
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">

                  {/* Company */}
                  <Link
                    to=""
                    className="d-flex align-items-center mb-3 text-decoration-none text-dark"
                  >
                    <div
                      className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2"
                      style={{ width: "36px", height: "36px" }}
                    >
                      <i className="bi bi-building"></i>
                    </div>

                    <div>
                      <small className="fw-semibold d-block">
                        {product.company}
                      </small>
                      <small className="text-muted">Verified Seller</small>
                    </div>
                  </Link>

                  {/* Tag */}
                  <span className="badge bg-danger mb-3">
                    {product.tag}
                  </span>

                  {/* Icon */}
                  <div className="text-center mb-3">
                    <i className="bi bi-box-seam fs-1 text-primary"></i>
                  </div>

                  <h5 className="fw-semibold text-center">
                    {product.name}
                  </h5>

                  <p className="text-muted text-center mb-2">
                    Rs {product.price.toLocaleString()}
                  </p>

                  <div className="d-flex justify-content-center align-items-center mb-3">
                    <i className="bi bi-star-fill text-warning me-1"></i>
                    <span>{product.rating}</span>
                  </div>

                  <button
                    className="btn btn-outline-primary w-100"
                    data-bs-toggle="modal"
                    data-bs-target="#trendingModal"
                    onClick={() => {
                      setSelectedProduct(product);
                      setRating(0);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal */}
      <div
        className="modal fade"
        id="trendingModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow-lg rounded-4">

            {/* Header */}
            <div className="modal-header border-0">
              <h5 className="modal-title fw-bold">
                {selectedProduct?.name}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            {/* Body */}
            <div className="modal-body">
              <div className="row align-items-center">

                {/* Left */}
                <div className="col-md-5 text-center">
                  <div
                    className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto shadow-sm"
                    style={{ width: "140px", height: "140px" }}
                  >
                    <i className="bi bi-box-seam fs-1 text-primary"></i>
                  </div>
                </div>

                {/* Right */}
                <div className="col-md-7">
                  <p className="fw-bold fs-5 text-primary">
                    Rs {selectedProduct?.price?.toLocaleString()}
                  </p>

                  <p className="mb-1">
                    <strong>Company:</strong> {selectedProduct?.company}
                  </p>

                  <p className="mb-1">
                    <strong>Tag:</strong> {selectedProduct?.tag}
                  </p>

                  <p className="small text-muted mt-2">
                    {selectedProduct?.description}
                  </p>

                  {/* Rating UI */}
                  <div className="mt-3">
                    <strong>Rate this product:</strong>
                    <div className="mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i
                          key={star}
                          className={`bi ${
                            star <= rating
                              ? "bi-star-fill text-warning"
                              : "bi-star text-secondary"
                          } fs-4 me-1`}
                          style={{ cursor: "pointer" }}
                          onClick={() => setRating(star)}
                        ></i>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer border-0 d-flex justify-content-between">
              <button
                className="btn btn-outline-primary"
                onClick={() => alert(`You rated ${rating} stars ⭐`)}
              >
                Submit Rating
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      </div>

      <UserFooter />
    </>
  );
}

export default TrendingProducts;