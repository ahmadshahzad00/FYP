import React, { useEffect, useState } from "react";
import axios from "axios";
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";

function BusinessProfile() {
  const [businessInfo, setBusinessInfo] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("name");
  const [form, setForm] = useState({
    images: [],
    name: "",
    category: "",
    description: "",
    size: "",
    colors: "",
    price: "",
    method: "",
    availableQuantity: "",
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editImageChanged, setEditImageChanged] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [zoomImage, setZoomImage] = useState(null);
  const [showZoomModal, setShowZoomModal] = useState(false);

  useEffect(() => {
    fetchBusiness();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, searchField, products]);

  const fetchBusiness = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/business/my-business",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setBusinessInfo(res.data);
      await fetchProducts(res.data._id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (businessId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/product/products/${businessId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      const formattedProducts = res.data.products.map(product => ({
        ...product,
        id: product._id,
        images: product.images || [],
        image: product.image || (product.images && product.images[0]),
      }));
      
      setProducts(formattedProducts);
      setFilteredProducts(formattedProducts);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const filterProducts = () => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    
    const filtered = products.filter(product => {
      switch(searchField) {
        case "name":
          return product.name?.toLowerCase().includes(searchLower);
        case "category":
          return product.category?.toLowerCase().includes(searchLower);
        case "price":
          return product.price?.toString().toLowerCase().includes(searchLower);
        case "method":
          return product.method?.toLowerCase().includes(searchLower);
        case "size":
          return product.size?.toLowerCase().includes(searchLower);
        default:
          return product.name?.toLowerCase().includes(searchLower);
      }
    });
    
    setFilteredProducts(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchFieldChange = (e) => {
    setSearchField(e.target.value);
    setSearchTerm("");
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilteredProducts(products);
  };

  const handleImageZoom = (imageUrl) => {
    setZoomImage(imageUrl);
    setShowZoomModal(true);
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }
    
    setForm({ ...form, images: files });
    setEditImageChanged(true);
    
    // Create previews
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index) => {
    const newImages = [...form.images];
    newImages.splice(index, 1);
    setForm({ ...form, images: newImages });
    
    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const openAddModal = () => {
    setForm({
      images: [],
      name: "",
      category: "",
      description: "",
      size: "",
      colors: "",
      price: "",
      method: "",
      availableQuantity: "",
    });
    setImagePreviews([]);
    setExistingImages([]);
    setEditId(null);
    setEditImageChanged(false);
  };

  const openEditModal = (product) => {
    setForm({
      id: product._id,
      images: [],
      name: product.name,
      category: product.category,
      description: product.description,
      size: product.size,
      colors: product.colors,
      price: product.price,
      method: product.method,
      availableQuantity: product.availableQuantity,
    });
    setExistingImages(product.images || []);
    setImagePreviews([]);
    setEditId(product._id);
    setEditImageChanged(false);
  };

  const handleSave = async () => {
    if (!editId && form.images.length === 0) {
      alert("Please select at least one product image");
      return;
    }

    setUploading(true);

    try {
      const data = new FormData();
      data.append("businessId", businessInfo._id);
      data.append("name", form.name);
      data.append("category", form.category);
      data.append("description", form.description);
      data.append("size", form.size);
      data.append("colors", form.colors);
      data.append("price", form.price);
      data.append("method", form.method);
      data.append("availableQuantity", form.availableQuantity);
      
      if (editId && existingImages.length > 0) {
        data.append("existingImages", existingImages.join(','));
      }
      
      if (form.images && form.images.length > 0) {
        for (let i = 0; i < form.images.length; i++) {
          data.append("images", form.images[i]);
        }
      }

      let res;
      
      if (editId) {
        res = await axios.put(
          `http://localhost:5000/api/product/update-product/${editId}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert(res.data.message);
        await fetchProducts(businessInfo._id);
      } else {
        res = await axios.post(
          "http://localhost:5000/api/product/upload-product",
          data,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        
        alert(res.data.message);
        await fetchProducts(businessInfo._id);
      }
      
      // Close modal
      const modal = document.getElementById("productModal");
      const bootstrapModal = window.bootstrap?.Modal?.getInstance(modal);
      if (bootstrapModal) {
        bootstrapModal.hide();
      } else {
        const closeBtn = modal.querySelector(".btn-close");
        if (closeBtn) closeBtn.click();
      }
      
    } catch (err) {
      // Display detailed error message
      if (err.response?.data?.errors) {
        const errorMessages = err.response.data.errors.map(e => `${e.filename}: ${e.error}`).join('\n');
        alert(`Upload failed:\n${errorMessages}`);
      } else {
        alert(err.response?.data?.message || "Failed to save product");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      try {
        await axios.delete(
          `http://localhost:5000/api/product/delete-product/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        
        const updatedProducts = products.filter((p) => p.id !== id);
        setProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
        alert("Product deleted successfully");
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete product");
      }
    }
  };

  if (loading) {
    return (
      <>
        <UserHeader />
        <div className="container text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 className="mt-3">Loading Business Profile...</h4>
        </div>
        <UserFooter />
      </>
    );
  }

  if (!businessInfo) {
    return (
      <>
        <UserHeader />
        <div className="container text-center py-5">
          <h4>Business not found</h4>
        </div>
        <UserFooter />
      </>
    );
  }

  return (
    <>
      <UserHeader />

      {/* HEADER */}
      <section className="profile-header">
        <div className="container d-flex align-items-center">
          <div className="logo-circle">
            {businessInfo.logo ? (
              <img
                src={`http://localhost:5000/${businessInfo.logo}`}
                alt="logo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            ) : (
              "LOGO"
            )}
          </div>

          <div className="ms-4">
            <h3 className="fw-bold mb-1">{businessInfo.companyName}</h3>
            <p className="text-muted mb-1">Business Owner Dashboard</p>

            <span className="badge bg-primary">
              {businessInfo.factoryAddress}
            </span>

            <div className="mt-2">
              <span
                className={`badge ${
                  businessInfo.status === "approved"
                    ? "bg-success"
                    : businessInfo.status === "rejected"
                    ? "bg-danger"
                    : "bg-warning text-dark"
                }`}
              >
                {businessInfo.status}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="container my-5">
        <div className="row">
          {/* PRODUCTS */}
          <div className="col-lg-8">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="fw-bold mb-2 mb-md-0">
                  Products ({filteredProducts.length})
                </h5>

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-primary btn-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#productModal"
                    onClick={openAddModal}
                  >
                    <i className="bi bi-plus-lg me-1"></i>Add Product
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="card-body border-bottom">
                <div className="row g-2 align-items-end">
                  <div className="col-md-4">
                    <label className="form-label fw-bold mb-1 small">
                      <i className="bi bi-search"></i> Search By
                    </label>
                    <select 
                      className="form-select form-select-sm" 
                      value={searchField} 
                      onChange={handleSearchFieldChange}
                    >
                      <option value="name">Product Name</option>
                      <option value="category">Category</option>
                      <option value="price">Price</option>
                      <option value="method">Method</option>
                      <option value="size">Size</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold mb-1 small">
                      <i className="bi bi-input-cursor"></i> Search Term
                    </label>
                    <div className="input-group input-group-sm">
                      <span className="input-group-text bg-white">
                        <i className="bi bi-search"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={`Search by ${searchField}...`}
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                      {searchTerm && (
                        <button 
                          className="btn btn-outline-secondary" 
                          type="button"
                          onClick={clearSearch}
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      )}
                    </div>
                  </div>
                  {/* <div className="col-md-2">
                    <button 
                      className="btn btn-outline-primary btn-sm w-100" 
                      onClick={() => fetchProducts(businessInfo._id)}
                    >
                      <i className="bi bi-arrow-repeat"></i> Refresh
                    </button>
                  </div> */}
                </div>
                
                {searchTerm && (
                  <div className="mt-2 pt-1">
                    <small className="text-info">
                      <i className="bi bi-info-circle"></i> 
                      Showing results for: <strong>"{searchTerm}"</strong> in <strong>{searchField}</strong>
                      {filteredProducts.length !== products.length && (
                        <span className="ms-2 text-muted">
                          (Found {filteredProducts.length} of {products.length} products)
                        </span>
                      )}
                    </small>
                  </div>
                )}
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-5">
                  {searchTerm ? (
                    <>
                      <i className="bi bi-search fs-1 text-muted"></i>
                      <p className="text-muted mt-2">
                        No products found matching "<strong>{searchTerm}</strong>" in {searchField}
                      </p>
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={clearSearch}
                      >
                        Clear Search
                      </button>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box fs-1 text-muted"></i>
                      <p className="text-muted mt-2">No products added yet</p>
                      <button
                        className="btn btn-outline-primary btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#productModal"
                        onClick={openAddModal}
                      >
                        Add Your First Product
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Images</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Size</th>
                        <th>Colors</th>
                        <th>Price</th>
                        <th>Method</th>
                        <th>Qty</th>
                        <th className="text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <div className="d-flex gap-1">
                              {(p.images || [p.image]).slice(0, 3).map((img, idx) => (
                                <img
                                  key={idx}
                                  src={`http://localhost:5000/${img}`}
                                  alt={`${p.name} ${idx + 1}`}
                                  style={{
                                    width: "45px",
                                    height: "45px",
                                    objectFit: "cover",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    border: "1px solid #ddd"
                                  }}
                                  onClick={() => handleImageZoom(`http://localhost:5000/${img}`)}
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                  }}
                                />
                              ))}
                              {p.images && p.images.length > 3 && (
                                <div 
                                  className="bg-secondary text-white rounded d-flex align-items-center justify-content-center"
                                  style={{ width: "45px", height: "45px", fontSize: "12px", cursor: "pointer" }}
                                  onClick={() => handleImageZoom(`http://localhost:5000/${p.images[3]}`)}
                                >
                                  +{p.images.length - 3}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="fw-semibold">{p.name}</td>
                          <td>
                            <span className="badge bg-secondary">
                              {p.category}
                            </span>
                          </td>
                          <td>{p.size || "-"}</td>
                          <td>{p.colors || "-"}</td>
                          <td className="fw-bold text-success">Rs. {p.price}</td>
                          <td>
                            <span className="badge bg-info text-dark">
                              {p.method}
                            </span>
                          </td>
                          <td>{p.availableQuantity}</td>
                          <td className="text-end">
                            <button
                              className="btn btn-outline-secondary btn-sm me-2"
                              data-bs-toggle="modal"
                              data-bs-target="#productModal"
                              onClick={() => openEditModal(p)}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDelete(p.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* BUSINESS INFO */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h6 className="fw-bold mb-3 text-primary">
                  Business Information
                </h6>

                <p><strong>Owner:</strong> {businessInfo.ownerName}</p>
                <p><strong>Email:</strong> {businessInfo.email}</p>
                <p><strong>Phone:</strong> {businessInfo.phone}</p>

                <div className="d-flex gap-3 mt-3">
                  {businessInfo.facebook && (
                    <a href={businessInfo.facebook} target="_blank" rel="noopener noreferrer">
                      <i className="bi bi-facebook fs-5 text-primary"></i>
                    </a>
                  )}
                  {businessInfo.instagram && (
                    <a href={businessInfo.instagram} target="_blank" rel="noopener noreferrer">
                      <i className="bi bi-instagram fs-5 text-danger"></i>
                    </a>
                  )}
                  {businessInfo.tiktok && (
                    <a href={businessInfo.tiktok} target="_blank" rel="noopener noreferrer">
                      <i className="bi bi-tiktok fs-5 text-dark"></i>
                    </a>
                  )}
                  {businessInfo.whatsapp && (
                    <a href={`https://wa.me/${businessInfo.whatsapp}`} target="_blank" rel="noopener noreferrer">
                      <i className="bi bi-whatsapp fs-5 text-success"></i>
                    </a>
                  )}
                  {businessInfo.website && (
                    <a href={businessInfo.website} target="_blank" rel="noopener noreferrer">
                      <i className="bi bi-globe fs-5 text-dark"></i>
                    </a>
                  )}
                </div>

                <hr />

                <p><strong>Category:</strong> {businessInfo.category}</p>
                {businessInfo.memberId && <p><strong>MemberID:</strong> {businessInfo.memberId}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <div className="modal fade" id="productModal">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {editId ? "Edit Product" : "Add Product"}
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <input
                    className="form-control"
                    placeholder="Product Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <select
                    className="form-control"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    <option value="sports">Sports Goods</option>
                    <option value="leather">Leather Products</option>
                    <option value="surgical">Surgical Instruments</option>
                    <option value="textile">Textile & Apparel</option>
                    <option value="safety">Safety Equipment</option>
                    <option value="other">Other</option>
                    {/* Add more options as needed */}
                  </select>
                </div>

                <div className="col-md-6">
                  <input
                    className="form-control"
                    placeholder="Size"
                    value={form.size}
                    onChange={(e) => setForm({ ...form, size: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <input
                    className="form-control"
                    placeholder="Colors (comma separated)"
                    value={form.colors}
                    onChange={(e) => setForm({ ...form, colors: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Price"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <select
                    className="form-select"
                    value={form.method}
                    onChange={(e) => setForm({ ...form, method: e.target.value })}
                  >
                    <option value="">Select Method</option>
                    <option>Hand Made</option>
                    <option>Machine Made</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Available Quantity"
                    value={form.availableQuantity}
                    onChange={(e) => setForm({ ...form, availableQuantity: e.target.value })}
                  />
                </div>

                <div className="col-12">
                  <textarea
                    rows="3"
                    className="form-control"
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">
                    Product Images (Max 5) {editId && "(Add new to keep existing)"}
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                  />
                  <small className="text-muted">You can select up to 5 images. All images must be real (no AI generated images allowed)</small>
                </div>

                {/* Existing Images Preview (Edit Mode) */}
                {editId && existingImages.length > 0 && !editImageChanged && (
                  <div className="col-12">
                    <label className="fw-semibold">Current Images (Click to zoom):</label>
                    <div className="d-flex gap-2 mt-2 flex-wrap">
                      {existingImages.map((img, idx) => (
                        <div key={idx} className="position-relative">
                          <img
                            src={`http://localhost:5000/${img}`}
                            alt={`Product ${idx + 1}`}
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              border: "1px solid #ddd",
                              cursor: "pointer"
                            }}
                            onClick={() => handleImageZoom(`http://localhost:5000/${img}`)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Images Preview */}
                {imagePreviews.length > 0 && (
                  <div className="col-12">
                    <label className="fw-semibold">New Images:</label>
                    <div className="d-flex gap-2 mt-2 flex-wrap">
                      {imagePreviews.map((preview, idx) => (
                        <div key={idx} className="position-relative">
                          <img
                            src={preview}
                            alt={`Preview ${idx + 1}`}
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              border: "2px solid #0d6efd",
                              cursor: "pointer"
                            }}
                            onClick={() => handleImageZoom(preview)}
                          />
                          <button
                            type="button"
                            className="btn btn-danger btn-sm position-absolute top-0 end-0 rounded-circle"
                            style={{ transform: "translate(50%, -50%)" }}
                            onClick={() => removeImage(idx)}
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Saving...
                  </>
                ) : (
                  "Save Product"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      {showZoomModal && zoomImage && (
        <div 
          className="modal fade show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 9999 }}
          onClick={() => setShowZoomModal(false)}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content bg-transparent border-0">
              <div className="modal-body text-center p-0">
                <button 
                  className="btn btn-light position-absolute top-0 end-0 m-3 rounded-circle"
                  style={{ zIndex: 1 }}
                  onClick={() => setShowZoomModal(false)}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
                <img
                  src={zoomImage}
                  alt="Zoomed product"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '90vh',
                    objectFit: 'contain',
                    borderRadius: '8px'
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <UserFooter />
    </>
  );
}

export default BusinessProfile;