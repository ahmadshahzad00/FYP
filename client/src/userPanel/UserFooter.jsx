import React, { useState } from "react";
import { Link } from 'react-router-dom';

function UserFooter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Subscribed Email:", email);
    // connect API / backend here
  };

  return (
    <>
      {/* Newsletter Section */}
      <div className="footer-newsletter py-5">
        <div className="container">
          <div className="row align-items-center">

            {/* Left: Quick Links */}
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h5 className="fw-bold mb-3">Quick Links....</h5>

              <ul className="list-unstyled footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/aboutus">About Us</Link></li>
                <li><Link to="/FAQ">FAQs</Link></li>
                <li><Link to="/contactus">Contact Us</Link></li>
              </ul>
            </div>

            {/* Right: Newsletter */}
            <div className="col-lg-6">
              <h5 className="fw-bold mb-2">Join Our Platform</h5>
              <p className="text-muted mb-3">
                Get updates about new exporters, products, and platform features.
              </p>

              <form onSubmit={handleSubmit} className="d-flex gap-2">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <button className="btn btn-primary px-4">
                  Subscribe
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-light text-center py-3">
        <p className="mb-0">
          © {new Date().getFullYear()} Sialkot Export Mella. All Rights Reserved.
        </p>
      </footer>
    </>
  );
}

export default UserFooter;
