// server/middleware.js
import jwt from "jsonwebtoken";
import AdminUser from "../models/AdminUser.js";

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ 
      success: false,
      message: "No token provided" 
    });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");

    req.user = decoded; // { id: user._id, email, role }
    next();
  } catch (err) {
    return res.status(401).json({ 
      success: false,
      message: "Invalid or expired token" 
    });
  }
};

// Admin specific middleware
export const protectAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ 
      success: false,
      message: "No token provided" 
    });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    
    // Get full admin data from database
    const admin = await AdminUser.findById(decoded.id).select("-password");
    
    if (!admin) {
      return res.status(401).json({ 
        success: false,
        message: "Admin not found" 
      });
    }
    
    req.admin = admin;
    req.adminId = decoded.id;
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(401).json({ 
      success: false,
      message: "Invalid or expired token" 
    });
  }
};