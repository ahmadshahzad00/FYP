import React from "react";
import { Link } from "react-router-dom";
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";

function FAQ() {
  return (
    <>
      <UserHeader />

      {/* Page Header */}
      <section className="bg-primary text-light py-5">
        <div className="container text-center">
          <h1 className="fw-bold mb-2">Frequently Asked Questions</h1>
          <p className="lead mb-0">
            Find answers to common questions about our platform
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-9">

            <div className="accordion accordion-flush" id="faqAccordion">

              {/* FAQ 1 */}
              <div className="accordion-item mb-3 shadow-sm rounded">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button fw-semibold"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#faq1"
                  >
                    <i className="bi bi-question-circle me-2 text-primary"></i>
                    What is this platform about?
                  </button>
                </h2>
                <div
                  id="faq1"
                  className="accordion-collapse collapse show"
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body text-muted">
                    This platform connects manufacturers and exporters from
                    Sialkot, Pakistan with buyers worldwide, showcasing quality
                    products in sports, leather, surgical, and related industries.
                  </div>
                </div>
              </div>

              {/* FAQ 2 */}
              <div className="accordion-item mb-3 shadow-sm rounded">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed fw-semibold"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#faq2"
                  >
                    <i className="bi bi-building me-2 text-primary"></i>
                    How can a company list its products?
                  </button>
                </h2>
                <div
                  id="faq2"
                  className="accordion-collapse collapse"
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body text-muted">
                    Companies can register their business, create a profile,
                    and add products through the dashboard. Currently, the
                    platform operates as a frontend demo.
                  </div>
                </div>
              </div>

              {/* FAQ 3 */}
              <div className="accordion-item mb-3 shadow-sm rounded">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed fw-semibold"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#faq3"
                  >
                    <i className="bi bi-cash-stack me-2 text-primary"></i>
                    Is there any registration fee?
                  </button>
                </h2>
                <div
                  id="faq3"
                  className="accordion-collapse collapse"
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body text-muted">
                    No, registration is completely free at the moment.
                    Premium features may be introduced in future updates.
                  </div>
                </div>
              </div>

              {/* FAQ 4 */}
              <div className="accordion-item mb-3 shadow-sm rounded">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed fw-semibold"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#faq4"
                  >
                    <i className="bi bi-chat-dots me-2 text-primary"></i>
                    Can international buyers contact sellers directly?
                  </button>
                </h2>
                <div
                  id="faq4"
                  className="accordion-collapse collapse"
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body text-muted">
                    Yes, buyers can view company profiles and use the provided
                    contact details to communicate directly with sellers.
                  </div>
                </div>
              </div>

              {/* FAQ 5 */}
              <div className="accordion-item mb-3 shadow-sm rounded">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed fw-semibold"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#faq5"
                  >
                    <i className="bi bi-shield-check me-2 text-primary"></i>
                    Are products verified before listing?
                  </button>
                </h2>
                <div
                  id="faq5"
                  className="accordion-collapse collapse"
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body text-muted">
                    At this stage, products are listed directly by registered
                    companies. Product verification features will be added
                    in future versions.
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="faq-cta-section py-5">
        <div className="container">
          <div className="row align-items-center justify-content-between text-center text-lg-start">

            <div className="col-lg-8 mb-4 mb-lg-0">
              <h3 className="fw-bold mb-2">Still have questions?</h3>
              <p className="text-muted mb-0">
                Our support team is always ready to help you with any questions
                regarding products, exporters, or platform usage.
              </p>
            </div>
            <div className="col-lg-4 text-center text-lg-end">
              <Link to="/contactus" className="btn btn-outline-primary btn-lg px-4">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </section>

      <UserFooter />
    </>
  );
}

export default FAQ;
