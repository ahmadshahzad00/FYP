import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import Business from "../models/Business.js";
import { protect, protectAdmin } from "../middleware/middleware.js";
import { verifyMemberId } from "../services/chamberVerification.js";

const router = express.Router();

// Ensure upload directories exist
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

ensureDirectoryExists("uploads/business");
ensureDirectoryExists("uploads/files");

/* ================= MULTER CONFIG ================= */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "chamberMembership") {
      cb(null, "uploads/files/");
    } else {
      cb(null, "uploads/business/");
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only images and PDF files are allowed"));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: fileFilter,
});

const uploadFields = upload.fields([
  { name: "chamberMembership", maxCount: 1 },
  { name: "cnicFront", maxCount: 1 },
  { name: "cnicBack", maxCount: 1 },
  { name: "logo", maxCount: 1 },
]);

/* ================= USER SUBMIT BUSINESS WITH VERIFICATION ================= */
router.post("/", protect, uploadFields, async (req, res) => {
  try {
    // Check required files
    if (
      !req.files?.chamberMembership ||
      !req.files?.cnicFront ||
      !req.files?.cnicBack
    ) {
      return res.status(400).json({
        success: false,
        msg: "All required files must be uploaded",
      });
    }

    // Check if user already has a business
    const existingBusiness = await Business.findOne({ userId: req.user.id });
    if (existingBusiness) {
      return res.status(400).json({
        success: false,
        msg: "You have already submitted a business request",
      });
    }

    // Get member ID from request
    const memberId = req.body.memberId;

    // ============================================
    // VERIFY MEMBER ID WITH CHAMBER OF COMMERCE
    // ============================================
    let verificationResult = null;
    let status = "pending";

    try {
      console.log(`🔍 Verifying member ID: ${memberId}`);
      verificationResult = await verifyMemberId(memberId);
      
      if (verificationResult.verified) {
        status = "approved";
        console.log(`✅ Member ID ${memberId} verified successfully!`);
      } else {
        status = "rejected";
        console.log(`❌ Member ID ${memberId} verification failed: ${verificationResult.message}`);
      }
    } catch (error) {
      console.error("❌ Verification error:", error);
      status = "pending";
      verificationResult = {
        verified: false,
        message: "Verification service error. Manual review required."
      };
    }

    // Create business with verification status
    const business = new Business({
      userId: req.user.id,
      companyName: req.body.companyName,
      ownerName: req.body.ownerName,
      email: req.body.email,
      phone: req.body.phone,
      whatsapp: req.body.whatsapp || "",
      yearEstablished: req.body.yearEstablished,
      factoryAddress: req.body.factoryAddress,
      memberId: memberId,
      category: req.body.category,
      products: req.body.products,
      website: req.body.website || "",
      description: req.body.description || "",
      facebook: req.body.facebook || "",
      instagram: req.body.instagram || "",
      twitter: req.body.twitter || "",
      tiktok: req.body.tiktok || "",
      pinterest: req.body.pinterest || "",
      status: status,
      chamberMembership: req.files.chamberMembership[0].path,
      cnicFront: req.files.cnicFront[0].path,
      cnicBack: req.files.cnicBack[0].path,
      logo: req.files?.logo?.[0]?.path || "",
      verificationDetails: {
        verified: verificationResult?.verified || false,
        message: verificationResult?.message || "",
        data: verificationResult?.data || {},
        verifiedAt: new Date(),
        verifiedBy: "auto"
      }
    });

    await business.save();

    // Send response with verification status
    let message = "";
    if (status === "approved") {
      message = "✅ Business registered and verified successfully!";
    } else if (status === "rejected") {
      message = "❌ Business registration submitted but member ID could not be verified. Please contact support with valid Chamber of Commerce membership.";
    } else {
      message = "⏳ Business registration submitted. Verification in progress.";
    }

    res.status(201).json({
      success: true,
      msg: message,
      business,
      verification: verificationResult
    });

  } catch (err) {
    console.error("Error submitting business:", err);
    res.status(500).json({
      success: false,
      msg: "Server error: " + err.message,
    });
  }
});

/* ================= USER: GET MY BUSINESS ================= */
router.get("/my-business", protect, async (req, res) => {
  try {
    const business = await Business.findOne({
      userId: req.user.id,
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        msg: "No business found",
      });
    }

    // Return business with explicit ID
    res.json({
      success: true,
      business: business,
      _id: business._id, // Explicitly include _id for frontend
    });
  } catch (err) {
    console.error("Error fetching business:", err);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
});

/* ================= ADMIN: GET ALL BUSINESS REQUESTS ================= */
router.get("/all", protectAdmin, async (req, res) => {
  try {
    const businesses = await Business.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: businesses,
    });
  } catch (err) {
    console.error("Error fetching businesses:", err);
    res.status(500).json({
      success: false,
      msg: "Error fetching businesses",
    });
  }
});

/* ================= ADMIN: UPDATE BUSINESS STATUS ================= */
router.put("/:id/status", protectAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({
        success: false,
        msg: "Invalid status. Must be 'approved', 'rejected', or 'pending'",
      });
    }

    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({
        success: false,
        msg: "Business not found",
      });
    }

    business.status = status;
    
    // Update verification details if admin manually changes status
    business.verificationDetails = {
      verified: status === "approved",
      message: status === "approved" ? "Manually approved by admin" : "Manually rejected by admin",
      data: business.verificationDetails?.data || {},
      verifiedAt: new Date(),
      verifiedBy: "admin"
    };

    await business.save();

    res.json({
      success: true,
      msg: `Status updated to ${status}`,
      business,
    });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
});

/* ================= ADMIN: RE-VERIFY BUSINESS ================= */
router.post("/:id/reverify", protectAdmin, async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({
        success: false,
        msg: "Business not found",
      });
    }

    // Re-verify member ID
    const memberId = business.memberId;
    const verificationResult = await verifyMemberId(memberId);

    if (verificationResult.verified) {
      business.status = "approved";
    } else {
      business.status = "rejected";
    }

    business.verificationDetails = {
      verified: verificationResult.verified,
      message: verificationResult.message,
      data: verificationResult.data || {},
      verifiedAt: new Date(),
      verifiedBy: "admin"
    };

    await business.save();

    res.json({
      success: true,
      msg: `Business re-verified and ${business.status}`,
      business,
      verification: verificationResult,
    });

  } catch (err) {
    console.error("Error re-verifying business:", err);
    res.status(500).json({
      success: false,
      msg: "Server error: " + err.message,
    });
  }
});

/* ================= PUBLIC: GET BUSINESS BY ID ================= */
router.get("/business/:id", async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid business ID format",
      });
    }

    const business = await Business.findById(req.params.id);
    
    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }
    
    res.status(200).json({
      success: true,
      business,
    });
  } catch (error) {
    console.error("Error fetching business by ID:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* ================= PUBLIC: GET BUSINESS BY MEMBER ID ================= */
router.get("/business-by-member/:memberId", async (req, res) => {
  try {
    const { memberId } = req.params;
    
    const business = await Business.findOne({ memberId });
    
    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found with this Member ID",
      });
    }
    
    res.status(200).json({
      success: true,
      business,
    });
  } catch (error) {
    console.error("Error fetching business by member ID:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* ================= BUSINESS OWNER: UPDATE BUSINESS ================= */
router.put("/update-business/:id", protect, async (req, res) => {
  try {
    const businessId = req.params.id;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(businessId)) {
      return res.status(400).json({  
        success: false, 
        msg: "Invalid business ID format" 
      });
    }

    // Find business
    const business = await Business.findById(businessId);
    
    if (!business) {
      return res.status(404).json({
        success: false,
        msg: "Business not found"
      });
    }

    // Check if user owns this business
    if (business.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        msg: "You don't have permission to update this business"
      });
    }

    // Check if business is approved - if not, allow editing but keep status
    const isApproved = business.status === "approved";

    // Update fields
    const updatedFields = {
      companyName: req.body.companyName || business.companyName,
      ownerName: req.body.ownerName || business.ownerName,
      email: req.body.email || business.email,
      phone: req.body.phone || business.phone,
      whatsapp: req.body.whatsapp || business.whatsapp,
      yearEstablished: req.body.yearEstablished || business.yearEstablished,
      factoryAddress: req.body.factoryAddress || business.factoryAddress,
      memberId: req.body.memberId || business.memberId,
      category: req.body.category || business.category,
      products: req.body.products || business.products,
      website: req.body.website || business.website,
      description: req.body.description || business.description,
      facebook: req.body.facebook || business.facebook,
      instagram: req.body.instagram || business.instagram,
      twitter: req.body.twitter || business.twitter,
      tiktok: req.body.tiktok || business.tiktok,
      pinterest: req.body.pinterest || business.pinterest,
    };

    // If business was approved and member ID changed, reset verification
    if (isApproved && req.body.memberId && req.body.memberId !== business.memberId) {
      updatedFields.status = "pending";
      updatedFields.verificationDetails = {
        verified: false,
        message: "Member ID changed. Re-verification required.",
        data: {},
        verifiedAt: new Date(),
        verifiedBy: "auto"
      };
    }

    // Update the business
    const updatedBusiness = await Business.findByIdAndUpdate(
      businessId,
      { $set: updatedFields },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      msg: isApproved && req.body.memberId && req.body.memberId !== business.memberId 
        ? "Business updated. Member ID changed - Re-verification required." 
        : "Business updated successfully",
      business: updatedBusiness
    });

  } catch (err) {
    console.error("Error updating business:", err);
    res.status(500).json({
      success: false,
      msg: "Server error: " + err.message
    });
  }
});

export default router;