import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AdminUser from "../models/AdminUser.js";
import { protectAdmin } from "../middleware/middleware.js";

const router = express.Router();

// Admin Registration
router.post("/admin-register", async (req, res) => {
  try {
    const { firstname, lastname, phone, email, password, role } = req.body;

    console.log("Registration attempt:", { firstname, lastname, phone, email });

    if (!firstname || !lastname || !phone || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const existingUser = await AdminUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new AdminUser({
      firstname,
      lastname,
      phone,
      email,
      password: hashedPassword,
      role: role || "business_handler",
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Admin Sign In
router.post("/admin-signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt for email:", email);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const admin = await AdminUser.findOne({ email });
    console.log("User found:", admin ? "Yes" : "No");
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    console.log("Password valid:", isPasswordValid);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Update last login if field exists
    if (admin.lastLogin !== undefined) {
      admin.lastLogin = new Date();
      await admin.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: admin._id, 
        email: admin.email, 
        role: admin.role 
      },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    // Prepare admin data
    const adminData = {
      id: admin._id,
      firstname: admin.firstname,
      lastname: admin.lastname,
      email: admin.email,
      phone: admin.phone,
      role: admin.role,
      createdAt: admin.createdAt,
    };

    console.log("Login successful for:", email);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin: adminData,
    });
  } catch (err) {
    console.error("Admin signin error:", err);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
});

// Verify token endpoint (using protectAdmin middleware)
router.get("/verify-token", protectAdmin, async (req, res) => {
  try {
    res.status(200).json({
      valid: true,
      admin: req.admin,
    });
  } catch (error) {
    res.status(401).json({
      valid: false,
      message: error.message,
    });
  }
});

// Get admin profile (using protectAdmin middleware)
router.get("/admin-profile", protectAdmin, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      admin: req.admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;