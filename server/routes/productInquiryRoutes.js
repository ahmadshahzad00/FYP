import express from "express";
import ProductInquiry from "../models/ProductInquiry.js";
import Product from "../models/Product.js";
import Business from "../models/Business.js";
import { protect } from "../middleware/middleware.js";

const router = express.Router();

// ============================================
// USER: Send Product Inquiry
// ============================================
router.post("/", protect, async (req, res) => {
  try {
    const {
      product,
      productName,
      productPrice,
      business,
      customerName,
      customerEmail,
      customerPhone,
      customerCountry,
      customerCity,
      subject,
      message,
      inquiryType,
      quantity,
      preferredDeliveryDate,
    } = req.body;

    // Validation
    if (!product || !productName || !business || !customerName || !customerEmail || !customerPhone || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    // Check if product exists
    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if business exists
    const businessExists = await Business.findById(business);
    if (!businessExists) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    // Create inquiry
    const inquiryData = {
      product,
      productName,
      productPrice: productPrice || productExists.price,
      business,
      businessOwner: businessExists.userId,
      businessName: businessExists.companyName,
      customerName,
      customerEmail,
      customerPhone,
      customerCountry,
      customerCity,
      subject,
      message,
      inquiryType: inquiryType || "general",
      quantity: quantity || 1,
      preferredDeliveryDate,
      status: "pending",
    };

    // Create and save
    const inquiry = new ProductInquiry(inquiryData);
    await inquiry.save();

    // Populate business owner info
    await inquiry.populate("businessOwner", "name email");

    res.status(201).json({
      success: true,
      message: "Inquiry sent successfully!",
      data: inquiry,
    });

  } catch (error) {
    console.error("Error sending inquiry:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
});

// ============================================
// BUSINESS OWNER: Get all inquiries
// ============================================
router.get("/my-inquiries", protect, async (req, res) => {
  try {
    const business = await Business.findOne({ userId: req.user.id });
    
    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    const inquiries = await ProductInquiry.find({ business: business._id })
      .populate("product", "name price images")
      .sort({ createdAt: -1 });

    const totalInquiries = inquiries.length;
    const pendingCount = inquiries.filter(i => i.status === "pending").length;
    const unreadCount = inquiries.filter(i => i.status === "pending" || i.status === "read").length;

    res.status(200).json({
      success: true,
      data: inquiries,
      stats: {
        total: totalInquiries,
        pending: pendingCount,
        unread: unreadCount,
        replied: inquiries.filter(i => i.status === "replied").length,
        resolved: inquiries.filter(i => i.status === "resolved").length,
      },
    });

  } catch (error) {
    console.error("Error fetching inquiries:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
});

// ============================================
// BUSINESS OWNER: Get single inquiry
// ============================================
router.get("/:id", protect, async (req, res) => {
  try {
    const inquiry = await ProductInquiry.findById(req.params.id)
      .populate("product", "name price images")
      .populate("businessOwner", "name email");

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    const business = await Business.findOne({ userId: req.user.id });
    if (!business || inquiry.business.toString() !== business._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to view this inquiry",
      });
    }

    if (inquiry.status === "pending") {
      inquiry.status = "read";
      inquiry.readAt = new Date();
      await inquiry.save();
    }

    res.status(200).json({
      success: true,
      data: inquiry,
    });

  } catch (error) {
    console.error("Error fetching inquiry:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
});

// ============================================
// BUSINESS OWNER: Reply to inquiry
// ============================================
router.post("/:id/reply", protect, async (req, res) => {
  try {
    const { replyMessage } = req.body;

    if (!replyMessage || replyMessage.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Reply message is required",
      });
    }

    const inquiry = await ProductInquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    const business = await Business.findOne({ userId: req.user.id });
    if (!business || inquiry.business.toString() !== business._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to reply to this inquiry",
      });
    }

    await inquiry.addResponse(replyMessage, "business_owner", req.user.id);
    await inquiry.populate("businessOwner", "name email");
    await inquiry.populate("product", "name price images");

    res.status(200).json({
      success: true,
      message: "Reply sent successfully!",
      data: inquiry,
    });

  } catch (error) {
    console.error("Error sending reply:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
});

// ============================================
// BUSINESS OWNER: Resolve inquiry
// ============================================
router.put("/:id/resolve", protect, async (req, res) => {
  try {
    const inquiry = await ProductInquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    const business = await Business.findOne({ userId: req.user.id });
    if (!business || inquiry.business.toString() !== business._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to resolve this inquiry",
      });
    }

    await inquiry.resolve();

    res.status(200).json({
      success: true,
      message: "Inquiry marked as resolved",
      data: inquiry,
    });

  } catch (error) {
    console.error("Error resolving inquiry:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
});

// ============================================
// BUSINESS OWNER: Delete inquiry
// ============================================
router.delete("/:id", protect, async (req, res) => {
  try {
    const inquiry = await ProductInquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    const business = await Business.findOne({ userId: req.user.id });
    if (!business || inquiry.business.toString() !== business._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this inquiry",
      });
    }

    await inquiry.deleteOne();

    res.status(200).json({
      success: true,
      message: "Inquiry deleted successfully",
    });

  } catch (error) {
    console.error("Error deleting inquiry:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
});

// ============================================
// BUSINESS OWNER: Get inquiry statistics
// ============================================
router.get("/stats/my-stats", protect, async (req, res) => {
  try {
    const business = await Business.findOne({ userId: req.user.id });
    
    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    const stats = await ProductInquiry.aggregate([
      { $match: { business: business._id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayInquiries = await ProductInquiry.countDocuments({
      business: business._id,
      createdAt: { $gte: today, $lt: tomorrow },
    });

    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekInquiries = await ProductInquiry.countDocuments({
      business: business._id,
      createdAt: { $gte: weekStart },
    });

    const statsMap = {
      total: 0,
      pending: 0,
      read: 0,
      replied: 0,
      resolved: 0,
    };

    stats.forEach(stat => {
      statsMap[stat._id] = stat.count;
      statsMap.total += stat.count;
    });

    res.status(200).json({
      success: true,
      data: {
        ...statsMap,
        today: todayInquiries,
        thisWeek: weekInquiries,
      },
    });

  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
});

export default router;