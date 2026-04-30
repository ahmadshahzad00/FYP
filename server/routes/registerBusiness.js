import express from "express";
import multer from "multer";
import Business from "../models/Business.js";
import { protect } from "../middleware/middleware.js";

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
    const data = req.body;

    // ✅ REQUIRED FILE CHECK
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

      ...data,

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
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* ================= ADMIN: GET ALL REQUESTS ================= */

router.get("/all", protect, async (req, res) => {
  try {
    const businesses = await Business.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(businesses);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching businesses" });
  }
});

/* ================= ADMIN: APPROVE / REJECT ================= */

router.put("/:id/status", protect, async (req, res) => {
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

    res.json({ msg: "Status updated", business });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;