import React, { useState } from "react";
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";

function BusinessRegister() {
  const [formData, setFormData] = useState({
    companyName: "",
    ownerName: "",
    email: "",
    phone: "",
    whatsapp: "",
    yearEstablished: "",
    factoryAddress: "",
    ntnNumber: "",
    chamberMembership: "",
    cnicFront: "",
    isoCertificate: "",
    businessLicense: "",
    category: "",
    products: "",
    website: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Business registration submitted successfully!");
  };

  return (
    <>
      <UserHeader />
      {/* HERO SECTION */}
      <section className="hero-gradient text-light py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-7">
              <h1 className="fw-bold mb-3">Grow Your Business in Sialkot</h1>
              <p className="lead opacity-75">
                Register your manufacturing business and connect with global buyer
              </p>
            </div>
            <div className="col-md-5 text-md-end mt-4 mt-md-0">
              <span className="location-pill">
                <i className="bi bi-geo-alt-fill me-2"></i>
                Sialkot, Pakistan
              </span>
            </div>
          </div>
        </div>
      </section>
      {/* FORM SECTION */}
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card shadow-lg border-0 card-soft">
              <div className="card-body p-4 p-md-5">

                <div className="alert alert-info">
                  <strong>Business Location:</strong> Sialkot, Pakistan
                </div>
                <form onSubmit={handleSubmit}>
                  {/* BUSINESS INFO */}
                  <div className="form-section-title">Business Information</div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Company Name *</label>
                      <input
                        type="text"
                        name="companyName"
                        className="form-control"
                        required
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Owner / Contact Person *</label>
                      <input
                        type="text"
                        name="ownerName"
                        className="form-control"
                        required
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Business Email *</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        required
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Business Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        className="form-control"
                        required
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">WhatsApp Number *</label>
                      <input
                        type="tel"
                        name="whatsapp"
                        className="form-control"
                        placeholder="+92XXXXXXXXXX"
                        required
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Year Established *</label>
                      <input
                        type="number"
                        name="yearEstablished"
                        className="form-control"
                        placeholder="e.g. 2010"
                        required
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* LEGAL & VERIFICATION */}
                  <div className="form-section-title mt-4">
                    Factory & Legal Verification
                  </div>

                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Factory Address *</label>
                      <input
                        type="text"
                        name="factoryAddress"
                        className="form-control"
                        required
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">NTN Number *</label>
                      <input
                        type="text"
                        name="ntnNumber"
                        className="form-control"
                        required
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Chamber of Commerce Membership
                      </label>
                      <input
                        type="file"
                        name="chamberMembership"
                        className="form-control"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">CNIC Front Picture *</label>
                      <input
                        type="file"
                        name="cnicFront"
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        ISO Certificate (If Available)
                      </label>
                      <input
                        type="file"
                        name="isoCertificate"
                        className="form-control"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Business License *
                      </label>
                      <input
                        type="file"
                        name="businessLicense"
                        className="form-control"
                        required
                      />
                    </div>
                  </div>

                  {/* PRODUCT INFO */}
                  <div className="form-section-title mt-4">
                    Products & Category
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Product Category *</label>
                      <select
                        name="category"
                        className="form-select"
                        required
                        onChange={handleChange}
                      >
                        <option value="">Select Category</option>
                        <option>Sports Goods</option>
                        <option>Leather Products</option>
                        <option>Surgical Instruments</option>
                        <option>Textile & Apparel</option>
                        <option>Kids Toys</option>
                        <option>Safety Equipment</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Products You Manufacture *
                      </label>
                      <input
                        type="text"
                        name="products"
                        className="form-control"
                        placeholder="Footballs, Gloves, Jackets"
                        required
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* EXTRA */}
                  <div className="form-section-title mt-4">
                    Additional Details
                  </div>

                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Company Description</label>
                      <textarea
                        name="description"
                        rows="4"
                        className="form-control"
                        onChange={handleChange}
                      ></textarea>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Website (Optional)</label>
                      <input
                        type="url"
                        name="website"
                        className="form-control"
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Company Logo</label>
                      <input type="file" className="form-control" />
                    </div>
                  </div>

                  <div className="text-center mt-5">
                    <button className="btn btn-primary btn-lg px-5 shadow">
                      Submit Business Registration
                    </button>
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

export default BusinessRegister;
