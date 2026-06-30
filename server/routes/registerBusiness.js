import express from "express";
import multer from "multer";
import Business from "../models/Business.js";
import { protect, protectAdmin } from "../middleware/middleware.js";

const router = express.Router();

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
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

const uploadFields = upload.fields([
  { name: "chamberMembership", maxCount: 1 },
  { name: "cnicFront", maxCount: 1 },
  { name: "cnicBack", maxCount: 1 },
  { name: "logo", maxCount: 1 },
]);

/* ================= USER SUBMIT BUSINESS ================= */

router.post("/", protect, uploadFields, async (req, res) => {
  try {
    if (
      !req.files?.chamberMembership ||
      !req.files?.cnicFront ||
      !req.files?.cnicBack
    ) {
      return res.status(400).json({
        msg: "All required files must be uploaded",
      });
    }

    const business = new Business({
      userId: req.user.id,
      ...req.body,
      chamberMembership: req.files.chamberMembership[0].path,
      cnicFront: req.files.cnicFront[0].path,
      cnicBack: req.files.cnicBack[0].path,
      logo: req.files?.logo?.[0]?.path || "",
    });

    await business.save();

    res.status(201).json({
      msg: "Business request submitted",
      business,
    });
  } catch (err) {
    console.error("Error submitting business:", err);
    res.status(500).json({ msg: "Server error" });
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
        msg: "No business found",
      });
    }

    res.json(business);
  } catch (err) {
    console.error("Error fetching business:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* ================= ADMIN: GET ALL BUSINESS REQUESTS ================= */

router.get("/all", protectAdmin, async (req, res) => {
  try {
    const businesses = await Business.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(businesses);
  } catch (err) {
    console.error("Error fetching businesses:", err);
    res.status(500).json({ msg: "Error fetching businesses" });
  }
});

/* ================= ADMIN: UPDATE BUSINESS STATUS ================= */

router.put("/:id/status", protectAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ msg: "Business not found" });
    }

    business.status = status;
    await business.save();

    res.json({
      msg: "Status updated",
      business,
    });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* ================= PUBLIC: GET BUSINESS BY ID ================= */

router.get("/business/:id", async (req, res) => {
  try {
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
    console.error(error);
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
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;