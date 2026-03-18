import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import myImage from "../assets/product.jfif";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const dummyProducts = [
      {
        id: 1,
        name: 'Premium Cotton Fabric',
        category: 'Textiles',
        price: '$25.99',
        status: 'Active',
        image: myImage,
        business: 'Sialkot Textile Mills',
        supplier: 'Allied Textiles Pvt Ltd',
        stock: 320,
        sku: 'TX-1001',
        createdAt: '2026-03-02',
        description: 'High-quality 100% cotton fabric, suitable for apparel and home decor.'
      },
      {
        id: 2,
        name: 'Leather Handbags',
        category: 'Fashion',
        price: '$89.99',
        status: 'Active',
        image: myImage,
        business: 'Export Solutions Ltd',
        supplier: 'Global Leather Works',
        stock: 184,
        sku: 'FG-2245',
        createdAt: '2026-02-18',
        description: 'Handcrafted leather handbags, made with premium grade leather and brass fittings.'
      },
      {
        id: 3,
        name: 'Surgical Instruments',
        category: 'Medical',
        price: '$150.00',
        status: 'Inactive',
        image: myImage,
        business: 'Global Imports Inc',
        supplier: 'MediTech Parts',
        stock: 0,
        sku: 'MD-5560',
        createdAt: '2026-01-30',
        description: 'Precision stainless steel surgical instruments for hospital and clinic use.'
      },
      {
        id: 4,
        name: 'Sports Equipment',
        category: 'Sports',
        price: '$45.50',
        status: 'Active',
        image: myImage,
        business: 'Sialkot Textile Mills',
        supplier: 'Sporting Goods Co.',
        stock: 520,
        sku: 'SP-0789',
        createdAt: '2026-03-10',
        description: 'Durable sports equipment with high impact resistance and excellent grip.'
      },
    ];
    setProducts(dummyProducts);
  }, []);

  const handleView = (id) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      setSelectedProduct(product);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(product => product.id !== id));
      if (selectedProduct?.id === id) {
        handleCloseModal();
      }
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      <AdminSidebar />
      <div className="flex-grow-1 p-4">
        <h2 className="text-center mb-4">Product List</h2>

        <div className="table-responsive shadow-sm bg-white rounded">
          <table className="table table-striped table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>
                    <img
                      src={product.image}
                      alt={`${product.name} image`}
                      className="rounded"
                      style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                    />
                  </td>
                  <td>
                    <div className="fw-bold">{product.name}</div>
                    <small className="text-muted">{product.business}</small>
                  </td>
                  <td>{product.category}</td>
                  <td className="fw-bold text-success">{product.price}</td>
                  <td>
                    <span className={`badge ${product.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                      {product.status}
                    </span>
                  </td>
                  <td>{product.stock}</td>
                  <td>
                    <div className="btn-group btn-group-sm" role="group">
                      <button className="btn btn-info" onClick={() => handleView(product.id)}>
                        <i className="bi bi-eye"></i> View
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDelete(product.id)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedProduct && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Product Details</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-4 text-center">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="img-fluid rounded mb-3"
                      style={{ maxHeight: '220px', objectFit: 'cover' }}
                    />
                    <span className={`badge ${selectedProduct.status === 'Active' ? 'bg-success' : 'bg-secondary'} fs-6`}>
                      {selectedProduct.status}
                    </span>
                  </div>
                  <div className="col-md-8">
                    <h4 className="mb-2">{selectedProduct.name}</h4>
                    <p className="text-muted mb-3">{selectedProduct.description}</p>
                    <dl className="row">
                      <dt className="col-4">SKU</dt><dd className="col-8">{selectedProduct.sku}</dd>
                      <dt className="col-4">Supplier</dt><dd className="col-8">{selectedProduct.supplier}</dd>
                      <dt className="col-4">Business</dt><dd className="col-8">{selectedProduct.business}</dd>
                      <dt className="col-4">Category</dt><dd className="col-8">{selectedProduct.category}</dd>
                      <dt className="col-4">Price</dt><dd className="col-8">{selectedProduct.price}</dd>
                      <dt className="col-4">Stock</dt><dd className="col-8">{selectedProduct.stock}</dd>
                      <dt className="col-4">Added</dt><dd className="col-8">{selectedProduct.createdAt}</dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductList;