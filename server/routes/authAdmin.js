import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AdminUser from "../models/AdminUser.js";

const router = express.Router();

// Admin Signin
router.post("/admin-signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Please provide email and password" 
      });
    }
    
    // Find admin user
    const admin = await AdminUser.findOne({ email });
    if (!admin) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }
    
    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({ 
        success: false,
        message: "Account is deactivated. Please contact super admin." 
      });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }
    
    // Update last login
    admin.lastLogin = new Date();
    await admin.save();
    
    // Create token with admin ID
    const token = jwt.sign(
      { 
        id: admin._id, 
        email: admin.email,
        role: admin.role
      }, 
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );
    
    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        firstname: admin.firstname,
        lastname: admin.lastname,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
});

// Admin Registration
router.post("/admin-register", async (req, res) => {
  try {
    const { firstname, lastname, phone, email, password, role } = req.body;
    
    // Check if admin already exists
    const existingAdmin = await AdminUser.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists with this email"
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create admin
    const admin = new AdminUser({
      firstname,
      lastname,
      phone,
      email,
      password: hashedPassword,
      role: role || "business_handler",
      isActive: true
    });
    
    await admin.save();
    
    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      admin: {
        id: admin._id,
        firstname: admin.firstname,
        lastname: admin.lastname,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// Verify Token
router.get("/verify-token", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        success: false,
        message: "No token provided" 
      });
    }
    
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    
    const admin = await AdminUser.findById(decoded.id).select("-password");
    
    if (!admin) {
      return res.status(401).json({ 
        success: false,
        message: "Admin not found" 
      });
    }
    
    res.json({
      success: true,
      admin: {
        id: admin._id,
        firstname: admin.firstname,
        lastname: admin.lastname,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ 
      success: false,
      message: "Invalid token" 
    });
  }
});

export default router;