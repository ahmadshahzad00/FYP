import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [showCategoryProducts, setShowCategoryProducts] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        "http://localhost:5000/api/product/public-products"
      );

      if (response.data.success) {
        const allProducts = response.data.products;
        setProducts(allProducts);

        // Extract unique categories with product counts
        const categoryMap = {};
        allProducts.forEach(product => {
          if (product.category) {
            const categoryName = product.category.trim();
            if (!categoryMap[categoryName]) {
              categoryMap[categoryName] = {
                title: categoryName,
                count: 0,
                icon: getCategoryIcon(categoryName),
                products: []
              };
            }
            categoryMap[categoryName].count++;
            categoryMap[categoryName].products.push(product);
          }
        });

        const categoryList = Object.values(categoryMap);
        setCategories(categoryList);

        // Get featured products (top rated or recent)
        const featured = [...allProducts]
          .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
          .slice(0, 6);
        setFeaturedProducts(featured);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(err.response?.data?.message || "Failed to load categories");
      
      // Fallback categories
      setCategories([
        { title: "Sports Goods", count: 0, icon: "⚽" },
        { title: "Leather Products", count: 0, icon: "🧥" },
        { title: "Surgical Instruments", count: 0, icon: "🩺" },
        { title: "Textile & Apparel", count: 0, icon: "👕" },
        { title: "Safety Equipment", count: 0, icon: "🦺" },
        { title: "Custom Manufacturing", count: 0, icon: "🏭" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    if (!category) return "📦";
    
    const lowerCategory = category.toLowerCase().trim();
    
    // Sports related
    if (lowerCategory.includes("sport") || 
        lowerCategory.includes("football") || 
        lowerCategory.includes("cricket") || 
        lowerCategory.includes("ball") ||
        lowerCategory.includes("glove")) {
      return "⚽";
    }
    
    // Leather related
    if (lowerCategory.includes("leather") || 
        lowerCategory.includes("jacket") || 
        lowerCategory.includes("bag")) {
      return "🧥";
    }
    
    // Medical/Surgical related
    if (lowerCategory.includes("surgical") || 
        lowerCategory.includes("medical") || 
        lowerCategory.includes("instrument") ||
        lowerCategory.includes("health")) {
      return "🩺";
    }
    
    // Textile/Apparel related
    if (lowerCategory.includes("textile") || 
        lowerCategory.includes("apparel") || 
        lowerCategory.includes("clothing") ||
        lowerCategory.includes("fashion") ||
        lowerCategory.includes("garment")) {
      return "👕";
    }
    
    // Electronics related
    if (lowerCategory.includes("electronic") || 
        lowerCategory.includes("tech") || 
        lowerCategory.includes("device") ||
        lowerCategory.includes("gadget")) {
      return "📱";
    }
    
    // Books/Education related
    if (lowerCategory.includes("book") || 
        lowerCategory.includes("education") || 
        lowerCategory.includes("learning") ||
        lowerCategory.includes("stationery")) {
      return "📚";
    }
    
    // Toys related
    if (lowerCategory.includes("toy") || 
        lowerCategory.includes("kids") || 
        lowerCategory.includes("children") ||
        lowerCategory.includes("game")) {
      return "🧸";
    }
    
    // Safety related
    if (lowerCategory.includes("safety") || 
        lowerCategory.includes("security") || 
        lowerCategory.includes("protective") ||
        lowerCategory.includes("helmet")) {
      return "🦺";
    }
    
    // Food related
    if (lowerCategory.includes("food") || 
        lowerCategory.includes("beverage") || 
        lowerCategory.includes("drink") ||
        lowerCategory.includes("restaurant")) {
      return "🍕";
    }
    
    // Furniture related
    if (lowerCategory.includes("furniture") || 
        lowerCategory.includes("wood") || 
        lowerCategory.includes("chair") ||
        lowerCategory.includes("table")) {
      return "🪑";
    }
    
    // Jewelry related
    if (lowerCategory.includes("jewelry") || 
        lowerCategory.includes("jewellery") || 
        lowerCategory.includes("accessory") ||
        lowerCategory.includes("watch")) {
      return "💎";
    }
    
    // Default icon based on category name
    const defaultIcons = ["📦", "📦", "📦", "📦", "📦"];
    const hash = category.length % defaultIcons.length;
    return defaultIcons[hash];
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCategoryProducts(category.products || []);
    setShowCategoryProducts(true);
  };

  const handleBackToCategories = () => {
    setShowCategoryProducts(false);
    setSelectedCategory(null);
    setCategoryProducts([]);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) - fullStars >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<i key={i} className="bi bi-star-fill text-warning" style={{ fontSize: '12px' }}></i>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<i key={i} className="bi bi-star-half text-warning" style={{ fontSize: '12px' }}></i>);
      } else {
        stars.push(<i key={i} className="bi bi-star text-secondary" style={{ fontSize: '12px' }}></i>);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <>
        <UserHeader />
        <section className="py-5 bg-light">
          <div className="container text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading categories...</p>
          </div>
        </section>
        <UserFooter />
      </>
    );
  }

  if (error) {
    return (
      <>
        <UserHeader />
        <section className="py-5 bg-light">
          <div className="container">
            <div className="alert alert-danger text-center">
              <i className="bi bi-exclamation-triangle fs-1"></i>
              <h4 className="mt-2">Error Loading Categories</h4>
              <p>{error}</p>
              <button className="btn btn-primary" onClick={fetchData}>
                Try Again
              </button>
            </div>
          </div>
        </section>
        <UserFooter />
      </>
    );
  }

  return (
    <>
      <UserHeader />

      <section className="py-5 bg-light">
        <div className="container-fluid px-4">
          <div className="row">

            {/* Sidebar */}
            <div className="col-lg-3 col-md-4 mb-4">
              <div className="card shadow-sm border-0 sticky-top" style={{ top: "90px" }}>
                <div className="card-body p-3">
                  <h6 className="fw-bold mb-3 text-primary">Browse Categories</h6>

                  <ul className="nav flex-column gap-2 sidebar-menu">
                    <li className="nav-item">
                      <Link 
                        className="nav-link fw-semibold text-dark" 
                        to="/"
                        onClick={handleBackToCategories}
                      >
                        <i className="bi bi-house me-2"></i>Home
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link 
                        className="nav-link fw-semibold text-primary" 
                        to="/trendingProducts"
                      >
                        <i className="bi bi-fire me-2"></i>Trending
                      </Link>
                    </li>
                    <hr />
                    {categories.map((cat, index) => (
                      <li className="nav-item" key={index}>
                        <button
                          className={`nav-link text-dark w-100 text-start ${
                            selectedCategory?.title === cat.title ? 'active bg-primary text-white rounded' : ''
                          }`}
                          onClick={() => handleCategoryClick(cat)}
                          style={{ border: 'none', background: 'transparent' }}
                        >
                          <span className="me-2">{cat.icon || "📦"}</span>
                          {cat.title}
                          <span className="badge bg-secondary ms-2">{cat.count}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-lg-9 col-md-8">

              {!showCategoryProducts ? (
                <>
                  {/* Heading */}
                  <div className="mb-4">
                    <h2 className="fw-bold">Products Manufactured in Sialkot</h2>
                    <p className="text-muted">
                      Discover globally recognized products crafted by skilled manufacturers
                    </p>
                  </div>

                  {/* Featured Products Section */}
                  {featuredProducts.length > 0 && (
                    <div className="mb-5">
                      <div className="d-flex align-items-center mb-3">
                        <h4 className="fw-bold mb-0">
                          <i className="bi bi-star-fill text-warning me-2"></i>
                          Featured Products
                        </h4>
                        <span className="badge bg-primary ms-2">Top Rated</span>
                      </div>
                      <div className="row g-3">
                        {featuredProducts.slice(0, 4).map((product) => (
                          <div className="col-lg-3 col-md-6" key={product._id}>
                            <div className="card h-100 border-0 shadow-sm product-card">
                              <div className="card-body p-3 text-center">
                                <div
                                  className="bg-light rounded d-flex align-items-center justify-content-center mx-auto mb-2"
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
                                <h6 className="fw-semibold mb-1 text-truncate" style={{ fontSize: "13px" }}>
                                  {product.name}
                                </h6>
                                <div className="mb-1">
                                  {renderStars(product.averageRating || 0)}
                                </div>
                                <p className="fw-bold text-success mb-2" style={{ fontSize: "13px" }}>
                                  Rs. {parseFloat(product.price).toLocaleString()}
                                </p>
                                <Link
                                  to={`/publicBusinessProfile/${product.businessId?._id}`}
                                  className="btn btn-outline-primary btn-sm w-100"
                                  style={{ fontSize: "12px", padding: "4px 8px" }}
                                >
                                  View Product
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category Cards */}
                  <h4 className="fw-bold mb-3">All Categories</h4>
                  <div className="row">
                    {categories.map((item, index) => (
                      <div key={index} className="col-xl-4 col-lg-6 col-md-6 mb-4">
                        <div className="card h-100 border-0 shadow-sm text-center category-card">
                          <div className="card-body p-4">
                            <div className="display-5 mb-3">{item.icon || "📦"}</div>
                            <h6 className="fw-bold mb-2">{item.title}</h6>
                            <p className="text-muted mb-2">
                              {item.count} product{item.count !== 1 ? 's' : ''} available
                            </p>
                            <button
                              className="btn btn-outline-primary btn-sm px-4"
                              onClick={() => handleCategoryClick(item)}
                            >
                              View Products
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  {/* Category Products View */}
                  <div className="mb-4">
                    <button
                      className="btn btn-outline-secondary mb-3"
                      onClick={handleBackToCategories}
                    >
                      <i className="bi bi-arrow-left me-2"></i>Back to Categories
                    </button>
                    <h2 className="fw-bold">
                      {selectedCategory?.icon || "📦"} {selectedCategory?.title}
                    </h2>
                    <p className="text-muted">
                      {categoryProducts.length} product{categoryProducts.length !== 1 ? 's' : ''} found in this category
                    </p>
                  </div>

                  {categoryProducts.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="bi bi-box fs-1 text-muted"></i>
                      <h5 className="mt-3 text-muted">No products in this category</h5>
                    </div>
                  ) : (
                    <div className="row g-3">
                      {categoryProducts.map((product) => (
                        <div className="col-xl-3 col-lg-4 col-md-6 mb-3" key={product._id}>
                          <div className="card h-100 border-0 shadow-sm product-card">
                            <div className="card-body p-3">
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

                              <div className="text-center mb-1">
                                {renderStars(product.averageRating || 0)}
                              </div>

                              <p className="text-center mb-2 fw-bold text-success" style={{ fontSize: "13px" }}>
                                Rs. {parseFloat(product.price).toLocaleString()}
                              </p>

                              <Link
                                to={`/publicBusinessProfile/${product.businessId?._id}`}
                                className="btn btn-outline-primary btn-sm w-100"
                                style={{ fontSize: "12px", padding: "4px 8px" }}
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* CTA - Only show on main categories view */}
              {/* {!showCategoryProducts && (
                <div className="row mt-4 align-items-center bg-primary text-light rounded shadow p-4">
                  <div className="col-md-8">
                    <h4 className="fw-bold mb-1">
                      <i className="bi bi-rocket-takeoff me-2"></i>
                      Are You a Manufacturer or Exporter?
                    </h4>
                    <p className="mb-0 opacity-75">
                      Register your business and showcase your products to global buyers.
                    </p>
                  </div>
                  <div className="col-md-4 text-md-end mt-3 mt-md-0">
                    <Link
                      to="/business-register"
                      className="btn btn-light btn-lg px-4 fw-semibold"
                    >
                      Register Now
                    </Link>
                  </div>
                </div>
              )} */}

            </div>
          </div>
        </div>
      </section>

      <UserFooter />

      {/* CSS */}
      <style jsx="true">{`
        .category-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .category-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
        }
        .product-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
        }
        .text-truncate {
          max-width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sidebar-menu .nav-link {
          padding: 8px 12px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        .sidebar-menu .nav-link:hover {
          background-color: #f0f7ff;
          transform: translateX(5px);
        }
        .sidebar-menu .nav-link.active {
          background-color: #0d6efd;
          color: white !important;
        }
        .sidebar-menu .nav-link.active:hover {
          background-color: #0b5ed7;
        }
        .sidebar-menu .nav-link button {
          cursor: pointer;
        }
      `}</style>
    </>
  );
}

export default Categories;