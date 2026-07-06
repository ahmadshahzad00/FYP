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
  
  // Edit Business Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    companyName: "",
    ownerName: "",
    email: "",
    phone: "",
    whatsapp: "",
    yearEstablished: "",
    factoryAddress: "",
    memberId: "",
    category: "",
    products: "",
    website: "",
    description: "",
    facebook: "",
    instagram: "",
    twitter: "",
    tiktok: "",
    pinterest: "",
  });
  const [editLoading, setEditLoading] = useState(false);
  
  // Inquiry states
  const [inquiries, setInquiries] = useState([]);
  const [inquiryStats, setInquiryStats] = useState({
    total: 0,
    pending: 0,
    unread: 0,
    replied: 0,
    resolved: 0,
  });
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [inquiryLoading, setInquiryLoading] = useState(false);
  
  // Product form states
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

  // ============================================
  // FETCH BUSINESS
  // ============================================
  const fetchBusiness = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        "http://localhost:5000/api/business/my-business",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log("Business response:", res.data);
      
      let businessData = res.data.business || res.data;
      
      if (res.data.business) {
        businessData = res.data.business;
      }
      
      setBusinessInfo(businessData);
      
      const businessId = businessData._id || res.data._id;
      
      if (!businessId) {
        console.error("No business ID found in response:", res.data);
        setLoading(false);
        return;
      }
      
      await fetchProducts(businessId);
      await fetchInquiries();
    } catch (err) {
      console.error("Error fetching business:", err);
      if (err.response?.status === 404) {
        setBusinessInfo(null);
      } else {
        console.error("Failed to load business profile:", err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // FETCH PRODUCTS
  // ============================================
  const fetchProducts = async (businessId) => {
    if (!businessId) {
      console.error("No businessId provided to fetchProducts");
      setProducts([]);
      setFilteredProducts([]);
      return;
    }
    
    try {
      const token = localStorage.getItem("token");
      
      const res = await axios.get(
        `http://localhost:5000/api/product/products/${businessId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      let productsData = [];
      if (res.data.products) {
        productsData = res.data.products;
      } else if (res.data.data) {
        productsData = res.data.data;
      } else if (Array.isArray(res.data)) {
        productsData = res.data;
      }
      
      const formattedProducts = productsData.map(product => ({
        ...product,
        id: product._id,
        images: product.images || [],
        image: product.image || (product.images && product.images[0]),
      }));
      
      setProducts(formattedProducts);
      setFilteredProducts(formattedProducts);
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
      setFilteredProducts([]);
    }
  };

  // ============================================
  // Check if user can add products
  // ============================================
  const canAddProduct = () => {
    return businessInfo && businessInfo.status === "approved";
  };

  // ============================================
  // EDIT BUSINESS FUNCTIONS
  // ============================================
  const openEditModal = () => {
    if (!businessInfo) return;
    
    setEditForm({
      companyName: businessInfo.companyName || "",
      ownerName: businessInfo.ownerName || "",
      email: businessInfo.email || "",
      phone: businessInfo.phone || "",
      whatsapp: businessInfo.whatsapp || "",
      yearEstablished: businessInfo.yearEstablished || "",
      factoryAddress: businessInfo.factoryAddress || "",
      memberId: businessInfo.memberId || "",
      category: businessInfo.category || "",
      products: businessInfo.products || "",
      website: businessInfo.website || "",
      description: businessInfo.description || "",
      facebook: businessInfo.facebook || "",
      instagram: businessInfo.instagram || "",
      twitter: businessInfo.twitter || "",
      tiktok: businessInfo.tiktok || "",
      pinterest: businessInfo.pinterest || "",
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditLoading(false);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!businessInfo) return;
    
    setEditLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.put(
        `http://localhost:5000/api/business/update-business/${businessInfo._id}`,
        editForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (response.data.success) {
        alert(response.data.msg);
        // Refresh business data
        await fetchBusiness();
        closeEditModal();
      }
    } catch (err) {
      console.error("Error updating business:", err);
      alert(err.response?.data?.msg || "Failed to update business");
    } finally {
      setEditLoading(false);
    }
  };

  // ============================================
  // INQUIRY FUNCTIONS
  // ============================================
  const fetchInquiries = async () => {
    try {
      const token = localStorage.getItem("token");
      
      const res = await axios.get(
        "http://localhost:5000/api/inquiry/my-inquiries",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setInquiries(res.data.data || []);
      setInquiryStats(res.data.stats || {
        total: 0,
        pending: 0,
        unread: 0,
        replied: 0,
        resolved: 0,
      });
    } catch (err) {
      console.error("Error fetching inquiries:", err);
      setInquiries([]);
      setInquiryStats({
        total: 0,
        pending: 0,
        unread: 0,
        replied: 0,
        resolved: 0,
      });
    }
  };

  const viewInquiry = async (id) => {
    setInquiryLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      const res = await axios.get(
        `http://localhost:5000/api/inquiry/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setSelectedInquiry(res.data.data);
      setShowDetailModal(true);
      setReplyMessage("");
      
      await fetchInquiries();
    } catch (err) {
      console.error("Error fetching inquiry details:", err);
      alert(err.response?.data?.message || "Failed to load inquiry details");
    } finally {
      setInquiryLoading(false);
    }
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedInquiry(null);
    setReplyMessage("");
  };

  const sendReply = async () => {
    if (!replyMessage.trim()) {
      alert("Please enter a reply message");
      return;
    }

    setSendingReply(true);
    try {
      const token = localStorage.getItem("token");
      
      const res = await axios.post(
        `http://localhost:5000/api/inquiry/${selectedInquiry._id}/reply`,
        { replyMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setSelectedInquiry(res.data.data);
      setReplyMessage("");
      await fetchInquiries();
      alert("✅ Reply sent successfully! Email notification sent to customer.");
    } catch (err) {
      console.error("Error sending reply:", err);
      alert(err.response?.data?.message || "Failed to send reply");
    } finally {
      setSendingReply(false);
    }
  };

  const resolveInquiry = async (id) => {
    if (!window.confirm("Mark this inquiry as resolved?")) return;

    try {
      const token = localStorage.getItem("token");
      
      await axios.put(
        `http://localhost:5000/api/inquiry/${id}/resolve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      await fetchInquiries();
      if (selectedInquiry && selectedInquiry._id === id) {
        setSelectedInquiry({ ...selectedInquiry, status: "resolved" });
      }
      alert("Inquiry marked as resolved!");
    } catch (err) {
      console.error("Error resolving inquiry:", err);
      alert(err.response?.data?.message || "Failed to resolve inquiry");
    }
  };

  const deleteInquiry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?")) return;

    try {
      const token = localStorage.getItem("token");
      
      await axios.delete(
        `http://localhost:5000/api/inquiry/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      await fetchInquiries();
      if (selectedInquiry && selectedInquiry._id === id) {
        closeDetailModal();
      }
      alert("Inquiry deleted successfully!");
    } catch (err) {
      console.error("Error deleting inquiry:", err);
      alert(err.response?.data?.message || "Failed to delete inquiry");
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-warning text-dark",
      read: "bg-info text-dark",
      replied: "bg-primary text-white",
      resolved: "bg-success text-white",
    };
    return badges[status] || "bg-secondary";
  };

  const getInquiryTypeIcon = (type) => {
    const icons = {
      general: "💬",
      price: "💰",
      bulk_order: "📦",
      customization: "🎨",
      shipping: "🚚",
      availability: "📊",
      warranty: "🛡️",
      specification: "🔧",
      sample: "🧪",
      other: "📝",
    };
    return icons[type] || "📩";
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
    if (!canAddProduct()) {
      alert("Your business must be verified before you can add products.");
      return;
    }
    
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

  const openEditProductModal = (product) => {
    if (!canAddProduct()) {
      alert("Your business must be verified before you can edit products.");
      return;
    }
    
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
      const token = localStorage.getItem("token");
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
              Authorization: `Bearer ${token}`,
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
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        
        alert(res.data.message);
        await fetchProducts(businessInfo._id);
      }
      
      const modal = document.getElementById("productModal");
      const bootstrapModal = window.bootstrap?.Modal?.getInstance(modal);
      if (bootstrapModal) {
        bootstrapModal.hide();
      } else {
        const closeBtn = modal.querySelector(".btn-close");
        if (closeBtn) closeBtn.click();
      }
      
    } catch (err) {
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
        const token = localStorage.getItem("token");
        
        await axios.delete(
          `http://localhost:5000/api/product/delete-product/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
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
          <div className="mb-4">
            <i className="bi bi-building fs-1 text-muted"></i>
          </div>
          <h4>No Business Found</h4>
          <p className="text-muted">You haven't registered a business yet.</p>
          <button 
            className="btn btn-primary mt-3"
            onClick={() => window.location.href = "/register-business"}
          >
            Register Your Business
          </button>
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

          <div className="ms-4 flex-grow-1">
            <div className="d-flex justify-content-between align-items-start flex-wrap">
              <div>
                <h3 className="fw-bolder mb-1 text-dark">{businessInfo.companyName}</h3>
                <p className="text-muted mb-1">Business Owner Dashboard</p>
                <span className="badge bg-primary">{businessInfo.factoryAddress}</span>
                <span
                  className={`badge ms-2 ${
                    businessInfo.status === "approved"
                      ? "bg-success"
                      : businessInfo.status === "rejected"
                      ? "bg-danger"
                      : "bg-warning text-dark"
                  }`}
                >
                  {businessInfo.status === "approved" 
                    ? "Approved" 
                    : businessInfo.status === "rejected" 
                    ? "Not Verified" 
                    : "⏳ Pending Verification"}
                </span>
                {businessInfo.verificationDetails?.verified && (
                  <span className="badge bg-info ms-1">
                    <i className="bi bi-check-circle me-1"></i>
                    Verified
                  </span>
                )}
              </div>

              <div className="d-flex gap-2">
                {/* EDIT BUSINESS BUTTON */}
                <button
                  className="btn btn-outline-primary"
                  onClick={openEditModal}
                >
                  <i className="bi bi-pencil me-1"></i>
                  Edit Business
                </button>

                {/* INQUIRY BUTTON */}
                <button
                  className="btn btn-primary position-relative"
                  onClick={() => fetchInquiries()}
                  data-bs-toggle="modal"
                  data-bs-target="#inquiryModal"
                >
                  <i className="bi bi-envelope me-2"></i>
                  Inquiries
                  {inquiryStats.pending > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {inquiryStats.pending}
                      <span className="visually-hidden">new inquiries</span>
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INQUIRY STATS BANNER */}
      <div className="container mt-3">
        <div className="row g-2">
          <div className="col-md-3 col-6">
            <div className="card bg-primary text-white text-center p-2">
              <small>Total</small>
              <h5 className="mb-0">{inquiryStats.total}</h5>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card bg-warning text-dark text-center p-2">
              <small>Pending</small>
              <h5 className="mb-0">{inquiryStats.pending}</h5>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card bg-info text-dark text-center p-2">
              <small>Replied</small>
              <h5 className="mb-0">{inquiryStats.replied}</h5>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card bg-success text-white text-center p-2">
              <small>Resolved</small>
              <h5 className="mb-0">{inquiryStats.resolved}</h5>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Warning Banner */}
      {!canAddProduct() && (
        <div className="container mt-3">
          <div className="alert alert-warning">
            <i className="bi bi-exclamation-triangle me-2"></i>
            <strong>Account Not Verified:</strong> Please verify your MemberID. You cannot add or edit products until your business is verified. 
            Your account verify on the base of MemberID.
          </div>
        </div>
      )}

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
                  {canAddProduct() ? (
                    <button
                      className="btn btn-primary btn-sm"
                      data-bs-toggle="modal"
                      data-bs-target="#productModal"
                      onClick={openAddModal}
                    >
                      <i className="bi bi-plus-lg me-1"></i>Add Product
                    </button>
                  ) : (
                    <button
                      className="btn btn-secondary btn-sm"
                      disabled
                      title="Your business must be verified to add products"
                    >
                      <i className="bi bi-plus-lg me-1"></i>Add Product
                      <span className="ms-1">
                        <i className="bi bi-lock"></i>
                      </span>
                    </button>
                  )}
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
                      {canAddProduct() ? (
                        <button
                          className="btn btn-outline-primary btn-sm"
                          data-bs-toggle="modal"
                          data-bs-target="#productModal"
                          onClick={openAddModal}
                        >
                          Add Your First Product
                        </button>
                      ) : (
                        <div className="text-warning small">
                          <i className="bi bi-lock me-1"></i>
                          Verification required to add products
                        </div>
                      )}
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
                            {canAddProduct() ? (
                              <>
                                <button
                                  className="btn btn-outline-secondary btn-sm me-2"
                                  data-bs-toggle="modal"
                                  data-bs-target="#productModal"
                                  onClick={() => openEditProductModal(p)}
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => handleDelete(p.id)}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </>
                            ) : (
                              <span className="text-muted small">
                                <i className="bi bi-lock me-1"></i>
                                Locked
                              </span>
                            )}
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
                <p><strong>Member ID:</strong> 
                  <span className="badge bg-info text-dark ms-1">
                    {businessInfo.memberId || "N/A"}
                  </span>
                </p>
                {businessInfo.verificationDetails?.verified && (
                  <p className="text-success">
                    <i className="bi bi-check-circle me-1"></i>
                    Verified: {businessInfo.verificationDetails.message}
                  </p>
                )}

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
                <p><strong>Year Established:</strong> {businessInfo.yearEstablished}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== EDIT BUSINESS MODAL ===== */}
      {showEditModal && (
        <div
          className="modal fade show d-block"
          style={{ 
            backgroundColor: "rgba(0,0,0,0.6)", 
            zIndex: 9999,
            overflow: "auto"
          }}
          onClick={closeEditModal}
        >
          <div 
            className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
            style={{ pointerEvents: "none" }}
          >
            <div 
              className="modal-content" 
              style={{ pointerEvents: "auto" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="bi bi-pencil-square me-2"></i>
                  Edit Business Information
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={closeEditModal}
                ></button>
              </div>

              <div className="modal-body">
                <form onSubmit={handleEditSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Company Name *</label>
                      <input
                        type="text"
                        name="companyName"
                        className="form-control"
                        value={editForm.companyName}
                        onChange={handleEditChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Owner Name *</label>
                      <input
                        type="text"
                        name="ownerName"
                        className="form-control"
                        value={editForm.ownerName}
                        onChange={handleEditChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Email *</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={editForm.email}
                        onChange={handleEditChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        className="form-control"
                        value={editForm.phone}
                        onChange={handleEditChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">WhatsApp</label>
                      <input
                        type="tel"
                        name="whatsapp"
                        className="form-control"
                        value={editForm.whatsapp}
                        onChange={handleEditChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Year Established</label>
                      <input
                        type="number"
                        name="yearEstablished"
                        className="form-control"
                        value={editForm.yearEstablished}
                        onChange={handleEditChange}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">Factory Address *</label>
                      <input
                        type="text"
                        name="factoryAddress"
                        className="form-control"
                        value={editForm.factoryAddress}
                        onChange={handleEditChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Chamber Member ID *</label>
                      <input
                        type="text"
                        name="memberId"
                        className="form-control"
                        value={editForm.memberId}
                        onChange={handleEditChange}
                        required
                      />
                      <small className="text-muted">
                        {businessInfo.status === "approved" && editForm.memberId !== businessInfo.memberId && (
                          <span className="text-warning">
                            <i className="bi bi-exclamation-triangle me-1"></i>
                            Changing Member ID will reset verification status to Pending.
                          </span>
                        )}
                      </small>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Category *</label>
                      <select
                        name="category"
                        className="form-select"
                        value={editForm.category}
                        onChange={handleEditChange}
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="sports">Sports Goods</option>
                        <option value="leather">Leather Products</option>
                        <option value="surgical">Surgical Instruments</option>
                        <option value="textile">Textile & Apparel</option>
                        <option value="safety">Safety Equipment</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label">Products</label>
                      <input
                        type="text"
                        name="products"
                        className="form-control"
                        value={editForm.products}
                        onChange={handleEditChange}
                        placeholder="e.g., Footballs, Leather Jackets"
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">Description</label>
                      <textarea
                        name="description"
                        className="form-control"
                        rows="3"
                        value={editForm.description}
                        onChange={handleEditChange}
                        placeholder="Describe your business..."
                      ></textarea>
                    </div>

                    <div className="col-12">
                      <label className="form-label">Website</label>
                      <input
                        type="url"
                        name="website"
                        className="form-control"
                        value={editForm.website}
                        onChange={handleEditChange}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">Social Media</label>
                    </div>

                    <div className="col-md-6">
                      <input
                        type="url"
                        name="facebook"
                        className="form-control"
                        placeholder="Facebook"
                        value={editForm.facebook}
                        onChange={handleEditChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <input
                        type="url"
                        name="instagram"
                        className="form-control"
                        placeholder="Instagram"
                        value={editForm.instagram}
                        onChange={handleEditChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <input
                        type="url"
                        name="twitter"
                        className="form-control"
                        placeholder="Twitter"
                        value={editForm.twitter}
                        onChange={handleEditChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <input
                        type="url"
                        name="tiktok"
                        className="form-control"
                        placeholder="TikTok"
                        value={editForm.tiktok}
                        onChange={handleEditChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <input
                        type="url"
                        name="pinterest"
                        className="form-control"
                        placeholder="Pinterest"
                        value={editForm.pinterest}
                        onChange={handleEditChange}
                      />
                    </div>
                  </div>

                  <div className="modal-footer mt-3">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={closeEditModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={editLoading}
                    >
                      {editLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== INQUIRY LIST MODAL ===== */}
      <div className="modal fade" id="inquiryModal" tabIndex="-1" data-bs-backdrop="static">
        <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">
                <i className="bi bi-envelope me-2"></i>
                Product Inquiries
                {inquiryStats.pending > 0 && (
                  <span className="badge bg-danger ms-2">{inquiryStats.pending} new</span>
                )}
              </h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              {inquiries.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-inbox fs-1 text-muted"></i>
                  <p className="text-muted mt-2">No inquiries received yet</p>
                </div>
              ) : (
                <div className="list-group">
                  {inquiries.map((inquiry) => (
                    <div
                      key={inquiry._id}
                      className={`list-group-item list-group-item-action ${
                        inquiry.status === "pending" ? "border-start border-warning border-4" : ""
                      }`}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center gap-2">
                            <span className="fs-5">{getInquiryTypeIcon(inquiry.inquiryType)}</span>
                            <h6 className="mb-0">
                              {inquiry.subject}
                              {inquiry.status === "pending" && (
                                <span className="badge bg-warning text-dark ms-2">New</span>
                              )}
                            </h6>
                          </div>
                          <small className="text-muted">
                            <i className="bi bi-person me-1"></i>
                            {inquiry.customerName} • 
                            <i className="bi bi-envelope ms-2 me-1"></i>
                            {inquiry.customerEmail}
                          </small>
                          <div className="mt-1">
                            <small className="text-muted">
                              Product: {inquiry.productName} • 
                              Quantity: {inquiry.quantity}
                            </small>
                          </div>
                          <p className="mb-1 text-truncate" style={{ maxWidth: "400px" }}>
                            {inquiry.message}
                          </p>
                        </div>
                        <div className="text-end ms-3">
                          <span className={`badge ${getStatusBadge(inquiry.status)}`}>
                            {inquiry.status}
                          </span>
                          <br />
                          <small className="text-muted">
                            {new Date(inquiry.createdAt).toLocaleDateString()}
                          </small>
                          <br />
                          <button
                            className="btn btn-sm btn-primary mt-1"
                            onClick={() => viewInquiry(inquiry._id)}
                          >
                            <i className="bi bi-eye me-1"></i>View
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== INQUIRY DETAIL MODAL ===== */}
      {showDetailModal && selectedInquiry && (
        <div
          className="modal fade show d-block"
          style={{ 
            backgroundColor: "rgba(0,0,0,0.6)", 
            zIndex: 9999,
            overflow: "auto"
          }}
          onClick={closeDetailModal}
        >
          <div 
            className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
            style={{ pointerEvents: "none" }}
          >
            <div 
              className="modal-content" 
              style={{ pointerEvents: "auto" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  {getInquiryTypeIcon(selectedInquiry.inquiryType)} {selectedInquiry.subject}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={closeDetailModal}
                ></button>
              </div>

              <div className="modal-body">
                {inquiryLoading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary"></div>
                  </div>
                ) : (
                  <>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <strong>Customer:</strong>
                        <p>{selectedInquiry.customerName}</p>
                      </div>
                      <div className="col-md-6">
                        <strong>Email:</strong>
                        <p>{selectedInquiry.customerEmail}</p>
                      </div>
                      <div className="col-md-6">
                        <strong>Phone:</strong>
                        <p>{selectedInquiry.customerPhone}</p>
                      </div>
                      <div className="col-md-6">
                        <strong>Status:</strong>
                        <p>
                          <span className={`badge ${getStatusBadge(selectedInquiry.status)}`}>
                            {selectedInquiry.status}
                          </span>
                        </p>
                      </div>
                    </div>

                    <hr />

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <strong>Product:</strong>
                        <p>{selectedInquiry.productName}</p>
                      </div>
                      <div className="col-md-6">
                        <strong>Quantity:</strong>
                        <p>{selectedInquiry.quantity}</p>
                      </div>
                      <div className="col-md-6">
                        <strong>Inquiry Type:</strong>
                        <p>{selectedInquiry.inquiryType}</p>
                      </div>
                      <div className="col-md-6">
                        <strong>Date:</strong>
                        <p>{new Date(selectedInquiry.createdAt).toLocaleString()}</p>
                      </div>
                    </div>

                    <hr />

                    <div className="mb-3">
                      <strong>Message:</strong>
                      <div className="bg-light p-3 rounded mt-1">
                        {selectedInquiry.message}
                      </div>
                    </div>

                    {selectedInquiry.responses && selectedInquiry.responses.length > 0 && (
                      <>
                        <hr />
                        <h6>Responses:</h6>
                        {selectedInquiry.responses.map((response, idx) => (
                          <div
                            key={idx}
                            className={`p-2 rounded mb-2 ${
                              response.sender === "business_owner"
                                ? "bg-primary text-white"
                                : "bg-secondary text-white"
                            }`}
                          >
                            <small>
                              {response.sender === "business_owner" ? "You" : "Customer"} • 
                              {new Date(response.createdAt).toLocaleString()}
                            </small>
                            <p className="mb-0">{response.message}</p>
                          </div>
                        ))}
                      </>
                    )}

                    {selectedInquiry.status !== "resolved" && (
                      <>
                        <hr />
                        <h6>Reply to Customer:</h6>
                        <div className="mb-3">
                          <label className="form-label fw-bold">Your Reply:</label>
                          <textarea
                            className="form-control"
                            rows="4"
                            placeholder="Type your reply here..."
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                            style={{ 
                              resize: "vertical",
                              backgroundColor: "#fff",
                              color: "#000"
                            }}
                          ></textarea>
                        </div>
                        <div className="d-flex gap-2 flex-wrap">
                          <button
                            className="btn btn-primary"
                            onClick={sendReply}
                            disabled={sendingReply}
                          >
                            {sendingReply ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Sending...
                              </>
                            ) : (
                              <i className="bi bi-send me-2"></i>
                            )}
                            Send Reply
                          </button>
                          <button
                            className="btn btn-success"
                            onClick={() => resolveInquiry(selectedInquiry._id)}
                          >
                            <i className="bi bi-check-circle me-2"></i>
                            Mark as Resolved
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => deleteInquiry(selectedInquiry._id)}
                          >
                            <i className="bi bi-trash me-2"></i>
                            Delete
                          </button>
                        </div>
                      </>
                    )}

                    {selectedInquiry.status === "resolved" && (
                      <div className="alert alert-success mt-3">
                        <i className="bi bi-check-circle me-2"></i>
                        This inquiry has been resolved.
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={closeDetailModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT MODAL */}
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
                  <small className="text-muted">You can select up to 5 images.</small>
                </div>

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