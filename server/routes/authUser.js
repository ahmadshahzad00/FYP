import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";

const router = express.Router();

/* ================= MULTER CONFIG ================= */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/userProfile");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* ================= MAIL ================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "iamahmadshahzad228576@gmail.com",
    pass: "tsbjfmucxxyalsnh",
  },
});

/* ================= OTP STORE ================= */
const otpStore = {};

/* ================= RESET PASSWORD STORE ================= */
const resetStore = {};

/* ================= SEND OTP ================= */
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    otpStore[email] = {
      otp,
      expire: Date.now() + 2 * 60 * 1000,
      data: req.body,
    };

    await transporter.sendMail({
      to: email,
      subject: "OTP Verification",
      html: `<h2>Your OTP is: ${otp}</h2><p>Valid for 2 minutes</p>`,
    });

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= VERIFY OTP ================= */
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = otpStore[email];

    if (!record) return res.status(400).json({ message: "OTP not found" });
    if (record.expire < Date.now())
      return res.status(400).json({ message: "OTP expired" });
    if (record.otp != otp)
      return res.status(400).json({ message: "Invalid OTP" });

    const { name, phone, address, password } = record.data;

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      phone,
      address,
      password: hashed,
      isVerified: true,
      image: "",
    });

    await user.save();
    delete otpStore[email];

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    if (!user.isVerified)
      return res
        .status(400)
        .json({ message: "Please verify your email first" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= EDIT PROFILE ================= */
router.put("/edit-profile", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secretkey"
    );

    const { name, phone, address, email } = req.body;

    const existing = await User.findOne({
      email,
      _id: { $ne: decoded.id },
    });

    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const user = await User.findByIdAndUpdate(
      decoded.id,
      { name, phone, address, email },
      { new: true }
    );

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= UPLOAD PROFILE IMAGE ================= */
router.post("/upload-profile", upload.single("image"), async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secretkey"
    );

    const user = await User.findByIdAndUpdate(
      decoded.id,
      { image: req.file.filename },
      { new: true }
    );

    res.json({
      message: "Image uploaded successfully",
      image: user.image,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================================================
   🔥 NEW: FORGOT PASSWORD ROUTE
========================================================= */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Email not found" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "10m" }
    );

    resetStore[token] = user._id;

    const resetLink = `http://localhost:3000/reset-password/${token}`;

    await transporter.sendMail({
      to: email,
      subject: "Password Reset Request",
      html: `
        <h2>Reset Your Password</h2>
        <p>Click below link (valid for 10 minutes):</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    });

    res.json({ message: "Password reset link sent to your Email" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================================================
   🔥 NEW: RESET PASSWORD ROUTE
========================================================= */
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    let decoded;

    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "secretkey"
      );
    } catch (err) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await user.save();

    delete resetStore[token];

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;