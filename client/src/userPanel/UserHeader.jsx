import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logoImage from "../assets/logo.png";

function UserHeader() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/"; // redirect
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

            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/categories">
                Categories
              </Link>
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
              <ul className="dropdown-menu">
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

                {/* Show Name if logged in */}
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
    </nav>
  );
}

export default UserHeader;