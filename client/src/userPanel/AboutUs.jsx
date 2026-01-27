import React from "react";
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";
import aboutImage from "../assets/about-us.png";
import userImage from "../assets/image.png";

function AboutUs() {
  return (
    <>
      <UserHeader />
      {/* Hero Section */}
      <div
        className="text-light py-5"
        style={{
          background: "linear-gradient(90deg, #0d6efd, #084298)",
        }}
      >
        <div className="container text-center">
          <h1 className="fw-bold">About Us</h1>
          <p className="lead opacity-75">
            Learn more about Sialkot Export Mella, our mission, and our values
          </p>
        </div>
      </div>

      {/* About Section */}
      <div className="container my-5">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <img
              src={aboutImage}
              alt="About Us"
              className="img-fluid rounded shadow"
              style={{ width: "900px", height: "361px", objectFit: "cover" }}
            />
          </div>
          <div className="col-lg-6">
            <h3 className="fw-bold mb-3">Our Story</h3>
            <p>
              Sialkot Export Mella was founded with the vision of connecting 
              premium exporters with businesses and customers worldwide. 
              With years of experience in the export industry, we pride ourselves 
              on delivering quality products and fostering long-term partnerships.
            </p>
            <p>
              Our mission is to provide a seamless platform for buyers to discover 
              trusted exporters, ensuring transparency, efficiency, and reliability. 
              We believe in the power of collaboration and work closely with our 
              partners to maintain the highest standards in every transaction.
            </p>
            <p>
              At Sialkot Export Mella, customer satisfaction is at the heart of 
              everything we do. Our team is committed to continuous improvement, 
              innovation, and delivering value to our clients across the globe.
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="container my-5">
        <div className="row text-center">
          <div className="col-md-6 mb-4">
            <div className="p-4 shadow rounded h-100">
              <h4 className="fw-bold mb-3">Our Mission</h4>
              <p>
                To empower businesses by providing access to high-quality products 
                from trusted exporters and fostering global trade relationships.
              </p>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="p-4 shadow rounded h-100">
              <h4 className="fw-bold mb-3">Our Vision</h4>
              <p>
                To become the leading platform connecting exporters and buyers, 
                known for trust, quality, and exceptional service worldwide.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="container my-5">
        <h3 className="text-center fw-bold mb-4">Meet Our Team</h3>
        <div className="row justify-content-center">
          <div className="col-md-4 mb-4">
            <div className="card shadow border-0 text-center">
              <img
                src={userImage} 
                alt="Team Member"
                className="card-img-top rounded-circle mx-auto mt-3"
                style={{ width: "120px", height: "120px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title fw-bold">John Doe</h5>
                <p className="card-text text-muted">Founder & CEO</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card shadow border-0 text-center">
              <img
                src={userImage} 
                alt="Team Member"
                className="card-img-top rounded-circle mx-auto mt-3"
                style={{ width: "120px", height: "120px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title fw-bold">Jane Smith</h5>
                <p className="card-text text-muted">Operations Manager</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <UserFooter />
    </>
  );
}

export default AboutUs;
