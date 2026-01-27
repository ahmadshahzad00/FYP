import React from "react";
import {Link} from "react-router-dom"
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";

function Categories() {
  const categories = [
    { title: "Sports Goods", desc: "World-class footballs, gloves, and sports equipment from Sialkot.", icon: "⚽" },
    { title: "Leather Jackets", desc: "Premium quality leather jackets crafted for global brands.", icon: "🧥" },
    { title: "Surgical Instruments", desc: "Precision surgical tools exported worldwide.", icon: "🩺" },
    { title: "Textile & Apparel", desc: "High-quality garments and textile products.", icon: "👕" },
    { title: "Sports Gloves", desc: "Professional gloves for sports and safety use.", icon: "🥊" },
    { title: "Bags & Accessories", desc: "Leather and textile bags for international markets.", icon: "🎒" },
    { title: "Safety Equipment", desc: "Industrial safety wear and protective gear.", icon: "🦺" },
    { title: "Custom Manufacturing", desc: "OEM & private-label manufacturing solutions.", icon: "🏭" },
  ];

  return (
    <>
      <UserHeader />

      <section className="py-5 bg-light">
        <div className="container-fluid px-4">
          <div className="row">

            {/* Sidebar */}
            <div className="col-lg-3 col-md-4 mb-4">
              <div className="card shadow-sm border-0 sticky-top" style={{ top: "90px" }}>
                <div className="card-body p-3">
                  <h6 className="fw-bold mb-3 text-primary">Browse Categories</h6>

                  <ul className="nav flex-column gap-2 sidebar-menu">
                    <li className="nav-item">
                      <a className="nav-link fw-semibold text-dark active" href="#">
                        ⭐ For You
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link text-dark" href="#">
                        🔥 Featured
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link text-dark" href="#">
                        💰 Deals
                      </a>
                    </li>
                    <hr />
                    <li className="nav-item">
                      <a className="nav-link text-dark" href="#">
                        ⚽ Sports Goods
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link text-dark" href="#">
                        🧥 Leather Products
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link text-dark" href="#">
                        🧸 Kids Toys
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link text-dark" href="#">
                        🩺 Surgical Instruments
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link text-dark" href="#">
                        👕 Textile & Apparel
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-lg-9 col-md-8">

              {/* Heading */}
              <div className="mb-4">
                <h2 className="fw-bold">Products Manufactured in Sialkot</h2>
                <p className="text-muted">
                  Discover globally recognized products crafted by skilled manufacturers
                </p>
              </div>

              {/* Cards */}
              <div className="row">
                {categories.map((item, index) => (
                  <div key={index} className="col-xl-4 col-lg-6 col-md-6 mb-4">
                    <div className="card h-100 border-0 shadow-sm text-center">
                      <div className="card-body p-4">
                        <div className="display-5 mb-3">{item.icon}</div>
                        <h6 className="fw-bold mb-2">{item.title}</h6>
                        <p className="text-muted mb-3">{item.desc}</p>
                        <button className="btn btn-outline-primary btn-sm px-4">
                          View Products
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="row mt-4 align-items-center bg-primary text-light rounded shadow p-4">
                <div className="col-md-8">
                  <h4 className="fw-bold mb-1">
                    Are You a Manufacturer or Exporter?
                  </h4>
                  <p className="mb-0 opacity-75">
                    Register your business and showcase your products to global buyers..
                  </p>
                </div>
                <div className="col-md-4 text-md-end mt-3 mt-md-0">
                  <Link
                    to="/business-register"
                    className="btn btn-light btn-lg px-4 fw-semibold"
                  >
                    Register Your Business
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <UserFooter />
    </>
  );
}

export default Categories;
