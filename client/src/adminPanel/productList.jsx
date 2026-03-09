import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import myImage from "../assets/image.png";

function ProductList() {
  const [products, setProducts] = useState([]);

  // Using dummy data for frontend demonstration
  useEffect(() => {
    const dummyProducts = [
      { id: 1, name: 'Premium Cotton Fabric', category: 'Textiles', price: '$25.99', status: 'Active', image: myImage, business: 'Sialkot Textile Mills' },
      { id: 2, name: 'Leather Handbags', category: 'Fashion', price: '$89.99', status: 'Active', image: myImage, business: 'Export Solutions Ltd' },
      { id: 3, name: 'Surgical Instruments', category: 'Medical', price: '$150.00', status: 'Inactive', image: myImage, business: 'Global Imports Inc' },
      { id: 4, name: 'Sports Equipment', category: 'Sports', price: '$45.50', status: 'Active', image: myImage, business: 'Sialkot Textile Mills' },
    ];
    setProducts(dummyProducts);
  }, []);

  const handleView = (id) => {
    // Frontend demo: Show alert with product ID
    alert(`Viewing product with ID: ${id}`);
  };

  const handleDelete = (id) => {
    // Frontend demo: Confirm and remove from local state
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  return (
    <div className="d-flex">
      <AdminSidebar />
      <div className="flex-grow-1 p-4">
        <h2 className="text-center mb-4">Product List</h2>
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Product Name</th>
                <th>Business</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
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
                      style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.business}</td>
                  <td>{product.category}</td>
                  <td className="fw-bold text-success">{product.price}</td>
                  <td>
                    <span className={`badge ${product.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                      {product.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-info btn-sm me-2"
                      onClick={() => handleView(product.id)}
                    >
                      <i className="bi bi-eye"></i> View
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      <i className="bi bi-trash"></i> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {products.length === 0 && (
          <div className="text-center mt-4">
            <p className="text-muted">No products found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductList;
