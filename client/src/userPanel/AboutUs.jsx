import React, { useState, useEffect } from "react";
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";
import aboutImage from "../assets/about-us.png";
import axios from "axios";

function AboutUs() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/team");
      if (response.data.success) {
        // Filter only active members
        const activeMembers = response.data.data.filter(member => member.isActive !== false);
        setTeamMembers(activeMembers);
      }
    } catch (error) {
      console.error("Error fetching team members:", error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    return `http://localhost:5000/${imagePath}`;
  };

  return (
    <>
      <UserHeader />

      {/* Hero Section */}
      <div
        className="text-light py-5"
        style={{
          background: "linear-gradient(135deg, #0d6efd 0%, #084298 50%, #062a6b 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated Background Elements */}
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ pointerEvents: "none" }}>
          <div className="position-absolute rounded-circle" style={{
            width: "300px",
            height: "300px",
            background: "rgba(255,255,255,0.05)",
            top: "-100px",
            right: "-50px",
            animation: "float 8s ease-in-out infinite"
          }}></div>
          <div className="position-absolute rounded-circle" style={{
            width: "200px",
            height: "200px",
            background: "rgba(255,255,255,0.03)",
            bottom: "-50px",
            left: "-50px",
            animation: "float 10s ease-in-out infinite reverse"
          }}></div>
        </div>

        <div className="container text-center position-relative" style={{ zIndex: 1 }}>
          <h1 className="fw-bold display-4 mb-3">About Us</h1>
          <p className="lead opacity-75 fs-5" style={{ maxWidth: "600px", margin: "0 auto" }}>
            Learn more about Sialkot Export Mella, our mission, and our values
          </p>
          <div className="d-flex justify-content-center mt-3">
            <span className="bg-white" style={{ width: "60px", height: "3px", borderRadius: "2px" }}></span>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="container my-5">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <div className="position-relative">
              <img
                src={aboutImage}
                alt="About Us"
                className="img-fluid rounded-4 shadow-lg"
                style={{ 
                  width: "100%", 
                  height: "400px", 
                  objectFit: "cover",
                  border: "4px solid white",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.1)"
                }}
              />
              <div className="position-absolute bottom-0 start-0 m-4 bg-primary text-white px-4 py-2 rounded-pill">
                <i className="bi bi-award-fill me-2"></i>
                Established 2026
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="mb-4">
              <span className="badge bg-primary bg-opacity-10 text-primary px-4 py-2 rounded-pill fw-semibold">
                <i className="bi bi-info-circle me-2"></i>
                About Us
              </span>
            </div>
            <h3 className="fw-bold mb-3 display-6">Our Story</h3>
            <p className="text-muted fs-5">
              Sialkot Export Mella was founded with the vision of connecting 
              premium exporters with businesses and customers worldwide. 
              With years of experience in the export industry, we pride ourselves 
              on delivering quality products and fostering long-term partnerships.
            </p>
            <p className="text-muted">
              Our mission is to provide a seamless platform for buyers to discover 
              trusted exporters, ensuring transparency, efficiency, and reliability. 
              We believe in the power of collaboration and work closely with our 
              partners to maintain the highest standards in every transaction.
            </p>
            <div className="d-flex gap-3 mt-4">
              <div className="d-flex align-items-center gap-2">
                <div className="bg-success bg-opacity-10 rounded-circle p-2">
                  <i className="bi bi-check-circle text-success fs-5"></i>
                </div>
                <span className="fw-semibold">100+ Exporters</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div className="bg-primary bg-opacity-10 rounded-circle p-2">
                  <i className="bi bi-box-seam text-primary fs-5"></i>
                </div>
                <span className="fw-semibold">1000+ Products</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="container my-5">
        <div className="row g-4">
          <div className="col-md-6">
            <div className="p-4 p-lg-5 shadow-lg rounded-4 h-100 bg-white" style={{ borderTop: "4px solid #0d6efd" }}>
              <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-4">
                <i className="bi bi-bullseye fs-1 text-primary"></i>
              </div>
              <h4 className="fw-bold mb-3">Our Mission</h4>
              <p className="text-muted fs-5">
                To empower businesses by providing access to high-quality products 
                from trusted exporters and fostering global trade relationships.
              </p>
              <ul className="list-unstyled mt-3">
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Connect global buyers with trusted exporters
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Ensure quality and transparency in every transaction
                </li>
                <li>
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Foster long-term business partnerships
                </li>
              </ul>
            </div>
          </div>
          <div className="col-md-6">
            <div className="p-4 p-lg-5 shadow-lg rounded-4 h-100 bg-white" style={{ borderTop: "4px solid #0d6efd" }}>
              <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex p-3 mb-4">
                <i className="bi bi-eye fs-1 text-success"></i>
              </div>
              <h4 className="fw-bold mb-3">Our Vision</h4>
              <p className="text-muted fs-5">
                To become the leading platform connecting exporters and buyers, 
                known for trust, quality, and exceptional service worldwide.
              </p>
              <ul className="list-unstyled mt-3">
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Global recognition as the #1 export platform
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Trusted by thousands of businesses worldwide
                </li>
                <li>
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Continuous innovation in trade solutions
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="container my-5">
        <div className="text-center mb-5">
          <span className="badge bg-primary bg-opacity-10 text-primary px-4 py-2 rounded-pill fw-semibold">
            <i className="bi bi-heart me-2"></i>
            Our Values
          </span>
          <h2 className="fw-bold display-5 mt-3">What We Stand For</h2>
          <p className="text-muted fs-5">Core values that drive our business</p>
        </div>
        <div className="row g-4">
          <div className="col-md-3 col-6">
            <div className="text-center p-3">
              <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                <i className="bi bi-shield-check fs-2 text-primary"></i>
              </div>
              <h6 className="fw-bold">Trust</h6>
              <small className="text-muted">Building lasting relationships</small>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="text-center p-3">
              <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                <i className="bi bi-star fs-2 text-success"></i>
              </div>
              <h6 className="fw-bold">Quality</h6>
              <small className="text-muted">Excellence in everything</small>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="text-center p-3">
              <div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                <i className="bi bi-lightbulb fs-2 text-warning"></i>
              </div>
              <h6 className="fw-bold">Innovation</h6>
              <small className="text-muted">Embracing new ideas</small>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="text-center p-3">
              <div className="bg-info bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                <i className="bi bi-people fs-2 text-info"></i>
              </div>
              <h6 className="fw-bold">Collaboration</h6>
              <small className="text-muted">Together we grow</small>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="container my-5">
        <div className="text-center mb-5">
          <span className="badge bg-primary bg-opacity-10 text-primary px-4 py-2 rounded-pill fw-semibold">
            <i className="bi bi-people me-2"></i>
            Our Team
          </span>
          <h2 className="fw-bold display-5 mt-3">Meet Our Team</h2>
          <p className="text-muted fs-5">The passionate people behind Sialkot Export Mella</p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-people fs-1 text-muted"></i>
            <p className="text-muted mt-2">No team members added yet.</p>
          </div>
        ) : (
          <div className="row g-4 justify-content-center">
            {teamMembers.map((member) => (
              <div className="col-lg-3 col-md-4 col-sm-6" key={member._id}>
                <div className="card shadow-lg border-0 text-center h-100 rounded-4 team-card">
                  <div className="position-relative">
                    {getImageUrl(member.image) ? (
                      <img
                        src={getImageUrl(member.image)}
                        alt={member.name}
                        className="card-img-top rounded-circle mx-auto mt-4"
                        style={{
                          width: "130px",
                          height: "130px",
                          objectFit: "cover",
                          border: "4px solid #f1f1f1",
                        }}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/130";
                        }}
                      />
                    ) : (
                      <div
                        className="rounded-circle mx-auto mt-4 d-flex align-items-center justify-content-center"
                        style={{
                          width: "130px",
                          height: "130px",
                          background: "#e9ecef",
                          border: "4px solid #f1f1f1",
                          fontSize: "40px",
                          color: "#adb5bd",
                          margin: "0 auto"
                        }}
                      >
                        <i className="bi bi-person"></i>
                      </div>
                    )}
                    {member.isActive && (
                      <span className="position-absolute bottom-0 start-50 translate-middle badge bg-success rounded-pill px-3">
                        <i className="bi bi-check-circle me-1"></i>
                        Active
                      </span>
                    )}
                  </div>
                  <div className="card-body">
                    <h5 className="card-title fw-bold">{member.name}</h5>
                    <p className="card-text text-primary fw-medium">
                      <i className="bi bi-briefcase me-1"></i>
                      {member.designation}
                    </p>
                    <p className="card-text text-muted small">
                      {member.description}
                    </p>
                  </div>
                  {/* <div className="card-footer bg-transparent border-0 pb-3">
                    <button className="btn btn-outline-primary btn-sm rounded-pill px-3">
                      <i className="bi bi-envelope me-1"></i>
                      Contact
                    </button>
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      {/* <div className="container my-5">
        <div className="bg-primary rounded-4 p-5 text-center text-white" style={{
          background: "linear-gradient(135deg, #0d6efd, #084298)",
        }}>
          <h3 className="fw-bold mb-3">Ready to Grow Your Business?</h3>
          <p className="opacity-75 mb-4 fs-5">
            Join Sialkot Export Mella today and connect with global buyers
          </p>
          <button 
            className="btn btn-light btn-lg px-5 fw-bold shadow"
            onClick={() => window.location.href = "/register-business"}
          >
            <i className="bi bi-rocket-takeoff me-2"></i>
            Get Started Now
          </button>
        </div>
      </div> */}

      {/* CSS Animations */}
      <style jsx="true">{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .team-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .team-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.15) !important;
        }

        .team-card .card-img-top {
          transition: transform 0.3s ease;
        }

        .team-card:hover .card-img-top {
          transform: scale(1.05);
        }
      `}</style>

      <UserFooter />
    </>
  );
}

export default AboutUs;