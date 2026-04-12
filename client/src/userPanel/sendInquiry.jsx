import React, { useState } from 'react';
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";

function SendInquiry() {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    productName: '',
    quantity: '',
    specifications: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      // Demo API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        subject: '',
        productName: '',
        quantity: '',
        specifications: '',
        message: ''
      });

      setSubmitMessage('Thank you! Your product inquiry has been sent successfully.');
      setTimeout(() => setSubmitMessage(''), 5000);

    } catch (error) {
      setSubmitMessage('Error sending inquiry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <UserHeader />

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">

            <div className="card shadow-lg border-0">

              <div className="card-header bg-primary text-white text-center py-4">
                <h2 className="mb-0">
                  <i className="bi bi-box-seam me-2"></i>
                  Product Inquiry
                </h2>
              </div>

              <div className="card-body p-4">

                {submitMessage && (
                  <div className="alert alert-success">
                    {submitMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit}>

                  {/* USER INFO */}
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Company (Optional)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Phone</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* PRODUCT INFO */}
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Inquiry Type</label>
                      <select
                        className="form-select"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      >
                        <option value="">Select</option>
                        <option value="pricing">Price Request</option>
                        <option value="bulk">Bulk Order</option>
                        <option value="custom">Customization</option>
                        <option value="availability">Availability</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Product Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="productName"
                        value={formData.productName}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        placeholder="e.g. Football, Cricket Bat"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Quantity Required</label>
                      <input
                        type="number"
                        className="form-control"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Specifications</label>
                      <input
                        type="text"
                        className="form-control"
                        name="specifications"
                        value={formData.specifications}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        placeholder="Size, color, material, etc."
                      />
                    </div>
                  </div>

                  {/* MESSAGE */}
                  <div className="mb-3">
                    <label className="form-label">Additional Message</label>
                    <textarea
                      className="form-control"
                      rows="5"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      placeholder="Write your requirements..."
                    ></textarea>
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Inquiry"}
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

export default SendInquiry;