import React, { useState } from "react";
import {Link} from 'react-router-dom';
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";
import HeroSection from "./HeroSection";

function Home() {
  const [sort, setSort] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const products = [
    {
      id: 1,
      name: "Leather Ball",
      price: 120,
      category: "Sports",
      company: "Sialkot Sports Co.",
      description:
        "Premium quality leather ball manufactured in Sialkot, Pakistan.",
    },
    {
      id: 2,
      name: "Soft Tennis Ball",
      price: 60,
      category: "Sports",
      company: "Elite Sports Factory",
      description:
        "Durable soft tennis ball suitable for training and practice.",
    },
    {
      id: 3,
      name: "Leather Gloves",
      price: 140,
      category: "Accessories",
      company: "Pak Leather Works",
      description:
        "High-quality leather gloves for professional sports use.",
    },
    {
      id: 4,
      name: "Cricket Bat",
      price: 450,
      category: "Cricket",
      company: "Champion Cricket Gear",
      description:
        "Grade A English willow cricket bat with excellent balance.",
    },
    {
      id: 5,
      name: "Football",
      price: 200,
      category: "Sports",
      company: "Global Sports Pvt Ltd",
      description:
        "FIFA standard football with strong grip and durability.",
    },
  ];

  // Sort by price
  let filteredProducts = [...products];
  if (sort === "low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sort === "high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <>
      <UserHeader />
      <HeroSection />

      {/* Products Section */}
      <div className="container my-5">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <h4 className="fw-bold mb-0">Featured Products</h4>

          <select
            className="form-select w-auto shadow-sm"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Sort by Price</option>
            <option value="low">Low → High</option>
            <option value="high">High → Low</option>
          </select>
        </div>

        <div className="row">
          {filteredProducts.map((product) => (
            <div className="col-6 col-sm-4 col-lg-3 mb-4" key={product.id}>
              <div className="card border-0 shadow-sm h-100 product-card">
                <div className="card-body p-4">

                  {/* Company Info */}
                  <Link
                    to=""
                    className="d-flex align-items-center mb-3 text-decoration-none text-dark company-link"
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
                      <small className="text-muted">
                        Verified Seller
                      </small>
                    </div>
                  </Link>

                  {/* Product Icon */}
                  <div
                    className="mb-3 mx-auto bg-light rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <i className="bi bi-box-seam fs-2 text-primary"></i>
                  </div>

                  <h6 className="fw-semibold mb-1 text-center">
                    {product.name}
                  </h6>

                  <p className="text-muted text-center mb-3">
                    ${product.price}
                  </p>

                  <button
                    className="btn btn-outline-primary btn-sm w-100"
                    data-bs-toggle="modal"
                    data-bs-target="#productModal"
                    onClick={() => setSelectedProduct(product)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Details Modal */}
      <div
        className="modal fade"
        id="productModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {selectedProduct?.name}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body text-center">
              <div
                className="mb-3 bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto"
                style={{ width: "100px", height: "100px" }}
              >
                <i className="bi bi-box-seam fs-1 text-primary"></i>
              </div>

              <p className="fw-bold mb-1">
                Price: ${selectedProduct?.price}
              </p>

              <p className="text-muted mb-1">
                Category: {selectedProduct?.category}
              </p>

              <p className="text-muted mb-1">
                Company: {selectedProduct?.company}
              </p>

              <p className="small text-secondary mt-2">
                {selectedProduct?.description}
              </p>
            </div>

            <div className="modal-footer">
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

export default Home;
