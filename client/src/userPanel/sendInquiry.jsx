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
    productInterest: '',
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
        productInterest: '',
        quantity: '',
        specifications: '',
        message: ''
      });

      setSubmitMessage('Thank you! Your inquiry has been sent successfully.');
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

              <div className="card-header bg-success text-white text-center py-4">
                <h2 className="mb-0">
                  <i className="bi bi-chat-quote-fill me-2"></i>
                  Send Business Inquiry
                </h2>
              </div>

              <div className="card-body p-4">

                {submitMessage && (
                  <div className="alert alert-success">
                    {submitMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit}>

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
                      <label className="form-label">Company</label>
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

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Subject</label>
                      <select
                        className="form-select"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      >
                        <option value="">Select</option>
                        <option value="pricing">Pricing</option>
                        <option value="bulk">Bulk Order</option>
                        <option value="custom">Custom Design</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Product Interest</label>
                      <input
                        type="text"
                        className="form-control"
                        name="productInterest"
                        value={formData.productInterest}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Quantity</label>
                      <input
                        type="text"
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
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Message</label>
                    <textarea
                      className="form-control"
                      rows="5"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    ></textarea>
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn btn-success btn-lg"
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