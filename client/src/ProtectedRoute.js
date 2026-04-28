import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // or user data

  if (!token) {
    // Redirect to login with message
    return <Navigate to="/user-login" state={{ message: "Please login first to register your business" }} />;
  }

  return children;
};

export default ProtectedRoute;