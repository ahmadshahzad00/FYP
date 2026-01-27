import React, { useState } from "react";
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";

function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    // here you can connect backend / API
  };

  return (
    <>
      <UserHeader />

      {/* Hero Section */}
      <div className="bg-primary text-light py-5">
        <div className="container text-center">
          <h2 className="fw-bold mb-3">Get in Touch</h2>
          <p className="opacity-75 fs-5 mb-4">
            We'd love to hear from you
          </p>
          <div className="d-flex justify-content-center">
            <span
              className="bg-light"
              style={{ width: "60px", height: "3px" }}
            ></span>
          </div>
        </div>
      </div>
      
      {/* Contact Info */}
      <div className="container my-5">
        <div className="row g-4 text-center">
          <div className="col-lg-6">
            <div className="card shadow border-0 h-100">
              <div className="card-body">
                <i className="bi bi-geo-alt fs-1 text-primary"></i>
                <h5 className="mt-3">Address</h5>
                <p>1-Km Main، 1.5 Km main Daska Rd, Sialkot, 51040, Pakistan</p>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card shadow border-0 h-100">
              <div className="card-body">
                <i className="bi bi-telephone fs-1 text-primary"></i>
                <h5 className="mt-3">Call Us</h5>
                <p>+92 319 0222 174</p>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card shadow border-0 h-100">
              <div className="card-body">
                <i className="bi bi-envelope fs-1 text-primary"></i>
                <h5 className="mt-3">Email Us</h5>
                <p>iamahmadshahzad228576@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map + Form */}
      <div className="container mb-5">
        <div className="row g-4">
          {/* Google Map */}
          <div className="col-lg-6">
            <iframe 
            title="map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3366.256350276577!2d74.51149557549113!3d32.46583447379515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391ec1fa58d5be41%3A0x4798a62d873730fd!2sUniversity%20of%20Sialkot!5e0!3m2!1sen!2s!4v1767015719291!5m2!1sen!2s"
            style={{ width: "100%", height: "400px", border: 0 }}
            allowfullscreen="" 
            loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>

          </div>

          {/* Contact Form */}
          <div className="col-lg-6">
            <div className="card shadow border-0">
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Your Name"
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="Your Email"
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <input
                        type="text"
                        name="subject"
                        className="form-control"
                        placeholder="Subject"
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <textarea
                        name="message"
                        className="form-control"
                        rows="5"
                        placeholder="Any query or message... " 
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>

                    <div className="col-12 text-center">
                      <button className="btn btn-primary w-100">
                        Send Message
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <UserFooter />
    </>
  );
}

export default ContactUs;
