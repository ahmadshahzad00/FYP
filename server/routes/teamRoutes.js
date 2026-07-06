import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Team from "../models/Team.js";
import { protectAdmin } from "../middleware/middleware.js";

const router = express.Router();

// Ensure upload directory exists
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

ensureDirectoryExists("uploads/team");

/* ================= MULTER CONFIG ================= */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/team/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter,
});

/* ================= GET ALL TEAM MEMBERS ================= */
router.get("/", async (req, res) => {
  try {
    const members = await Team.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: members,
    });
  } catch (error) {
    console.error("Error fetching team members:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* ================= GET SINGLE TEAM MEMBER ================= */
router.get("/:id", async (req, res) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }
    res.json({
      success: true,
      data: member,
    });
  } catch (error) {
    console.error("Error fetching team member:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* ================= ADD TEAM MEMBER ================= */
router.post("/", protectAdmin, upload.single("image"), async (req, res) => {
  try {
    const { name, designation, description } = req.body;

    // Validation
    if (!name || !designation || !description) {
      return res.status(400).json({
        success: false,
        message: "Name, designation, and description are required",
      });
    }

    const memberData = {
      name,
      designation,
      description,
    };

    // Add image if uploaded
    if (req.file) {
      memberData.image = req.file.path;
    }

    const member = new Team(memberData);
    await member.save();

    res.status(201).json({
      success: true,
      message: "Team member added successfully",
      data: member,
    });
  } catch (error) {
    console.error("Error adding team member:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
});

/* ================= UPDATE TEAM MEMBER ================= */
router.put("/:id", protectAdmin, upload.single("image"), async (req, res) => {
  try {
    const { name, designation, description, isActive } = req.body;
    const memberId = req.params.id;

    const member = await Team.findById(memberId);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    // Update fields
    member.name = name || member.name;
    member.designation = designation || member.designation;
    member.description = description || member.description;
    member.isActive = isActive !== undefined ? isActive : member.isActive;

    // Update image if new image uploaded
    if (req.file) {
      // Delete old image if exists
      if (member.image && fs.existsSync(member.image)) {
        fs.unlinkSync(member.image);
      }
      member.image = req.file.path;
    }

    await member.save();

    res.json({
      success: true,
      message: "Team member updated successfully",
      data: member,
    });
  } catch (error) {
    console.error("Error updating team member:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
});

/* ================= DELETE TEAM MEMBER ================= */
router.delete("/:id", protectAdmin, async (req, res) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    // Delete image if exists
    if (member.image && fs.existsSync(member.image)) {
      fs.unlinkSync(member.image);
    }

    await member.deleteOne();

    res.json({
      success: true,
      message: "Team member deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting team member:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
});

export default router;