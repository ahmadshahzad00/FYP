import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import "bootstrap/dist/css/bootstrap.min.css";

function ContactUsList() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/contact/admin");
      if (response.data.success) {
        setMessages(response.data.data);
        setError("");
      }
    } catch (err) {
      setError("Failed to load messages");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/contact/admin/${id}`);
      setMessages(messages.filter(msg => msg._id !== id));
    } catch (err) {
      alert("Failed to delete message");
      console.error(err);
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === "read" ? "unread" : "read";
    
    try {
      const response = await axios.put(`http://localhost:5000/api/contact/admin/${id}`, {
        status: newStatus
      });
      
      if (response.data.success) {
        setMessages(messages.map(msg => 
          msg._id === id ? { ...msg, status: newStatus } : msg
        ));
      }
    } catch (err) {
      alert("Failed to update status");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="d-flex min-vh-100 bg-light">
        <AdminSidebar />
        <div className="flex-grow-1 d-flex justify-content-center align-items-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex min-vh-100 bg-light">
      <AdminSidebar />

      <div className="flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2> Contact Messages</h2>
          <button className="btn btn-primary" onClick={fetchMessages}>
            🔄 Refresh
          </button>
        </div>

        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        <div className="table-responsive shadow-sm bg-white rounded">
          <table className="table table-striped table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <tr key={msg._id}>
                    <td>{index + 1}</td>
                    <td>{msg.name}</td>
                    <td>{msg.email}</td>
                    <td>{msg.subject}</td>
                    <td>
                      <span title={msg.message}>
                        {msg.message.length > 30 
                          ? msg.message.substring(0, 30) + "..." 
                          : msg.message}
                      </span>
                    </td>
                    <td>{new Date(msg.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${
                        msg.status === "read" ? "bg-success" : "bg-warning text-dark"
                      }`}>
                        {msg.status}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button
                          className={`btn ${
                            msg.status === "read" ? "btn-warning" : "btn-success"
                          }`}
                          onClick={() => handleStatusChange(msg._id, msg.status)}
                          title={msg.status === "read" ? "Mark as unread" : "Mark as read"}
                        >
                          {msg.status === "read" ? "Readed" : "Unread"}
                        </button>

                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(msg._id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">
                    No messages found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-3 text-muted">
          Total Messages: <strong>{messages.length}</strong>
        </div>
      </div>
    </div>
  );
}

export default ContactUsList;