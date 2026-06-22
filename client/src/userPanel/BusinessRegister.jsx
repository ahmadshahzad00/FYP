import React, { useState } from "react";
import axios from "axios";
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

  // FILE STATES
  const [chamberFile, setChamberFile] = useState(null);
  const [cnicFrontFile, setCnicFrontFile] = useState(null);
  const [cnicBackFile, setCnicBackFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      // TEXT FIELDS
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      // FILES
      data.append("chamberMembership", chamberFile);
      data.append("cnicFront", cnicFrontFile);
      data.append("cnicBack", cnicBackFile);
      if (logoFile) data.append("logo", logoFile);

      await axios.post(
        "http://localhost:5000/api/business",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Business registration request submitted successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Submission failed");
    }
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
                Register your manufacturing business and connect with global buyers
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

                <form onSubmit={handleSubmit}>

                  {/* BUSINESS INFO */}
                  <div className="form-section-title">Business Information</div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Company Name *</label>
                      <input type="text" name="companyName" className="form-control" required onChange={handleChange}/>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Owner / Contact Person *</label>
                      <input type="text" name="ownerName" className="form-control" required onChange={handleChange}/>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Business Email *</label>
                      <small className="text-muted d-block">We will use this to contact you about your business</small>
                      <input type="email" name="email" className="form-control" required onChange={handleChange}/>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Business Phone *</label>
                      <input type="tel" name="phone" className="form-control" required onChange={handleChange}/>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">WhatsApp Number *</label>
                      <input type="tel" name="whatsapp" className="form-control" required onChange={handleChange}/>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Year Established *</label>
                      <input type="number" name="yearEstablished" className="form-control" required onChange={handleChange}/>
                    </div>
                  </div>

                  {/* LEGAL */}
                  <div className="form-section-title mt-4">Factory & Legal Verification</div>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Factory Address *</label>
                      <input type="text" name="factoryAddress" className="form-control" required onChange={handleChange}/>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Chamber Member ID *</label>
                      <small className="text-muted d-block">Enter your Chamber of Commerce Member ID</small>
                      <input type="text" name="memberId" className="form-control" required onChange={handleChange} placeholder="e.g., C-001"/>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Chamber Membership (PDF) *</label>
                      <input type="file" className="form-control" required
                        onChange={(e) => setChamberFile(e.target.files[0])}/>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">CNIC Front *</label>
                      <input type="file" className="form-control" required
                        onChange={(e) => setCnicFrontFile(e.target.files[0])}/>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">CNIC Back *</label>
                      <input type="file" className="form-control" required
                        onChange={(e) => setCnicBackFile(e.target.files[0])}/>
                    </div>
                  </div>

                  {/* PRODUCTS */}
                  <div className="form-section-title mt-4">Products & Category</div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Product Category *</label>
                      <select name="category" className="form-select" required onChange={handleChange}>
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
                      <label className="form-label">Products *</label>
                      <input type="text" name="products" className="form-control" required onChange={handleChange}/>
                    </div>
                  </div>

                  {/* SOCIAL MEDIA */}
                  <div className="form-section-title mt-4">Social Media Links (Optional)</div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <input type="url" name="facebook" className="form-control" placeholder="Facebook" onChange={handleChange}/>
                    </div>
                    <div className="col-md-6">
                      <input type="url" name="instagram" className="form-control" placeholder="Instagram" onChange={handleChange}/>
                    </div>
                    <div className="col-md-6">
                      <input type="url" name="twitter" className="form-control" placeholder="Twitter" onChange={handleChange}/>
                    </div>
                    <div className="col-md-6">
                      <input type="url" name="tiktok" className="form-control" placeholder="TikTok" onChange={handleChange}/>
                    </div>
                    <div className="col-md-6">
                      <input type="url" name="pinterest" className="form-control" placeholder="Pinterest" onChange={handleChange}/>
                    </div>
                  </div>

                  {/* EXTRA */}
                  <div className="form-section-title mt-4">Additional Details</div>
                  <div className="row g-3">
                    <div className="col-12">
                      <textarea name="description" rows="4" className="form-control" placeholder="Describe your business..." onChange={handleChange}></textarea>
                    </div>

                    <div className="col-md-6">
                      <input type="url" name="website" className="form-control" placeholder="Website" onChange={handleChange}/>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Company Logo</label>
                      <input type="file" className="form-control"
                        onChange={(e) => setLogoFile(e.target.files[0])}/>
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