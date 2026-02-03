import React from "react";
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";

function PublicBusinessProfile() {
  const businessInfo = {
    name: "ABC Sports Industries",
    description:
      "ABC Sports Industries is a leading manufacturer and exporter of high-quality sports goods from Sialkot, Pakistan. We specialize in FIFA-approved footballs and custom sports equipment.",
    email: "contact@abcsports.com",
    phone: "+92 300 1234567",
    whatsapp: "+92 300 1234567",
    location: "Sialkot, Pakistan",
    established: "2012",
    certifications: ["ISO 9001", "FIFA Approved"],
    exportMarkets: ["Germany", "UK", "USA", "UAE"],
  };

  const products = [
    {
      id: 1,
      name: "Professional Football",
      category: "Sports",
      description: "FIFA standard hand-stitched football",
      size: "Size 5",
      colors: "White, Black",
      price: "$12",
      method: "Hand-stitched",
      moq: 500,
    },
    {
      id: 2,
      name: "Professional Football",
      category: "Sports",
      description: "FIFA standard hand-stitched football",
      size: "Size 5",
      colors: "White, Black",
      price: "$12",
      method: "Hand-stitched",
      moq: 500,
    },
    {
      id: 3,
      name: "Professional Football",
      category: "Sports",
      description: "FIFA standard hand-stitched football",
      size: "Size 5",
      colors: "White, Black",
      price: "$12",
      method: "Hand-stitched",
      moq: 500,
    },
  ];

  return (
    <>
      <UserHeader />

      {/* HERO / HEADER */}
      <section className="bg-primary text-light py-5">
        <div className="container">
          <div className="d-flex align-items-center">
            <div className="logo-circle me-4">LOGO</div>
            <div>
              <h2 className="fw-bold mb-1">{businessInfo.name}</h2>
              <p className="mb-2 opacity-75">{businessInfo.location}</p>
              <span className="badge bg-success me-2">
                <i className="bi bi-patch-check-fill me-1"></i>
                Verified Sialkot Exporter
              </span>
              <span className="badge bg-light text-dark">
                Made in Pakistan 🇵🇰
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="container my-5">
        <div className="row">
          {/* LEFT CONTENT */}
          <div className="col-lg-8">
            {/* ABOUT */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body">
                <h5 className="fw-bold mb-3">About Company</h5>
                <p className="text-muted">{businessInfo.description}</p>

                <div className="row mt-3">
                  <div className="col-md-6">
                    <p><strong>Established:</strong> {businessInfo.established}</p>
                    <p><strong>Location:</strong> {businessInfo.location}</p>
                  </div>
                  <div className="col-md-6">
                    <p>
                      <strong>Certifications:</strong><br />
                      {businessInfo.certifications.map((c, i) => (
                        <span key={i} className="badge bg-info text-dark me-2 mb-2">
                          {c}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* PRODUCTS */}
            <div className="card shadow-sm border-0">
            <div className="card-header bg-white">
                <h5 className="fw-bold mb-0">Products</h5>
            </div>

            <div className="card-body">
                <div className="row g-4">
                {products.map((p) => (
                    <div className="col-md-6" key={p.id}>
                    <div className="card h-100 product-card border-0 shadow-sm">
                        
                        {/* IMAGE PLACEHOLDER */}
                        <div className="product-image">
                        <i className="bi bi-image"></i>
                        <span className="badge bg-primary position-absolute top-0 end-0 m-2">
                            {p.category}
                        </span>
                        </div>

                        <div className="card-body">
                        <h6 className="fw-bold">{p.name}</h6>
                        <p className="text-muted small mb-2">
                            {p.description}
                        </p>

                        <ul className="list-unstyled small mb-3">
                            <li><strong>MOQ:</strong> {p.moq} pcs</li>
                            <li><strong>Method:</strong> {p.method}</li>
                            <li><strong>Colors:</strong> {p.colors}</li>
                            <li><strong>Size:</strong> {p.size}</li>
                        </ul>

                        <div className="d-flex justify-content-between align-items-center">
                            <span className="fw-bold text-success">{p.price}</span>
                            <button className="btn btn-outline-primary btn-sm">
                            Send Inquiry
                            </button>
                        </div>
                        </div>

                    </div>
                    </div>
                ))}

                {products.length === 0 && (
                    <div className="col-12 text-center text-muted py-4">
                    No products available
                    </div>
                )}
                </div>
            </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR */}
          <div className="col-lg-4">
            {/* CONTACT */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body">
                <h6 className="fw-bold text-primary mb-3">
                  <i className="bi bi-telephone me-2"></i>Contact Supplier
                </h6>

                <p>
                  <i className="bi bi-envelope me-2"></i>
                  {businessInfo.email}
                </p>

                <p>
                  <i className="bi bi-phone me-2"></i>
                  {businessInfo.phone}
                </p>

                <a
                  href={`https://wa.me/${businessInfo.whatsapp}`}
                  className="btn btn-success w-100 mt-2"
                >
                  <i className="bi bi-whatsapp me-2"></i>
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* EXPORT MARKETS */}
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h6 className="fw-bold mb-3">
                  <i className="bi bi-globe me-2"></i>Export Markets
                </h6>

                {businessInfo.exportMarkets.map((country, i) => (
                  <span key={i} className="badge bg-light text-dark me-2 mb-2">
                    {country}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <UserFooter />
    </>
  );
}

export default PublicBusinessProfile;
