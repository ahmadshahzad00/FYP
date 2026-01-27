import React, { useState } from "react";
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";

function BusinessProfile() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Professional Football",
      category: "Sports",
      description: "FIFA standard hand-Made football",
      size: "Size 5",
      colors: "White, Black",
      price: "$12",
      method: "Hand-Made",
    },
  ]);

  const businessInfo = {
    name: "ABC Sports Industries",
    owner: "Mr. Ahmad Shahzad",
    email: "contact@abcsports.com",
    phone: "+92 300 1234567",
    location: "Sialkot, Pakistan",
  };

  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    size: "",
    colors: "",
    price: "",
    method: "",
  });

  const [editId, setEditId] = useState(null);

  const openAddModal = () => {
    setForm({
      name: "",
      category: "",
      description: "",
      size: "",
      colors: "",
      price: "",
      method: "",
    });
    setEditId(null);
  };

  const openEditModal = (product) => {
    setForm(product);
    setEditId(product.id);
  };

  const handleSave = () => {
    if (!form.name || !form.category) return;

    if (editId) {
      setProducts(products.map((p) => (p.id === editId ? { ...form, id: editId } : p)));
    } else {
      setProducts([...products, { ...form, id: Date.now() }]);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this product?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  return (
    <>
      <UserHeader />

      {/* HEADER */}
      <section className="profile-header">
        <div className="container d-flex align-items-center">
          <div className="logo-circle">LOGO</div>
          <div className="ms-4">
            <h3 className="fw-bold mb-1">{businessInfo.name}</h3>
            <p className="text-muted mb-1">Business Owner Dashboard</p>
            <span className="badge bg-primary">
              <i className="bi bi-geo-alt-fill me-1"></i>
              {businessInfo.location}
            </span>
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
                      <th>Name</th>
                      <th>Category</th>
                      <th>Size</th>
                      <th>Colors</th>
                      <th>Price</th>
                      <th>Method</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td className="fw-semibold">{p.name}</td>
                        <td><span className="badge bg-secondary">{p.category}</span></td>
                        <td>{p.size}</td>
                        <td>{p.colors}</td>
                        <td className="fw-bold text-success">{p.price}</td>
                        <td>
                          <span className="badge bg-info text-dark">{p.method}</span>
                        </td>
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
                    {products.length === 0 && (
                      <tr>
                        <td colSpan="7" className="text-center text-muted py-4">
                          No products added
                        </td>
                      </tr>
                    )}
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
                  <i className="bi bi-building me-2"></i>Business Info
                </h6>

                <p><strong>Owner:</strong> {businessInfo.owner}</p>
                <p><strong>Email:</strong> {businessInfo.email}</p>
                <p><strong>Phone:</strong> {businessInfo.phone}</p>
                <p><strong>Location:</strong> {businessInfo.location}</p>
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
              <h5 className="modal-title">{editId ? "Edit Product" : "Add Product"}</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Product Name</label>
                  <input className="form-control" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    <option value="">Select</option>
                    <option>Sports</option>
                    <option>Leather</option>
                    <option>Fitness</option>
                  </select>
                </div>

                <div className="col-md-12">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows="2"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}></textarea>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Size</label>
                  <input className="form-control" value={form.size}
                    onChange={(e) => setForm({ ...form, size: e.target.value })} />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Colors</label>
                  <input className="form-control" value={form.colors}
                    onChange={(e) => setForm({ ...form, colors: e.target.value })} />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Price</label>
                  <input className="form-control" value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Manufacturing Method</label>
                  <select className="form-select" value={form.method}
                    onChange={(e) => setForm({ ...form, method: e.target.value })}>
                    <option value="">Select</option>
                    <option>Hand-Made</option>
                    <option>Machine-Made</option>
                  </select>
                </div>

basit
                <div className="col-md-6">
                  <label className="form-label">Product Images</label>
                  <div className="upload-box">
                    <i className="bi bi-image"></i>
                    <small>Upload coming soon</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button className="btn btn-primary" data-bs-dismiss="modal" onClick={handleSave}>
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
