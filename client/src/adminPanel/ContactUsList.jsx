import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import "bootstrap/dist/css/bootstrap.min.css";

function ContactUsList() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const dummyMessages = [
      {
        id: 1,
        name: "Ali Khan",
        email: "ali@gmail.com",
        subject: "Product Inquiry",
        message: "I want details about your sports goods export.",
        createdAt: "2026-03-10",
        status: "unread",
      },
      {
        id: 2,
        name: "Usman",
        email: "usman@gmail.com",
        subject: "Business Registration",
        message: "How can I register my leather business?",
        createdAt: "2026-03-12",
        status: "read",
      },
    ];

    setMessages(dummyMessages);
  }, []);

  const handleView = (id) => {
    const msg = messages.find((m) => m.id === id);
    if (msg) {
      setSelectedMessage(msg);
      setShowModal(true);

      // Auto mark as read when opened
      handleToggleStatus(id, "read");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMessage(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      setMessages(messages.filter((msg) => msg.id !== id));
      if (selectedMessage?.id === id) {
        handleCloseModal();
      }
    }
  };

  const handleToggleStatus = (id, forceStatus = null) => {
    const updated = messages.map((msg) => {
      if (msg.id === id) {
        const newStatus = forceStatus
          ? forceStatus
          : msg.status === "read"
          ? "unread"
          : "read";
        return { ...msg, status: newStatus };
      }
      return msg;
    });

    setMessages(updated);

    if (selectedMessage?.id === id) {
      const updatedMsg = updated.find((m) => m.id === id);
      setSelectedMessage(updatedMsg);
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      <AdminSidebar />

      <div className="flex-grow-1 p-4">
        <h2 className="text-center mb-4">Contact Messages</h2>

        <div className="table-responsive shadow-sm bg-white rounded">
          <table className="table table-striped table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {messages.map((msg) => (
                <tr key={msg.id}>
                  <td>{msg.id}</td>
                  <td>{msg.name}</td>
                  <td>{msg.email}</td>
                  <td>{msg.subject}</td>
                  <td>{msg.createdAt}</td>

                  <td>
                    <span
                      className={`badge ${
                        msg.status === "read"
                          ? "bg-success"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {msg.status}
                    </span>
                  </td>

                  <td>
                    <div className="btn-group btn-group-sm">
                      <button
                        className="btn btn-info"
                        onClick={() => handleView(msg.id)}
                      >
                        <i className="bi bi-eye"></i>
                      </button>

                      <button
                        className={`btn ${
                          msg.status === "read"
                            ? "btn-warning"
                            : "btn-success"
                        }`}
                        onClick={() => handleToggleStatus(msg.id)}
                      >
                        {msg.status === "read" ? "Unread" : "Read"}
                      </button>

                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(msg.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {messages.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No messages found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW MODAL */}
      {showModal && selectedMessage && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Message Details</h5>
                <button className="btn-close" onClick={handleCloseModal}></button>
              </div>

              <div className="modal-body">
                <dl className="row">
                  <dt className="col-4">Name</dt>
                  <dd className="col-8">{selectedMessage.name}</dd>

                  <dt className="col-4">Email</dt>
                  <dd className="col-8">{selectedMessage.email}</dd>

                  <dt className="col-4">Subject</dt>
                  <dd className="col-8">{selectedMessage.subject}</dd>

                  <dt className="col-4">Date</dt>
                  <dd className="col-8">{selectedMessage.createdAt}</dd>

                  <dt className="col-4">Status</dt>
                  <dd className="col-8">
                    <span
                      className={`badge ${
                        selectedMessage.status === "read"
                          ? "bg-success"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {selectedMessage.status}
                    </span>
                  </dd>

                  <dt className="col-4">Message</dt>
                  <dd className="col-8">{selectedMessage.message}</dd>
                </dl>
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
      )}
    </div>
  );
}

export default ContactUsList;