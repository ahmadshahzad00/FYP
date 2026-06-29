import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import logoImage from "../assets/logo.png";

function UserHeader() {
  const [user, setUser] = useState(null);
  const [hasBusiness, setHasBusiness] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      checkBusiness(token);
    }

    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await axios.get(
        "http://localhost:5000/api/product/public-products"
      );
      
      if (response.data.success) {
        // Extract unique categories
        const uniqueCategories = [...new Set(
          response.data.products
            .filter(p => p.category)
            .map(p => p.category)
        )];
        setCategories(uniqueCategories);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      // Fallback categories
      setCategories([
        "Sports Goods",
        "Leather Products",
        "Surgical Instruments",
        "Textile & Apparel",
        "Kids Toys",
        "Safety Equipment"
      ]);
    } finally {
      setLoadingCategories(false);
    }
  };

  const checkBusiness = async (token) => {
    try {
      await axios.get("http://localhost:5000/api/business/my-business", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setHasBusiness(true);
    } catch (err) {
      setHasBusiness(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setHasBusiness(false);
    window.location.href = "/";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm px-4">
      <div className="container-fluid">

        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <img
            src={logoImage}
            alt="Logo"
            width="60"
            height="60"
            className="rounded-circle"
          />
          <span className="fw-bold fs-5">Sialkot Export Mella</span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#userNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu */}
        <div className="collapse navbar-collapse" id="userNavbar">
          <ul className="navbar-nav ms-auto align-items-center gap-3">

            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/trendingProducts">
                Trending Products
              </Link>
            </li>

            {/* Categories Dropdown - Hover */}
            <li className="nav-item dropdown category-dropdown">
              <Link
                className="nav-link dropdown-toggle fw-semibold"
                to="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Categories
              </Link>
              <ul className="dropdown-menu dropdown-menu-end shadow-lg category-menu">
                <li>
                  <Link className="dropdown-item fw-bold text-primary" to="/categories">
                    <i className="bi bi-grid-3x3-gap-fill me-2"></i>
                    All Categories
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                {loadingCategories ? (
                  <li className="text-center py-2">
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted small mt-1">Loading categories...</p>
                  </li>
                ) : categories.length > 0 ? (
                  categories.map((category, index) => (
                    <li key={index}>
                      <Link
                        className="dropdown-item category-item"
                        to={`/products?category=${encodeURIComponent(category)}`}
                      >
                        <i className="bi bi-tag me-2 text-secondary"></i>
                        {category}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="text-center py-2 text-muted">
                    <i className="bi bi-box fs-5"></i>
                    <p className="small mb-0">No categories available</p>
                  </li>
                )}
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <Link className="dropdown-item text-primary" to="/categories">
                    <i className="bi bi-arrow-right me-2"></i>
                    View All Categories
                  </Link>
                </li>
              </ul>
            </li>

            {/* More */}
            <li className="nav-item dropdown">
              <span
                className="nav-link dropdown-toggle fw-semibold"
                role="button"
                data-bs-toggle="dropdown"
              >
                More
              </span>
              <ul className="dropdown-menu dropdown-menu-end shadow">
                <li><Link className="dropdown-item" to="/aboutus">About Us</Link></li>
                <li><Link className="dropdown-item" to="/contactus">Contact Us</Link></li>
                <li><Link className="dropdown-item" to="/FAQs">FAQ</Link></li>
              </ul>
            </li>

            {/* USER SECTION */}
            <li className="nav-item dropdown">
              <span
                className="nav-link dropdown-toggle d-flex align-items-center gap-2"
                role="button"
                data-bs-toggle="dropdown"
              >
                <i className="bi bi-person-circle fs-4"></i>
                {user && <span className="fw-semibold">{user.name}</span>}
              </span>

              <ul className="dropdown-menu dropdown-menu-end shadow">

                {/* NOT LOGGED IN */}
                {!user && (
                  <>
                    <li>
                      <Link className="dropdown-item" to="/user-login">
                        <i className="bi bi-box-arrow-in-right me-2"></i> Login
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/user-register">
                        <i className="bi bi-person-plus me-2"></i> Register
                      </Link>
                    </li>
                  </>
                )}

                {/* LOGGED IN */}
                {user && (
                  <>
                    <li>
                      <Link className="dropdown-item" to="/userProfile">
                        <i className="bi bi-person me-2"></i> Profile
                      </Link>
                    </li>

                    {/* BUSINESS SECTION */}
                    {hasBusiness && (
                      <>
                        <li><hr className="dropdown-divider" /></li>

                        <li className="dropdown-header text-primary fw-bold">
                          Business
                        </li>

                        <li>
                          <Link className="dropdown-item" to="/business-profile">
                            <i className="bi bi-briefcase me-2"></i>
                            Business Dashboard
                          </Link>
                        </li>
                      </>
                    )}

                    <li><hr className="dropdown-divider" /></li>

                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={handleLogout}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i> Logout
                      </button>
                    </li>
                  </>
                )}

              </ul>
            </li>

          </ul>
        </div>
      </div>

      {/* CSS for hover effect */}
      <style jsx="true">{`
        .category-dropdown:hover .category-menu {
          display: block;
        }
        
        .category-dropdown .dropdown-menu {
          display: none;
          min-width: 220px;
          max-height: 400px;
          overflow-y: auto;
          animation: slideDown 0.3s ease;
        }
        
        .category-dropdown:hover .dropdown-menu {
          display: block;
        }
        
        .category-item:hover {
          background-color: #f0f7ff;
          padding-left: 20px !important;
          transition: all 0.2s ease;
        }
        
        .category-item {
          transition: all 0.2s ease;
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Custom scrollbar for categories */
        .category-menu::-webkit-scrollbar {
          width: 6px;
        }
        
        .category-menu::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .category-menu::-webkit-scrollbar-thumb {
          background: #0d6efd;
          border-radius: 10px;
        }
        
        .category-menu::-webkit-scrollbar-thumb:hover {
          background: #0b5ed7;
        }
        
        /* For mobile - click to open */
        @media (max-width: 991.98px) {
          .category-dropdown .dropdown-menu {
            display: none;
          }
          .category-dropdown.show .dropdown-menu {
            display: block;
          }
          .category-dropdown:hover .dropdown-menu {
            display: none;
          }
          .category-dropdown.show:hover .dropdown-menu {
            display: block;
          }
        }
      `}</style>
    </nav>
  );
}

export default UserHeader;