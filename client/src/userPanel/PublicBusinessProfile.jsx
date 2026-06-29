import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";

function PublicBusinessProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBusinessData();
    } else {
      setError("Business ID not found");
      setLoading(false);
    }
  }, [id]);

  const fetchBusinessData = async () => {
    try {
      setLoading(true);
      setError(null);

      const businessResponse = await axios.get(
        `http://localhost:5000/api/business/business/${id}`
      );

      if (businessResponse.data.success) {
        setBusiness(businessResponse.data.business);
      } else {
        setError("Business not found");
        return;
      }

      try {
        const productsResponse = await axios.get(
          `http://localhost:5000/api/product/products/${id}`
        );

        if (productsResponse.data.success) {
          setProducts(productsResponse.data.products);
        }
      } catch (productError) {
        setProducts([]);
      }

    } catch (err) {
      console.error("Error fetching business data:", err);
      setError(err.response?.data?.message || "Failed to load business profile");
    } finally {
      setLoading(false);
    }
  };

  const openImageGallery = (product, imageIndex = 0) => {
    setSelectedProduct(product);
    setSelectedImage(imageIndex);
    setShowImageModal(true);
  };

  const closeImageGallery = () => {
    setShowImageModal(false);
    setSelectedProduct(null);
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedProduct && selectedProduct.images) {
      const nextIndex = (selectedImage + 1) % selectedProduct.images.length;
      setSelectedImage(nextIndex);
    }
  };

  const prevImage = () => {
    if (selectedProduct && selectedProduct.images) {
      const prevIndex = (selectedImage - 1 + selectedProduct.images.length) % selectedProduct.images.length;
      setSelectedImage(prevIndex);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) - fullStars >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<i key={i} className="bi bi-star-fill text-warning"></i>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<i key={i} className="bi bi-star-half text-warning"></i>);
      } else {
        stars.push(<i key={i} className="bi bi-star text-secondary"></i>);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <>
        <UserHeader />
        <div className="container my-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading business profile...</p>
        </div>
        <UserFooter />
      </>
    );
  }

  if (error || !business) {
    return (
      <>
        <UserHeader />
        <div className="container my-5">
          <div className="alert alert-danger text-center">
            <i className="bi bi-exclamation-triangle fs-1"></i>
            <h4 className="mt-2">Business Not Found</h4>
            <p>{error || "The business you're looking for doesn't exist."}</p>
            <Link to="/" className="btn btn-primary">
              <i className="bi bi-arrow-left me-2"></i>
              Go Back Home
            </Link>
          </div>
        </div>
        <UserFooter />
      </>
    );
  }

  return (
    <>
      <UserHeader />

      {/* HERO / HEADER */}
      <section className="bg-primary text-light py-5">
        <div className="container">
          <div className="d-flex align-items-center">
            <div className="logo-circle me-4">
              {business.logo ? (
                <img
                  src={`http://localhost:5000/${business.logo}`}
                  alt={business.companyName}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />
              ) : (
                <span className="fs-1 fw-bold text-white opacity-50">
                  {business.companyName?.charAt(0) || "B"}
                </span>
              )}
            </div>
            <div>
              <h2 className="fw-bold mb-1">{business.companyName}</h2>
              <p className="mb-2 opacity-75">
                <i className="bi bi-geo-alt me-1"></i>
                {business.factoryAddress || "Sialkot, Pakistan"}
              </p>
              <div className="d-flex flex-wrap gap-2">
                <span className="badge bg-success">
                  <i className="bi bi-patch-check-fill me-1"></i>
                  Verified Exporter
                </span>
                <span className="badge bg-light text-dark">
                  <i className="bi bi-flag me-1"></i>
                  Made in Pakistan 🇵🇰
                </span>
                {business.status === "approved" && (
                  <span className="badge bg-info">
                    <i className="bi bi-check-circle me-1"></i>
                    Approved
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="container my-5">
        <div className="row">
          {/* LEFT CONTENT */}
          <div className="col-lg-8">
            {/* ABOUT */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body">
                <h5 className="fw-bold mb-3">
                  <i className="bi bi-building me-2 text-primary"></i>
                  About Company
                </h5>
                <p className="text-muted">
                  {business.description || "No description provided."}
                </p>

                <div className="row mt-3">
                  <div className="col-md-6">
                    <p>
                      <strong>Established:</strong>{" "}
                      {business.yearEstablished || "N/A"}
                    </p>
                    <p>
                      <strong>Location:</strong>{" "}
                      {business.factoryAddress || "N/A"}
                    </p>
                    <p>
                      <strong>Category:</strong>{" "}
                      <span className="badge bg-secondary">
                        {business.category || "N/A"}
                      </span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p>
                      <strong>Member ID:</strong>{" "}
                      <span className="badge bg-info text-dark">
                        {business.memberId || "N/A"}
                      </span>
                    </p>
                    {business.products && (
                      <p>
                        <strong>Products:</strong>{" "}
                        <span className="text-muted">{business.products}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* PRODUCTS */}
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white">
                <h5 className="fw-bold mb-0">
                  <i className="bi bi-box-seam me-2 text-primary"></i>
                  Products ({products.length})
                </h5>
              </div>

              <div className="card-body">
                {products.length === 0 ? (
                  <div className="text-center text-muted py-4">
                    <i className="bi bi-box fs-1"></i>
                    <p className="mt-2">No products available from this business</p>
                  </div>
                ) : (
                  <div className="row g-4">
                    {products.map((p) => (
                      <div className="col-md-6" key={p._id}>
                        <div className="card h-100 product-card border-0 shadow-sm">
                          {/* PRODUCT IMAGE GALLERY */}
                          <div className="product-image position-relative">
                            {p.images && p.images.length > 0 ? (
                              <>
                                {/* Main Image */}
                                <div 
                                  className="position-relative"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => openImageGallery(p, 0)}
                                >
                                  <img
                                    src={`http://localhost:5000/${p.images[0]}`}
                                    alt={p.name}
                                    style={{
                                      width: "100%",
                                      height: "200px",
                                      objectFit: "cover",
                                      borderTopLeftRadius: "8px",
                                      borderTopRightRadius: "8px",
                                    }}
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                      e.target.parentElement.innerHTML = `
                                        <div class="d-flex align-items-center justify-content-center" 
                                             style="height:200px; background:#f8f9fa; border-top-left-radius:8px; border-top-right-radius:8px;">
                                          <i class="bi bi-image fs-1 text-muted"></i>
                                        </div>
                                      `;
                                    }}
                                  />
                                  {/* Image count overlay */}
                                  {p.images.length > 1 && (
                                    <div 
                                      className="position-absolute bottom-0 end-0 m-2 bg-dark bg-opacity-75 text-white px-2 py-1 rounded"
                                      style={{ fontSize: "12px" }}
                                    >
                                      <i className="bi bi-images me-1"></i>
                                      {p.images.length} images
                                    </div>
                                  )}
                                </div>

                                {/* Thumbnail Gallery */}
                                {p.images.length > 1 && (
                                  <div className="d-flex gap-1 p-2 bg-light" style={{ borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px" }}>
                                    {p.images.slice(0, 4).map((img, index) => (
                                      <div
                                        key={index}
                                        className="rounded"
                                        style={{
                                          width: "50px",
                                          height: "50px",
                                          cursor: "pointer",
                                          overflow: "hidden",
                                          border: index === 0 ? "2px solid #0d6efd" : "1px solid #ddd",
                                        }}
                                        onClick={() => openImageGallery(p, index)}
                                      >
                                        <img
                                          src={`http://localhost:5000/${img}`}
                                          alt={`${p.name} ${index + 1}`}
                                          style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                          }}
                                          onError={(e) => {
                                            e.target.style.display = "none";
                                          }}
                                        />
                                      </div>
                                    ))}
                                    {p.images.length > 4 && (
                                      <div
                                        className="rounded d-flex align-items-center justify-content-center bg-light"
                                        style={{
                                          width: "50px",
                                          height: "50px",
                                          cursor: "pointer",
                                          border: "1px solid #ddd",
                                          fontSize: "12px",
                                          fontWeight: "bold",
                                          color: "#666",
                                        }}
                                        onClick={() => openImageGallery(p, 4)}
                                      >
                                        +{p.images.length - 4}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </>
                            ) : (
                              <div
                                className="d-flex align-items-center justify-content-center"
                                style={{
                                  height: "200px",
                                  background: "#f8f9fa",
                                  borderTopLeftRadius: "8px",
                                  borderTopRightRadius: "8px",
                                }}
                              >
                                <i className="bi bi-image fs-1 text-muted"></i>
                              </div>
                            )}
                            <span className="badge bg-primary position-absolute top-0 end-0 m-2">
                              {p.category || "Product"}
                            </span>
                          </div>

                          <div className="card-body">
                            {/* Product Code */}
                            <div className="mb-2">
                              <span className="badge bg-primary" style={{ fontSize: "11px" }}>
                                <i className="bi bi-tag me-1"></i>
                                {p.productCode || "N/A"}
                              </span>
                            </div>

                            <h6 className="fw-bold">{p.name}</h6>
                            <p className="text-muted small mb-2">
                              {p.description || "No description available"}
                            </p>

                            <ul className="list-unstyled small mb-3">
                              {p.size && (
                                <li>
                                  <strong>Size:</strong> {p.size}
                                </li>
                              )}
                              {p.colors && (
                                <li>
                                  <strong>Color:</strong> {p.colors}
                                </li>
                              )}
                              {p.method && (
                                <li>
                                  <strong>Method:</strong> {p.method}
                                </li>
                              )}
                              {p.availableQuantity !== undefined && (
                                <li>
                                  <strong>Available:</strong>{" "}
                                  {p.availableQuantity} units
                                </li>
                              )}
                            </ul>

                            {/* Rating Display */}
                            <div className="mb-2">
                              <div className="d-flex align-items-center gap-1">
                                {renderStars(p.averageRating || 0)}
                                <span className="text-muted small">
                                  ({p.totalRatings || 0} reviews)
                                </span>
                              </div>
                            </div>

                            <div className="d-flex justify-content-between align-items-center">
                              <span className="fw-bold text-success fs-5">
                                Rs. {parseFloat(p.price || 0).toLocaleString()}
                              </span>
                              <Link
                                to={`/sendInquiry?product=${p._id}`}
                                className="btn btn-outline-primary btn-sm"
                              >
                                <i className="bi bi-envelope me-1"></i>
                                Send Inquiry
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="col-lg-4">
            {/* CONTACT */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body">
                <h6 className="fw-bold text-primary mb-3">
                  <i className="bi bi-telephone me-2"></i>Contact Supplier
                </h6>

                <p className="mb-2">
                  <i className="bi bi-envelope me-2 text-muted"></i>
                  <a href={`mailto:${business.email}`} className="text-decoration-none">
                    {business.email || "N/A"}
                  </a>
                </p>

                <p className="mb-2">
                  <i className="bi bi-phone me-2 text-muted"></i>
                  <a href={`tel:${business.phone}`} className="text-decoration-none">
                    {business.phone || "N/A"}
                  </a>
                </p>

                {business.whatsapp && (
                  <a
                    href={`https://wa.me/${business.whatsapp}`}
                    className="btn btn-success w-100 mt-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="bi bi-whatsapp me-2"></i>
                    Chat on WhatsApp
                  </a>
                )}

                {/* Social Links */}
                <div className="mt-3 pt-3 border-top">
                  <h6 className="fw-bold mb-2">Follow on Social Media</h6>
                  <div className="d-flex gap-2 flex-wrap">
                    {business.facebook && (
                      <a
                        href={business.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary btn-sm"
                      >
                        <i className="bi bi-facebook"></i>
                      </a>
                    )}
                    {business.instagram && (
                      <a
                        href={business.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-danger btn-sm"
                      >
                        <i className="bi bi-instagram"></i>
                      </a>
                    )}
                    {business.tiktok && (
                      <a
                        href={business.tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-dark btn-sm"
                      >
                        <i className="bi bi-tiktok"></i>
                      </a>
                    )}
                    {business.twitter && (
                      <a
                        href={business.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-info btn-sm"
                      >
                        <i className="bi bi-twitter"></i>
                      </a>
                    )}
                    {business.website && (
                      <a
                        href={business.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-secondary btn-sm"
                      >
                        <i className="bi bi-globe2"></i>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* BUSINESS INFO */}
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h6 className="fw-bold mb-3">
                  <i className="bi bi-info-circle me-2"></i>Business Info
                </h6>

                <p className="mb-2">
                  <strong>Owner:</strong> {business.ownerName || "N/A"}
                </p>
                <p className="mb-2">
                  <strong>Category:</strong> {business.category || "N/A"}
                </p>
                {business.memberId && (
                  <p className="mb-2">
                    <strong>Member ID:</strong>{" "}
                    <span className="badge bg-info text-dark">
                      {business.memberId}
                    </span>
                  </p>
                )}
                {business.yearEstablished && (
                  <p className="mb-2">
                    <strong>Established:</strong> {business.yearEstablished}
                  </p>
                )}
                <p className="mb-0">
                  <strong>Member Since:</strong>{" "}
                  {new Date(business.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* IMAGE GALLERY MODAL */}
      {showImageModal && selectedProduct && selectedProduct.images && (
        <div 
          className="modal fade show d-block" 
          style={{ 
            backgroundColor: "rgba(0,0,0,0.9)",
            zIndex: 9999,
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          onClick={closeImageGallery}
        >
          <div 
            className="modal-dialog modal-lg modal-dialog-centered" 
            style={{ maxWidth: "90vw", margin: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content bg-transparent border-0">
              <div className="modal-body p-0">
                <div className="position-relative">
                  {/* Close Button */}
                  <button
                    className="btn btn-light btn-lg rounded-circle position-absolute top-0 end-0 m-3"
                    style={{ zIndex: 10, width: "50px", height: "50px" }}
                    onClick={closeImageGallery}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>

                  {/* Product Code in Gallery */}
                  <div className="position-absolute top-0 start-0 m-3 bg-dark bg-opacity-75 text-white px-3 py-2 rounded">
                    <small>
                      <i className="bi bi-tag me-1"></i>
                      {selectedProduct.productCode || "N/A"}
                    </small>
                  </div>

                  {/* Main Image */}
                  <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "70vh" }}>
                    <img
                      src={`http://localhost:5000/${selectedProduct.images[selectedImage]}`}
                      alt={selectedProduct.name}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "80vh",
                        objectFit: "contain",
                        borderRadius: "8px",
                      }}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/800x600?text=Image+Not+Found";
                      }}
                    />
                  </div>

                  {/* Navigation Buttons */}
                  {selectedProduct.images.length > 1 && (
                    <>
                      <button
                        className="btn btn-light rounded-circle position-absolute top-50 start-0 translate-middle-y ms-2"
                        style={{ width: "50px", height: "50px" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          prevImage();
                        }}
                      >
                        <i className="bi bi-chevron-left fs-4"></i>
                      </button>
                      <button
                        className="btn btn-light rounded-circle position-absolute top-50 end-0 translate-middle-y me-2"
                        style={{ width: "50px", height: "50px" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          nextImage();
                        }}
                      >
                        <i className="bi bi-chevron-right fs-4"></i>
                      </button>
                    </>
                  )}

                  {/* Image Counter & Thumbnails */}
                  <div className="position-absolute bottom-0 start-0 end-0 p-3 bg-dark bg-opacity-75">
                    <div className="text-center text-white mb-2">
                      {selectedImage + 1} / {selectedProduct.images.length}
                    </div>
                    <div className="d-flex gap-2 justify-content-center flex-wrap">
                      {selectedProduct.images.map((img, index) => (
                        <div
                          key={index}
                          className="rounded"
                          style={{
                            width: "60px",
                            height: "60px",
                            cursor: "pointer",
                            overflow: "hidden",
                            border: index === selectedImage ? "3px solid #0d6efd" : "2px solid rgba(255,255,255,0.3)",
                            borderRadius: "4px",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage(index);
                          }}
                        >
                          <img
                            src={`http://localhost:5000/${img}`}
                            alt={`${selectedProduct.name} ${index + 1}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Product Info Overlay */}
                  <div className="position-absolute top-0 start-0 m-3 text-white" style={{ marginTop: "60px" }}>
                    <h5 className="fw-bold mb-0">{selectedProduct.name}</h5>
                    <small className="opacity-75">{selectedProduct.category || "Product"}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <UserFooter />
    </>
  );
}

export default PublicBusinessProfile;