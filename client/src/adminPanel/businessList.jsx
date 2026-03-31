import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import myImage from "../assets/image.png";

function BusinessList() {
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Dummy data
  useEffect(() => {
    const dummyBusinesses = [
      { id: 1, name: 'Sialkot Textile Mills', category: 'Manufacturing', status: 'Active', author: 'John Smith', logo: myImage, description: 'Leading textile manufacturer in Sialkot.', email: 'info@stm.com', phone: '+92-123-4567890', address: '123 Industrial Area, Sialkot' },
      { id: 2, name: 'Export Solutions Ltd', category: 'Trading', status: 'Active', author: 'Sarah Johnson', logo: myImage, description: 'Exporting quality goods worldwide.', email: 'contact@exportsolutions.com', phone: '+92-321-9876543', address: '45 Export Road, Sialkot' },
      { id: 3, name: 'Global Imports Inc', category: 'Import/Export', status: 'Inactive', author: 'Mike Davis', logo: myImage, description: 'Specialists in global imports and exports.', email: 'support@globalimports.com', phone: '+92-300-1122334', address: '78 Market Street, Sialkot' },
    ];
    setBusinesses(dummyBusinesses);
  }, []);

  // Disable background scroll when modal opens
  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
  }, [showModal]);

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") handleCloseModal();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleView = (id) => {
    const business = businesses.find(b => b.id === id);
    setSelectedBusiness(business);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this business?')) {
      setBusinesses(prev =>
        prev.filter(business => business.id !== id)
      );
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBusiness(null);
  };

  return ( 
    <div className="d-flex">
      <AdminSidebar />

      <div className="flex-grow-1 p-4">
        <h2 className="text-center mb-4">Business List</h2>

        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
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
                      src={business.logo || myImage}
                      alt="logo"
                      style={{
                        width: '40px',
                        height: '40px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                        border: '1px solid #dee2e6'
                      }}
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
                      className="btn btn-outline-primary btn-sm me-2"
                      onClick={() => handleView(business.id)}
                    >
                      <i className="bi bi-eye"></i> View
                    </button>

                    <button 
                      className="btn btn-outline-danger btn-sm"
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

        {/* Modal */}
        {showModal && selectedBusiness && (
          <>
            <div 
              className="modal fade show" 
              style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }} 
              tabIndex={-1}
            >
              <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content shadow">

                  <div className="modal-header bg-primary text-white">
                    <h5 className="modal-title">
                      <i className="bi bi-building me-2"></i>
                      {selectedBusiness.name}
                    </h5>

                    <button 
                      type="button" 
                      className="btn-close btn-close-white"
                      onClick={handleCloseModal}
                    ></button>
                  </div>

                  <div className="modal-body">
                    <div className="row">
                      
                      <div className="col-md-3 text-center mb-3">
                        <img 
                          src={selectedBusiness.logo || myImage}
                          alt="logo"
                          className="img-fluid rounded border"
                          style={{ maxHeight: '100px' }}
                        />
                      </div>

                      <div className="col-md-9">
                        <table className="table table-borderless">
                          <tbody>
                            <tr>
                              <th>Author:</th>
                              <td>{selectedBusiness.author}</td>
                            </tr>
                            <tr>
                              <th>Category:</th>
                              <td>{selectedBusiness.category}</td>
                            </tr>
                            <tr>
                              <th>Status:</th>
                              <td>
                                <span className={`badge ${selectedBusiness.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                                  {selectedBusiness.status}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <th>Email:</th>
                              <td>{selectedBusiness.email}</td>
                            </tr>
                            <tr>
                              <th>Phone:</th>
                              <td>{selectedBusiness.phone}</td>
                            </tr>
                            <tr>
                              <th>Address:</th>
                              <td>{selectedBusiness.address}</td>
                            </tr>
                            <tr>
                              <th>Description:</th>
                              <td>{selectedBusiness.description}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                    </div>
                  </div>

                  <div className="modal-footer">
                    <button 
                      className="btn btn-secondary"
                      onClick={handleCloseModal}
                    >
                      Close
                    </button>
                  </div>

                </div>
              </div>
            </div>

            {/* Backdrop */}
            <div className="modal-backdrop fade show"></div>
          </>
        )}
      </div>
    </div>
  );
}

export default BusinessList;