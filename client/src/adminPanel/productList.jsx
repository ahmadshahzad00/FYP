import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/product';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('name');
  const [zoomImage, setZoomImage] = useState(null);
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [sortByRating, setSortByRating] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, searchField, products, sortByRating]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_BASE_URL}/products-with-business`);
      
      if (response.data.success) {
        let productData = response.data.products;
        if (sortByRating) {
          productData = [...productData].sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        }
        setProducts(productData);
        setFilteredProducts(productData);
      } else {
        setError(response.data.message || 'Failed to fetch products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please check if backend is running on port 5000');
      } else if (err.response?.status === 404) {
        setError('API endpoint not found');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to fetch products');
      }
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      
      filtered = filtered.filter(product => {
        switch(searchField) {
          case 'name':
            return product.name?.toLowerCase().includes(searchLower);
          case 'productCode':
            return product.productCode?.toLowerCase().includes(searchLower);
          case 'business':
            return product.businessDetails?.businessName?.toLowerCase().includes(searchLower);
          case 'owner':
            return product.businessDetails?.ownerName?.toLowerCase().includes(searchLower);
          case 'category':
            return product.category?.toLowerCase().includes(searchLower);
          default:
            return product.name?.toLowerCase().includes(searchLower);
        }
      });
    }

    if (sortByRating) {
      filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    }
    
    setFilteredProducts(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchFieldChange = (e) => {
    setSearchField(e.target.value);
    setSearchTerm('');
  };

  const clearSearch = () => {
    setSearchTerm('');
    setFilteredProducts(products);
  };

  const handleSortByRating = () => {
    setSortByRating(!sortByRating);
  };

  const handleImageZoom = (imageUrl) => {
    setZoomImage(imageUrl);
    setShowZoomModal(true);
  };

  const handleView = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/product-ratings/${id}`);
      
      if (response.data.success) {
        const product = filteredProducts.find((p) => p._id === id);
        if (product) {
          setSelectedProduct({
            ...product,
            ratings: response.data.ratings || [],
            averageRating: response.data.averageRating || 0,
            totalRatings: response.data.totalRatings || 0,
            productCode: response.data.productCode || product.productCode,
          });
          setShowModal(true);
        }
      } else {
        const product = filteredProducts.find((p) => p._id === id);
        if (product) {
          setSelectedProduct(product);
          setShowModal(true);
        }
      }
    } catch (err) {
      console.error('Error fetching product ratings:', err);
      const product = filteredProducts.find((p) => p._id === id);
      if (product) {
        setSelectedProduct(product);
        setShowModal(true);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${API_BASE_URL}/delete-product/${id}`);
        const updatedProducts = products.filter(product => product._id !== id);
        setProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
        if (selectedProduct?._id === id) {
          handleCloseModal();
        }
        alert('Product deleted successfully');
      } catch (err) {
        console.error('Error deleting product:', err);
        alert(err.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) - fullStars >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<i key={i} className="bi bi-star-fill text-warning" style={{ fontSize: '14px' }}></i>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<i key={i} className="bi bi-star-half text-warning" style={{ fontSize: '14px' }}></i>);
      } else {
        stars.push(<i key={i} className="bi bi-star text-secondary" style={{ fontSize: '14px' }}></i>);
      }
    }
    return stars;
  };

  const renderLargeStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) - fullStars >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<i key={i} className="bi bi-star-fill text-warning" style={{ fontSize: '20px' }}></i>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<i key={i} className="bi bi-star-half text-warning" style={{ fontSize: '20px' }}></i>);
      } else {
        stars.push(<i key={i} className="bi bi-star text-secondary" style={{ fontSize: '20px' }}></i>);
      }
    }
    return stars;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="d-flex min-vh-100 bg-light">
        <AdminSidebar />
        <div className="flex-grow-1 p-4 d-flex justify-content-center align-items-center">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading products from database...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex min-vh-100 bg-light">
        <AdminSidebar />
        <div className="flex-grow-1 p-4 d-flex justify-content-center align-items-center">
          <div className="text-center">
            <div className="alert alert-danger" role="alert">
              <i className="bi bi-exclamation-triangle fs-1"></i>
              <h4 className="mt-2">Error</h4>
              <p>{error}</p>
              <button 
                className="btn btn-primary mt-2" 
                onClick={fetchProducts}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex min-vh-100 bg-light">
      <AdminSidebar />
      <div className="flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-0">Product List</h2>
            <div className="text-muted mt-1">
              Total: {filteredProducts.length} products
            </div>
          </div>
          <div className="d-flex gap-2">
            <button 
              className={`btn ${sortByRating ? 'btn-warning' : 'btn-outline-secondary'} btn-sm`}
              onClick={handleSortByRating}
            >
              <i className="bi bi-star me-1"></i>
              {sortByRating ? 'Sorting by Rating' : 'Sort by Rating'}
            </button>
            <button 
              className="btn btn-outline-primary btn-sm" 
              onClick={fetchProducts}
            >
              <i className="bi bi-arrow-repeat me-1"></i> Refresh
            </button>
          </div>
        </div>

        {/* Search Bar Section */}
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <div className="row g-3 align-items-end">
              <div className="col-md-4">
                <label className="form-label fw-bold mb-1">
                  <i className="bi bi-search"></i> Search By
                </label>
                <select 
                  className="form-select" 
                  value={searchField} 
                  onChange={handleSearchFieldChange}
                >
                  <option value="name">Product Name</option>
                  <option value="productCode">Product Code</option>
                  <option value="business">Business Name</option>
                  <option value="owner">Owner Name</option>
                  <option value="category">Category</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold mb-1">
                  <i className="bi bi-input-cursor"></i> Search Term
                </label>
                <div className="input-group">
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
                      <i className="bi bi-x-lg"></i> Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {searchTerm && (
              <div className="mt-3 pt-2 border-top">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="text-info">
                    <i className="bi bi-info-circle"></i> 
                    Showing results for: <strong>"{searchTerm}"</strong> in <strong>{searchField}</strong>
                  </div>
                  <div className="text-muted">
                    Found {filteredProducts.length} of {products.length} products
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="table-responsive shadow-sm bg-white rounded">
          <table className="table table-striped table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th>Product Code</th>
                <th>Images</th>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Reviews</th>
                <th>Stock</th>
                <th>Business</th>
                <th>Owner</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => {
                const productImages = product.images || (product.image ? [product.image] : []);
                const avgRating = product.averageRating || 0;
                const totalRatings = product.totalRatings || 0;
                
                return (
                  <tr key={product._id}>
                    <td>
                      <span className="badge bg-primary" style={{ fontSize: '12px' }}>
                        <i className="bi bi-tag me-1"></i>
                        {product.productCode || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        {productImages.slice(0, 3).map((img, idx) => (
                          <img
                            key={idx}
                            src={`http://localhost:5000/${img.replace(/\\/g, '/')}`}
                            alt={`${product.name} ${idx + 1}`}
                            className="rounded"
                            style={{ 
                              width: '45px', 
                              height: '45px', 
                              objectFit: 'cover',
                              cursor: 'pointer',
                              border: '1px solid #ddd'
                            }}
                            onClick={() => handleImageZoom(`http://localhost:5000/${img.replace(/\\/g, '/')}`)}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ))}
                        {productImages.length > 3 && (
                          <div 
                            className="bg-secondary text-white rounded d-flex align-items-center justify-content-center"
                            style={{ width: '45px', height: '45px', fontSize: '12px', cursor: 'pointer' }}
                            onClick={() => handleImageZoom(`http://localhost:5000/${productImages[3].replace(/\\/g, '/')}`)}
                          >
                            +{productImages.length - 3}
                          </div>
                        )}
                        {productImages.length === 0 && (
                          <div className="bg-secondary rounded d-flex align-items-center justify-content-center" 
                               style={{ width: '45px', height: '45px' }}>
                            <small className="text-white">No img</small>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="fw-bold">{product.name}</div>
                    </td>
                    <td>{product.category || 'N/A'}</td>
                    <td className="fw-bold text-success">
                      {typeof product.price === 'number' 
                        ? `$${product.price.toFixed(2)}` 
                        : product.price || 'N/A'}
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-1">
                        {renderStars(avgRating)}
                        <span className="fw-bold ms-1" style={{ fontSize: '13px' }}>
                          {avgRating.toFixed(1)}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-info text-dark">
                        {totalRatings}
                      </span>
                    </td>
                    <td>{product.availableQuantity || 0}</td>
                    <td>
                      <div>
                        <strong>{product.businessDetails?.businessName || 'N/A'}</strong>
                      </div>
                    </td>
                    <td>{product.businessDetails?.ownerName || 'N/A'}</td>
                    <td>
                      <div className="btn-group btn-group-sm" role="group">
                        <button 
                          className="btn btn-info" 
                          onClick={() => handleView(product._id)}
                        >
                          <i className="bi bi-eye"></i> View
                        </button>
                        <button 
                          className="btn btn-danger" 
                          onClick={() => handleDelete(product._id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="11" className="text-center py-4">
                    {searchTerm ? (
                      <div>
                        <i className="bi bi-search fs-1 text-muted"></i>
                        <p className="text-muted mt-2">
                          No products found matching "<strong>{searchTerm}</strong>" in {searchField}
                        </p>
                        <button 
                          className="btn btn-sm btn-outline-primary" 
                          onClick={clearSearch}
                        >
                          Clear Search
                        </button>
                      </div>
                    ) : (
                      <div>
                        <i className="bi bi-inbox fs-1 text-muted"></i>
                        <p className="text-muted mt-2">No products found in database</p>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Details Modal with All Reviews */}
      {showModal && selectedProduct && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Product Details</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-4 text-center">
                    {/* Product Code Badge */}
                    <div className="mb-2">
                      <span className="badge bg-primary" style={{ fontSize: '14px' }}>
                        <i className="bi bi-tag me-1"></i>
                        {selectedProduct.productCode || 'N/A'}
                      </span>
                    </div>

                    {/* Display multiple images in modal */}
                    <div className="d-flex flex-wrap gap-2 justify-content-center mb-3">
                      {(selectedProduct.images || [selectedProduct.image]).slice(0, 4).map((img, idx) => (
                        <img
                          key={idx}
                          src={`http://localhost:5000/${img.replace(/\\/g, '/')}`}
                          alt={`${selectedProduct.name} ${idx + 1}`}
                          className="rounded"
                          style={{ 
                            width: '100px', 
                            height: '100px', 
                            objectFit: 'cover',
                            cursor: 'pointer',
                            border: '1px solid #ddd'
                          }}
                          onClick={() => handleImageZoom(`http://localhost:5000/${img.replace(/\\/g, '/')}`)}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/100?text=No+Image';
                          }}
                        />
                      ))}
                    </div>

                    {/* Rating Display */}
                    <div className="mb-2">
                      <div className="d-flex justify-content-center align-items-center gap-2">
                        <span className="fw-bold fs-5">
                          {selectedProduct.averageRating?.toFixed(1) || '0.0'}
                        </span>
                        {renderLargeStars(selectedProduct.averageRating || 0)}
                      </div>
                      <small className="text-muted">
                        {selectedProduct.totalRatings || 0} reviews
                      </small>
                    </div>

                    <span className={`badge ${selectedProduct.availableQuantity > 0 ? 'bg-success' : 'bg-secondary'} fs-6`}>
                      {selectedProduct.availableQuantity > 0 ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="col-md-8">
                    <h4 className="mb-2">{selectedProduct.name}</h4>
                    <p className="text-muted mb-3">{selectedProduct.description || 'No description available'}</p>
                    <dl className="row">
                      <dt className="col-4">Product Code</dt>
                      <dd className="col-8">
                        <span className="badge bg-primary">
                          {selectedProduct.productCode || 'N/A'}
                        </span>
                      </dd>
                      
                      <dt className="col-4">Business</dt>
                      <dd className="col-8">
                        <strong>{selectedProduct.businessDetails?.businessName || 'N/A'}</strong>
                      </dd>
                      
                      <dt className="col-4">Owner</dt>
                      <dd className="col-8">{selectedProduct.businessDetails?.ownerName || 'N/A'}</dd>
                      
                      <dt className="col-4">Category</dt>
                      <dd className="col-8">{selectedProduct.category || 'N/A'}</dd>
                      
                      <dt className="col-4">Price</dt>
                      <dd className="col-8">
                        {typeof selectedProduct.price === 'number' 
                          ? `$${selectedProduct.price.toFixed(2)}` 
                          : selectedProduct.price || 'N/A'}
                      </dd>
                      
                      <dt className="col-4">Stock</dt>
                      <dd className="col-8">{selectedProduct.availableQuantity || 0}</dd>
                      
                      <dt className="col-4">Size</dt>
                      <dd className="col-8">{selectedProduct.size || 'N/A'}</dd>
                      
                      <dt className="col-4">Colors</dt>
                      <dd className="col-8">{selectedProduct.colors || 'N/A'}</dd>
                      
                      <dt className="col-4">Method</dt>
                      <dd className="col-8">{selectedProduct.method || 'N/A'}</dd>
                      
                      <dt className="col-4">Added Date</dt>
                      <dd className="col-8">
                        {selectedProduct.createdAt 
                          ? new Date(selectedProduct.createdAt).toLocaleDateString() 
                          : 'N/A'}
                      </dd>
                    </dl>
                  </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-4 pt-3 border-top">
                  <h5 className="fw-bold mb-3">
                    <i className="bi bi-chat-dots me-2"></i>
                    All Reviews ({selectedProduct.ratings?.length || 0})
                  </h5>
                  
                  {selectedProduct.ratings && selectedProduct.ratings.length > 0 ? (
                    <div className="reviews-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {selectedProduct.ratings.map((review, index) => (
                        <div key={index} className="card mb-2 border-0 bg-light">
                          <div className="card-body p-3">
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <div className="d-flex align-items-center gap-2">
                                  <strong>{review.userId?.name || 'Anonymous User'}</strong>
                                  <span className="badge bg-primary">Rating: {review.rating}/5</span>
                                </div>
                                <div className="mt-1">
                                  {renderStars(review.rating || 0)}
                                </div>
                              </div>
                              <small className="text-muted">
                                {formatDate(review.createdAt)}
                              </small>
                            </div>
                            {review.review && (
                              <p className="mb-0 mt-2 text-muted">{review.review}</p>
                            )}
                            {!review.review && (
                              <p className="mb-0 mt-2 text-muted fst-italic">No review text provided</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <i className="bi bi-chat fs-1 text-muted"></i>
                      <p className="text-muted mt-2">No reviews yet for this product</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
}

export default ProductList;