import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Complaint from "../models/Complaint.js";
import Product from "../models/Product.js";
import Business from "../models/Business.js";
import { protect, protectAdmin } from "../middleware/middleware.js";
import nodemailer from "nodemailer";

const router = express.Router();

// Email Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "iamahmadshahzad228576@gmail.com",
    pass: "hznebvmgjdhnhais",
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("❌ Email configuration error:", error);
  } else {
    console.log("✅ Email server is ready");
  }
});

// Ensure upload directory exists
const uploadDir = "uploads/complaints";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
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

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed: ${file.mimetype}`));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: fileFilter,
});

// Email Functions
const sendComplaintReplyEmail = async (customerEmail, customerName, replyData) => {
  try {
    const { 
      complaintSubject, 
      productName, 
      businessName, 
      replyMessage,
      complaintId,
      status
    } = replyData;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
          .reply-box { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #dc3545; margin: 20px 0; }
          .product-info { background: #e9ecef; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .footer { text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px; }
          .button { display: inline-block; background: #dc3545; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; }
          .status-badge { 
            display: inline-block; 
            padding: 5px 15px; 
            border-radius: 20px; 
            background: ${status === 'resolved' ? '#28a745' : '#ffc107'};
            color: ${status === 'resolved' ? 'white' : '#333'};
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="margin: 0;">📩 Reply to Your Complaint</h2>
          </div>
          <div class="content">
            <h3>Dear ${customerName},</h3>
            <p>The business owner has responded to your complaint regarding <strong>${productName}</strong>.</p>
            
            <div class="product-info">
              <strong>📦 Product:</strong> ${productName}<br>
              <strong>🏢 Business:</strong> ${businessName}<br>
              <strong>📝 Subject:</strong> ${complaintSubject}<br>
              <strong>📌 Status:</strong> <span class="status-badge">${status}</span>
            </div>

            <div class="reply-box">
              <h4 style="margin-top: 0;">💬 Response from ${businessName}:</h4>
              <p style="font-size: 16px; white-space: pre-wrap;">${replyMessage}</p>
            </div>

            <p style="color: #6c757d; font-size: 14px;">
              You can reply directly to this email to continue the conversation.
            </p>

            <hr style="border: 1px solid #dee2e6; margin: 20px 0;">

            <p style="font-size: 14px; color: #6c757d;">
              <strong>📌 Complaint ID:</strong> ${complaintId}<br>
              <strong>📅 Date:</strong> ${new Date().toLocaleString()}
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Sialkot Export Mella. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"${businessName}" <iamahmadshahzad228576@gmail.com>`,
      to: customerEmail,
      subject: `Re: ${complaintSubject}`,
      html: html,
    });
    return true;
  } catch (error) {
    console.error("❌ Email error:", error);
    return false;
  }
};

const sendComplaintStatusEmail = async (customerEmail, customerName, statusData) => {
  try {
    const { 
      complaintSubject, 
      productName, 
      businessName, 
      status,
      resolution,
      complaintId
    } = statusData;

    const statusMessages = {
      resolved: "✅ Your complaint has been resolved!",
      in_progress: "🔄 Your complaint is now being reviewed and worked on.",
      in_review: "🔍 Your complaint is under review.",
      closed: "🔒 Your complaint has been closed.",
    };

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0d6efd; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
          .status-box { 
            background: white; 
            padding: 20px; 
            border-radius: 8px; 
            border-left: 4px solid ${status === 'resolved' ? '#28a745' : '#ffc107'};
            margin: 20px 0;
          }
          .footer { text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px; }
          .button { display: inline-block; background: #0d6efd; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; }
          .status-badge { 
            display: inline-block; 
            padding: 5px 15px; 
            border-radius: 20px; 
            background: ${status === 'resolved' ? '#28a745' : '#ffc107'};
            color: ${status === 'resolved' ? 'white' : '#333'};
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="margin: 0;">📌 Complaint Status Update</h2>
          </div>
          <div class="content">
            <h3>Dear ${customerName},</h3>
            <p>${statusMessages[status] || 'Your complaint status has been updated.'}</p>
            
            <div class="product-info">
              <strong>📦 Product:</strong> ${productName}<br>
              <strong>🏢 Business:</strong> ${businessName}<br>
              <strong>📝 Subject:</strong> ${complaintSubject}<br>
              <strong>📌 New Status:</strong> <span class="status-badge">${status}</span>
            </div>

            ${resolution ? `
              <div class="status-box">
                <h4 style="margin-top: 0;">📋 Resolution Details:</h4>
                <p style="white-space: pre-wrap;">${resolution}</p>
              </div>
            ` : ''}

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/complaint/${complaintId}" class="button">
                View Complaint Status
              </a>
            </div>

            <hr style="border: 1px solid #dee2e6; margin: 20px 0;">

            <p style="font-size: 14px; color: #6c757d;">
              <strong>📌 Complaint ID:</strong> ${complaintId}
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Sialkot Export Mella. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"${businessName}" <iamahmadshahzad228576@gmail.com>`,
      to: customerEmail,
      subject: `Complaint Status Update: ${complaintSubject}`,
      html: html,
    });
    return true;
  } catch (error) {
    console.error("❌ Email error:", error);
    return false;
  }
};

/* ================= USER: SUBMIT COMPLAINT ================= */
router.post("/", protect, upload.array("attachments", 5), async (req, res) => {
  try {
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
      customerName,
      customerEmail,
      customerPhone,
    } = req.body;

    if (!productId || !productCode || !productName || !businessId || !businessName || !subject || !complaintType || !description) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

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

    const complaint = new Complaint({
      product: productId,
      productCode,
      productName,
      business: businessId,
      businessName,
      businessOwner: business.userId,
      customerName: customerName || "Customer",
      customerEmail: customerEmail || "customer@example.com",
      customerPhone: customerPhone || "N/A",
      subject,
      complaintType,
      description,
      severity: severity || "medium",
      attachments,
      status: "pending",
    });

    await complaint.save();

    await complaint.populate("businessOwner", "name email");
    await complaint.populate("product", "name price images");

    res.status(201).json({
      success: true,
      message: "Complaint submitted successfully",
      data: complaint,
    });

  } catch (error) {
    console.error("Error submitting complaint:", error);
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
/* ================= PUBLIC: GET SINGLE COMPLAINT (No Auth Required) ================= */
router.get("/:id", async (req, res) => {
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

    // Send email notification
    await sendComplaintReplyEmail(
      complaint.customerEmail,
      complaint.customerName,
      {
        complaintSubject: complaint.subject,
        productName: complaint.productName,
        businessName: complaint.businessName,
        replyMessage: message,
        complaintId: complaint._id,
        status: complaint.status,
      }
    );

    res.json({
      success: true,
      message: "Reply sent successfully! Email notification sent to customer.",
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

    // Send status update email for important status changes
    if (status === "resolved" || status === "in_progress" || status === "in_review") {
      await sendComplaintStatusEmail(
        complaint.customerEmail,
        complaint.customerName,
        {
          complaintSubject: complaint.subject,
          productName: complaint.productName,
          businessName: complaint.businessName,
          status: status,
          resolution: resolution || "",
          complaintId: complaint._id,
        }
      );
    }

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