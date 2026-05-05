import React, { useEffect, useState } from "react";
import axios from "axios";
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";
import productImage from "../assets/image.png";

function BusinessProfile() {
  const [businessInfo, setBusinessInfo] = useState(null);

  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    size: "",
    colors: "",
    price: "",
    method: "",
    availableQuantity: "",
  });

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchBusiness();
  }, []);

  const fetchBusiness = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/business/my-business",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setBusinessInfo(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const openAddModal = () => {
    setForm({
      name: "",
      category: "",
      description: "",
      size: "",
      colors: "",
      price: "",
      method: "",
      availableQuantity: "",
    });
    setEditId(null);
  };

  const openEditModal = (product) => {
    setForm(product);
    setEditId(product.id);
  };

  const handleSave = () => {
    if (!form.name || !form.category) return;

    const newProduct = {
      ...form,
      image: productImage,
    };

    if (editId) {
      setProducts(
        products.map((p) =>
          p.id === editId ? { ...newProduct, id: editId } : p
        )
      );
    } else {
      setProducts([...products, { ...newProduct, id: Date.now() }]);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this product?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  if (!businessInfo) {
    return (
      <>
        <UserHeader />
        <div className="container text-center py-5">
          <h4>Loading Business Profile...</h4>
        </div>
        <UserFooter />
      </>
    );
  }

  return (
    <>
      <UserHeader />

      {/* HEADER */}
      <section className="profile-header">
        <div className="container d-flex align-items-center">
          <div className="logo-circle">
            {businessInfo.logo ? (
              <img
                src={`http://localhost:5000/${businessInfo.logo}`}
                alt="logo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            ) : (
              "LOGO"
            )}
          </div>

          <div className="ms-4">
            <h3 className="fw-bold mb-1">{businessInfo.companyName}</h3>
            <p className="text-muted mb-1">Business Owner Dashboard</p>

            <span className="badge bg-primary">
              {businessInfo.factoryAddress}
            </span>

            <div className="mt-2">
              <span
                className={`badge ${
                  businessInfo.status === "approved"
                    ? "bg-success"
                    : businessInfo.status === "rejected"
                    ? "bg-danger"
                    : "bg-warning text-dark"
                }`}
              >
                {businessInfo.status}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="container my-5">
        <div className="row">
          {/* PRODUCTS */}
          <div className="col-lg-8">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white d-flex justify-content-between">
                <h5 className="fw-bold mb-0">Products</h5>

                <button
                  className="btn btn-primary btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#productModal"
                  onClick={openAddModal}
                >
                  <i className="bi bi-plus-lg me-1"></i>Add Product
                </button>
              </div>

              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Size</th>
                      <th>Colors</th>
                      <th>Price</th>
                      <th>Method</th>
                      <th>Qty</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <img
                            src={p.image}
                            alt={p.name}
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                              borderRadius: "6px",
                            }}
                          />
                        </td>

                        <td className="fw-semibold">{p.name}</td>

                        <td>
                          <span className="badge bg-secondary">
                            {p.category}
                          </span>
                        </td>

                        <td>{p.size}</td>
                        <td>{p.colors}</td>
                        <td className="fw-bold text-success">{p.price}</td>

                        <td>
                          <span className="badge bg-info text-dark">
                            {p.method}
                          </span>
                        </td>

                        <td>{p.availableQuantity}</td>

                        <td className="text-end">
                          <button
                            className="btn btn-outline-secondary btn-sm me-2"
                            data-bs-toggle="modal"
                            data-bs-target="#productModal"
                            onClick={() => openEditModal(p)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>

                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDelete(p.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* BUSINESS INFO */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h6 className="fw-bold mb-3 text-primary">
                  Business Information
                </h6>

                <p><strong>Owner:</strong> {businessInfo.ownerName}</p>
                <p><strong>Email:</strong> {businessInfo.email}</p>
                <p><strong>Phone:</strong> {businessInfo.phone}</p>

                {/* SOCIAL ICONS */}
                <div className="d-flex gap-3 mt-3">
                  <a href={businessInfo.facebook} target="_blank">
                    <i className="bi bi-facebook fs-5 text-primary"></i>
                  </a>

                  <a href={businessInfo.instagram} target="_blank">
                    <i className="bi bi-instagram fs-5 text-danger"></i>
                  </a>

                  <a href={businessInfo.tiktok} target="_blank">
                    <i className="bi bi-tiktok fs-5 text-dark"></i>
                  </a>

                  <a href={`https://wa.me/${businessInfo.whatsapp}`}>
                    <i className="bi bi-whatsapp fs-5 text-success"></i>
                  </a>

                  <a href={businessInfo.website} target="_blank">
                    <i className="bi bi-globe fs-5 text-dark"></i>
                  </a>
                </div>

                <hr />

                <p><strong>Category:</strong> {businessInfo.category}</p>
                <p><strong>NTN:</strong> {businessInfo.ntnNumber}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <div className="modal fade" id="productModal">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">
                {editId ? "Edit Product" : "Add Product"}
              </h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              <div className="row g-3">

                <div className="col-md-6">
                  <input
                    className="form-control"
                    placeholder="Product Name"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                  />
                </div>

                <div className="col-md-6">
                  <input
                    className="form-control"
                    placeholder="Category"
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  />
                </div>

                <div className="col-md-6">
                  <input
                    className="form-control"
                    placeholder="Size"
                    value={form.size}
                    onChange={(e) =>
                      setForm({ ...form, size: e.target.value })
                    }
                  />
                </div>

                <div className="col-md-6">
                  <input
                    className="form-control"
                    placeholder="Colors"
                    value={form.colors}
                    onChange={(e) =>
                      setForm({ ...form, colors: e.target.value })
                    }
                  />
                </div>

                <div className="col-md-6">
                  <input
                    className="form-control"
                    placeholder="Price"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                  />
                </div>

                <div className="col-md-6">
                  <select
                    className="form-select"
                    value={form.method}
                    onChange={(e) =>
                      setForm({ ...form, method: e.target.value })
                    }
                  >
                    <option value="">Select Method</option>
                    <option>Hand Made</option>
                    <option>Machine Made</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Available Quantity"
                    value={form.availableQuantity}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        availableQuantity: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="col-12">
                  <textarea
                    className="form-control"
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                </div>

              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>

              <button
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={handleSave}
              >
                Save Product
              </button>
            </div>

          </div>
        </div>
      </div>

      <UserFooter />
    </>
  );
}

export default BusinessProfile;