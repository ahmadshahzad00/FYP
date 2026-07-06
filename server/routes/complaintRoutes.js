import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Complaint from "../models/Complaint.js";
import Product from "../models/Product.js";
import Business from "../models/Business.js";
import { protect, protectAdmin } from "../middleware/middleware.js";

const router = express.Router();

// Ensure upload directory exists
const uploadDir = "uploads/complaints";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("✅ Created uploads/complaints directory");
}

/* ================= MULTER CONFIG ================= */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// ✅ FIXED: Better file filter with more allowed types
const fileFilter = (req, file, cb) => {
  // Allow images, PDFs, and documents
  const allowedTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed: ${file.mimetype}. Please upload images, PDF, or Word documents.`));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: fileFilter,
});

/* ================= TEST ROUTE ================= */
router.get("/test", (req, res) => {
  res.json({ success: true, message: "Complaint route is working!" });
});

/* ================= USER: SUBMIT COMPLAINT ================= */
router.post("/", protect, upload.array("attachments", 5), async (req, res) => {
  try {
    console.log("📝 Received complaint submission");
    console.log("📋 Body:", req.body);
    console.log("📎 Files:", req.files ? `${req.files.length} files` : "No files");

    const {
      productId,
      productCode,
      productName,
      businessId,
      businessName,
      subject,
      complaintType,
      description,
      severity,
    } = req.body;

    // Validation
    if (!productId || !productCode || !productName || !businessId || !businessName || !subject || !complaintType || !description) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if business exists
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    // Process attachments
    const attachments = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        attachments.push({
          name: file.originalname,
          url: file.path,
          size: file.size,
        });
      }
    }

    // Get user info from req.user (set by protect middleware)
    const user = req.user;
    
    // ✅ FIXED: Use user data with fallbacks
    const customerName = user.name || user.fullName || "Customer";
    const customerEmail = user.email || "customer@example.com";
    const customerPhone = user.phone || user.mobile || "N/A";

    console.log(`👤 Customer: ${customerName}, ${customerEmail}`);

    // Create complaint
    const complaint = new Complaint({
      product: productId,
      productCode,
      productName,
      business: businessId,
      businessName,
      businessOwner: business.userId,
      customerName: customerName,
      customerEmail: customerEmail,
      customerPhone: customerPhone,
      subject,
      complaintType,
      description,
      severity: severity || "medium",
      attachments,
      status: "pending",
    });

    await complaint.save();
    console.log(`✅ Complaint created with ID: ${complaint._id}`);

    await complaint.populate("businessOwner", "name email");
    await complaint.populate("product", "name price images");

    res.status(201).json({
      success: true,
      message: "Complaint submitted successfully",
      data: complaint,
    });

  } catch (error) {
    console.error("❌ Error submitting complaint:", error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation error: " + errors.join(', '),
        errors: error.errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
});

/* ================= BUSINESS OWNER: GET MY BUSINESS COMPLAINTS ================= */
router.get("/business/my-complaints", protect, async (req, res) => {
  try {
    const business = await Business.findOne({ userId: req.user.id });
    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    const complaints = await Complaint.find({ business: business._id })
      .populate("product", "name price images")
      .sort({ createdAt: -1 });

    const stats = {
      total: complaints.length,
      pending: complaints.filter(c => c.status === "pending").length,
      in_review: complaints.filter(c => c.status === "in_review").length,
      in_progress: complaints.filter(c => c.status === "in_progress").length,
      resolved: complaints.filter(c => c.status === "resolved").length,
      closed: complaints.filter(c => c.status === "closed").length,
    };

    res.json({
      success: true,
      data: complaints,
      stats,
    });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
});

/* ================= BUSINESS OWNER: GET SINGLE COMPLAINT ================= */
router.get("/:id", protect, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("product", "name price images")
      .populate("businessOwner", "name email");

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    const business = await Business.findOne({ userId: req.user.id });
    const isBusinessOwner = business && complaint.business.toString() === business._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isBusinessOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to view this complaint",
      });
    }

    res.json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    console.error("Error fetching complaint:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
});

/* ================= BUSINESS OWNER: REPLY TO COMPLAINT ================= */
router.post("/:id/reply", protect, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Reply message is required",
      });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    const business = await Business.findOne({ userId: req.user.id });
    const isBusinessOwner = business && complaint.business.toString() === business._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isBusinessOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to reply to this complaint",
      });
    }

    const sender = isAdmin ? "admin" : "business_owner";
    await complaint.addResponse(message, sender, req.user.id);

    if (complaint.status === "pending") {
      complaint.status = "in_progress";
      await complaint.save();
    }

    await complaint.populate("product", "name price images");
    await complaint.populate("businessOwner", "name email");

    res.json({
      success: true,
      message: "Reply sent successfully",
      data: complaint,
    });
  } catch (error) {
    console.error("Error replying to complaint:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
});

/* ================= BUSINESS OWNER: UPDATE COMPLAINT STATUS ================= */
router.put("/:id/status", protect, async (req, res) => {
  try {
    const { status, resolution } = req.body;

    const validStatuses = ["pending", "in_review", "in_progress", "resolved", "closed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    const business = await Business.findOne({ userId: req.user.id });
    const isBusinessOwner = business && complaint.business.toString() === business._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isBusinessOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this complaint",
      });
    }

    complaint.status = status;

    if (status === "resolved" || status === "closed") {
      complaint.resolvedAt = new Date();
      if (resolution) {
        complaint.resolution = resolution;
      }
    }

    await complaint.save();

    res.json({
      success: true,
      message: `Complaint status updated to ${status}`,
      data: complaint,
    });
  } catch (error) {
    console.error("Error updating complaint status:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
});

/* ================= ADMIN: GET ALL COMPLAINTS ================= */
router.get("/admin/all", protectAdmin, async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("product", "name price images")
      .populate("businessOwner", "name email")
      .sort({ createdAt: -1 });

    const stats = {
      total: complaints.length,
      pending: complaints.filter(c => c.status === "pending").length,
      in_review: complaints.filter(c => c.status === "in_review").length,
      in_progress: complaints.filter(c => c.status === "in_progress").length,
      resolved: complaints.filter(c => c.status === "resolved").length,
      closed: complaints.filter(c => c.status === "closed").length,
    };

    res.json({
      success: true,
      data: complaints,
      stats,
    });
  } catch (error) {
    console.error("Error fetching all complaints:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
});

/* ================= ADMIN: DELETE COMPLAINT ================= */
router.delete("/admin/:id", protectAdmin, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    if (complaint.attachments && complaint.attachments.length > 0) {
      for (const attachment of complaint.attachments) {
        if (fs.existsSync(attachment.url)) {
          fs.unlinkSync(attachment.url);
        }
      }
    }

    await complaint.deleteOne();

    res.json({
      success: true,
      message: "Complaint deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting complaint:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
});

export default router;