import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";

function CategoriesPage() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const userId = currentUser?._id || null;

  useEffect(() => {
    // Get category from URL query parameter
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    fetchProducts();
  }, [location.search]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(
        "http://localhost:5000/api/product/public-products"
      );

      if (response.data.success) {
        setProducts(response.data.products);
        setFilteredProducts(response.data.products);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(
          response.data.products
            .filter(p => p.category)
            .map(p => p.category)
        )];
        setCategories(uniqueCategories);
      } else {
        setError(response.data.message || "Failed to fetch products");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let results = [...products];

    // Filter by selected category
    if (selectedCategory) {
      results = results.filter(product => 
        product.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      results = results.filter(product => 
        product.name?.toLowerCase().includes(term) ||
        product.category?.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term) ||
        product.businessDetails?.companyName?.toLowerCase().includes(term)
      );
    }

    // Sorting
    if (sort === "low") {
      results.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sort === "high") {
      results.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }

    setFilteredProducts(results);
  }, [selectedCategory, searchTerm, sort, products]);

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setRating(product.averageRating || 0);
    setUserRating(0);
    setReviewText("");
    
    if (userId && product.ratings) {
      const userExistingRating = product.ratings.find(
        r => r.userId?._id === userId || r.userId === userId
      );
      if (userExistingRating) {
        setUserRating(userExistingRating.rating);
        setReviewText(userExistingRating.review || "");
      }
    }
  };

  const handleSubmitRating = async () => {
    if (!userId) {
      alert("Please login to rate products");
      return;
    }

    if (userRating === 0) {
      alert("Please select a rating");
      return;
    }

    try {
      setSubmittingRating(true);
      
      const response = await axios.post(
        `http://localhost:5000/api/product/rate-product/${selectedProduct._id}`,
        {
          userId: userId,
          rating: userRating,
          review: reviewText,
        }
      );

      if (response.data.success) {
        alert("Rating submitted successfully!");
        setRating(response.data.averageRating);
        
        const updatedProducts = products.map(p => 
          p._id === selectedProduct._id 
            ? { 
                ...p, 
                averageRating: response.data.averageRating,
                totalRatings: response.data.totalRatings,
                ratings: response.data.product.ratings
              }
            : p
        );
        setProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit rating");
    } finally {
      setSubmittingRating(false);
    }
  };

  const renderStars = (ratingValue, interactive = false) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <i
        key={star}
        className={`bi ${
          star <= ratingValue
            ? "bi-star-fill text-warning"
            : "bi-star text-secondary"
        } ${interactive ? 'fs-6' : 'fs-6'} me-1`}
        style={{ 
          cursor: interactive ? "pointer" : "default",
          transition: "all 0.2s",
          fontSize: "14px"
        }}
        onClick={() => interactive && setUserRating(star)}
        onMouseEnter={() => interactive && setUserRating(star)}
      />
    ));
  };

  if (loading) {
    return (
      <>
        <UserHeader />
        <div className="container my-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading products...</p>
        </div>
        <UserFooter />
      </>
    );
  }

  if (error) {
    return (
      <>
        <UserHeader />
        <div className="container my-5">
          <div className="alert alert-danger text-center">
            <i className="bi bi-exclamation-triangle fs-1"></i>
            <h4 className="mt-2">Error Loading Products</h4>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={fetchProducts}>
              Try Again
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

      {/* Header */}
      <section className="bg-primary text-light py-5">
        <div className="container">
          <h1 className="fw-bold mb-3">
            {selectedCategory ? selectedCategory : "All Categories"}
          </h1>
          <p className="opacity-75 fs-5 mb-0">
            {selectedCategory 
              ? `Discover products in ${selectedCategory} category` 
              : "Discover all products by category"}
          </p>
        </div>
      </section>

      <div className="container my-5">
        {/* Search and Filter Bar */}
        <div className="card shadow-sm mb-4 border-0">
          <div className="card-body">
            <div className="row g-3 align-items-end">
              <div className="col-md-4">
                <label className="form-label fw-bold mb-1">
                  <i className="bi bi-search"></i> Search
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button 
                      className="btn btn-outline-secondary" 
                      onClick={() => setSearchTerm("")}
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>
                  )}
                </div>
              </div>

              <div className="col-md-3">
                <label className="form-label fw-bold mb-1">
                  <i className="bi bi-tags"></i> Category
                </label>
                <select
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label fw-bold mb-1">
                  <i className="bi bi-sort"></i> Sort By
                </label>
                <select
                  className="form-select"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="">Default</option>
                  <option value="low">Price: Low → High</option>
                  <option value="high">Price: High → Low</option>
                </select>
              </div>

              <div className="col-md-2">
                <button 
                  className="btn btn-outline-primary w-100"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("");
                    setSort("");
                    // Update URL without category parameter
                    window.history.pushState({}, "", "/categories");
                  }}
                >
                  <i className="bi bi-arrow-clockwise"></i> Reset
                </button>
              </div>
            </div>

            {(searchTerm || selectedCategory || sort) && (
              <div className="mt-3 pt-2 border-top">
                <div className="text-muted">
                  <i className="bi bi-info-circle"></i> 
                  Found <strong>{filteredProducts.length}</strong> products
                  {selectedCategory && <span> in <strong>{selectedCategory}</strong></span>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-box fs-1 text-muted"></i>
            <h5 className="mt-3 text-muted">No products found</h5>
            <p className="text-muted">Try adjusting your search or filters</p>
            <Link to="/categories" className="btn btn-primary">
              View All Categories
            </Link>
          </div>
        ) : (
          <div className="row g-3">
            {filteredProducts.map((product) => (
              <div className="col-6 col-sm-4 col-md-3 col-lg-2 mb-3" key={product._id}>
                <div className="card border-0 shadow-sm h-100 product-card">
                  <div className="card-body p-2">

                    <Link
                      to={`/publicBusinessProfile/${product.businessId?._id}`}
                      className="d-flex align-items-center mb-2 text-decoration-none text-dark"
                    >
                      <div
                        className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-1"
                        style={{ width: "28px", height: "28px", flexShrink: 0, fontSize: "12px" }}
                      >
                        {product.businessDetails?.logo ? (
                          <img 
                            src={`http://localhost:5000/${product.businessDetails.logo}`}
                            alt={product.businessDetails.companyName}
                            style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                          />
                        ) : (
                          <i className="bi bi-building" style={{ fontSize: "12px" }}></i>
                        )}
                      </div>

                      <div style={{ overflow: "hidden" }}>
                        <small className="fw-semibold d-block text-truncate" style={{ fontSize: "11px" }}>
                          {product.businessDetails?.companyName || "Unknown"}
                        </small>
                      </div>
                    </Link>

                    <div
                      className="mb-2 mx-auto bg-light rounded d-flex align-items-center justify-content-center"
                      style={{ width: "100%", height: "80px" }}
                    >
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={`http://localhost:5000/${product.images[0]}`}
                          alt={product.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "6px" }}
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.parentElement.innerHTML = '<i class="bi bi-box-seam text-primary" style="font-size: 24px;"></i>';
                          }}
                        />
                      ) : (
                        <i className="bi bi-box-seam text-primary" style={{ fontSize: "24px" }}></i>
                      )}
                    </div>

                    <h6 className="fw-semibold mb-1 text-center text-truncate" style={{ fontSize: "13px" }}>
                      {product.name}
                    </h6>

                    <div className="text-center mb-1" style={{ fontSize: "12px" }}>
                      {renderStars(Math.round(product.averageRating || 0))}
                      <small className="text-muted ms-1" style={{ fontSize: "10px" }}>
                        ({product.totalRatings || 0})
                      </small>
                    </div>

                    <p className="text-center mb-2 fw-bold text-success" style={{ fontSize: "13px" }}>
                      Rs. {parseFloat(product.price).toLocaleString()}
                    </p>

                    <button
                      className="btn btn-outline-primary btn-sm w-100"
                      style={{ fontSize: "12px", padding: "4px 8px" }}
                      data-bs-toggle="modal"
                      data-bs-target="#categoryProductModal"
                      onClick={() => handleViewProduct(product)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      <div
        className="modal fade"
        id="categoryProductModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow-lg rounded-4">

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

            <div className="modal-body">
              <div className="row">
                <div className="col-md-5 text-center">
                  <div
                    className="bg-light rounded d-flex align-items-center justify-content-center mx-auto shadow-sm"
                    style={{ width: "100%", height: "200px" }}
                  >
                    {selectedProduct?.images && selectedProduct.images.length > 0 ? (
                      <img
                        src={`http://localhost:5000/${selectedProduct.images[0]}`}
                        alt={selectedProduct.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.innerHTML = '<i class="bi bi-box-seam fs-1 text-primary"></i>';
                        }}
                      />
                    ) : (
                      <i className="bi bi-box-seam fs-1 text-primary"></i>
                    )}
                  </div>

                  {selectedProduct?.images && selectedProduct.images.length > 1 && (
                    <div className="mt-2 d-flex gap-2 justify-content-center flex-wrap">
                      {selectedProduct.images.slice(0, 4).map((img, index) => (
                        <img
                          key={index}
                          src={`http://localhost:5000/${img}`}
                          alt={`${selectedProduct.name} ${index + 1}`}
                          style={{ 
                            width: "50px", 
                            height: "50px", 
                            objectFit: "cover", 
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                            cursor: "pointer"
                          }}
                          onClick={() => {
                            const mainImg = document.querySelector('.modal-body .bg-light img');
                            if (mainImg) {
                              mainImg.src = `http://localhost:5000/${img}`;
                            }
                          }}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ))}
                    </div>
                  )}

                  <div className="mt-3">
                    <div className="d-flex justify-content-center align-items-center gap-2">
                      <span className="fw-bold fs-4">
                        {selectedProduct?.averageRating?.toFixed(1) || "0.0"}
                      </span>
                      {renderStars(Math.round(selectedProduct?.averageRating || 0))}
                      <small className="text-muted">
                        ({selectedProduct?.totalRatings || 0} reviews)
                      </small>
                    </div>
                  </div>
                </div>

                <div className="col-md-7">
                  <h4 className="fw-bold mb-2">{selectedProduct?.name}</h4>
                  
                  <p className="fw-bold fs-4 text-primary mb-3">
                    Rs. {parseFloat(selectedProduct?.price || 0).toLocaleString()}
                  </p>

                  <div className="row mb-2">
                    <div className="col-6">
                      <small className="text-muted">Category</small>
                      <p className="mb-1 fw-semibold">{selectedProduct?.category || "N/A"}</p>
                    </div>
                    <div className="col-6">
                      <small className="text-muted">Method</small>
                      <p className="mb-1 fw-semibold">{selectedProduct?.method || "N/A"}</p>
                    </div>
                  </div>

                  <div className="row mb-2">
                    <div className="col-6">
                      <small className="text-muted">Size</small>
                      <p className="mb-1 fw-semibold">{selectedProduct?.size || "N/A"}</p>
                    </div>
                    <div className="col-6">
                      <small className="text-muted">Colors</small>
                      <p className="mb-1 fw-semibold">{selectedProduct?.colors || "N/A"}</p>
                    </div>
                  </div>

                  <div className="row mb-2">
                    <div className="col-6">
                      <small className="text-muted">Available Quantity</small>
                      <p className="mb-1 fw-semibold">
                        <span className={`badge ${selectedProduct?.availableQuantity > 0 ? 'bg-success' : 'bg-danger'}`}>
                          {selectedProduct?.availableQuantity || 0} units
                        </span>
                      </p>
                    </div>
                    <div className="col-6">
                      <small className="text-muted">Company</small>
                      <p className="mb-1 fw-semibold">{selectedProduct?.businessDetails?.companyName || "N/A"}</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted">Description</small>
                    <p className="mb-1">{selectedProduct?.description || "No description available"}</p>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted">Business Details</small>
                    <p className="mb-1">
                      <i className="bi bi-envelope me-1"></i> {selectedProduct?.businessDetails?.email || "N/A"}
                    </p>
                    <p className="mb-1">
                      <i className="bi bi-phone me-1"></i> {selectedProduct?.businessDetails?.phone || "N/A"}
                    </p>
                    {selectedProduct?.businessDetails?.whatsapp && (
                      <p className="mb-1">
                        <i className="bi bi-whatsapp me-1 text-success"></i> {selectedProduct.businessDetails.whatsapp}
                      </p>
                    )}
                  </div>

                  {userId && (
                    <div className="mt-4 pt-3 border-top">
                      <h6 className="fw-bold">Rate this product</h6>
                      
                      <div className="mb-2">
                        {renderStars(userRating, true)}
                        <span className="ms-2 text-muted">
                          {userRating > 0 ? `${userRating} stars` : "Click to rate"}
                        </span>
                      </div>

                      <div className="mb-2">
                        <textarea
                          className="form-control form-control-sm"
                          placeholder="Write a review (optional)"
                          rows="2"
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                        />
                      </div>

                      <button
                        className="btn btn-primary btn-sm"
                        onClick={handleSubmitRating}
                        disabled={submittingRating || userRating === 0}
                      >
                        {submittingRating ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-1"></span>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-star-fill me-1"></i>
                            Submit Rating
                          </>
                        )}
                      </button>

                      {selectedProduct?.ratings && selectedProduct.ratings.length > 0 && (
                        <div className="mt-3">
                          <small className="text-muted">
                            <i className="bi bi-chat-dots me-1"></i>
                            {selectedProduct.ratings.length} reviews
                          </small>
                        </div>
                      )}
                    </div>
                  )}

                  {!userId && (
                    <div className="mt-3 alert alert-info">
                      <i className="bi bi-info-circle me-1"></i>
                      <Link to="/user-login">Login</Link> to rate this product
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer border-0">
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

export default CategoriesPage;