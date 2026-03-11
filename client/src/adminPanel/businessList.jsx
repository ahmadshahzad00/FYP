import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import myImage from "../assets/image.png";

function BusinessList() {
  const [businesses, setBusinesses] = useState([]);

  // Using dummy data for frontend demonstration
  useEffect(() => {
    const dummyBusinesses = [
      { id: 1, name: 'Sialkot Textile Mills', category: 'Manufacturing', status: 'Active', author: 'John Smith', logo: myImage },
      { id: 2, name: 'Export Solutions Ltd', category: 'Trading', status: 'Active', author: 'Sarah Johnson', logo: myImage },
      { id: 3, name: 'Global Imports Inc', category: 'Import/Export', status: 'Inactive', author: 'Mike Davis', logo: myImage },
    ];
    setBusinesses(dummyBusinesses);
  }, []);

  const handleView = (id) => {
    // Frontend demo: Show alert with business ID
    alert(`Viewing business with ID: ${id}`);
  };

  const handleDelete = (id) => {
    // Frontend demo: Confirm and remove from local state
    if (window.confirm('Are you sure you want to delete this business?')) {
      setBusinesses(businesses.filter(business => business.id !== id));
    }
  };

  return ( 
    <div className="d-flex">
      <AdminSidebar />
      <div className="flex-grow-1 p-4">
        <h2 className="text-center mb-4">Business List</h2>
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Logo</th>
                <th>Business Name</th>
                <th>Author</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {businesses.map(business => (
                <tr key={business.id}>
                  <td>{business.id}</td>
                  <td>
                    <img 
                      src={business.logo} 
                      alt={`${business.name} logo`} 
                      style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                  </td>
                  <td>{business.name}</td>
                  <td>{business.author}</td>
                  <td>{business.category}</td>
                  <td>
                    <span className={`badge ${business.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                      {business.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-info btn-sm me-2"
                      onClick={() => handleView(business.id)}
                    >
                      <i className="bi bi-eye"></i> View
                    </button>
                    <button 
                      className="btn btn-danger btn-sm" 
                      onClick={() => handleDelete(business.id)}
                    >
                      <i className="bi bi-trash"></i> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {businesses.length === 0 && (
          <div className="text-center mt-4">
            <p className="text-muted">No businesses found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
export default BusinessList;