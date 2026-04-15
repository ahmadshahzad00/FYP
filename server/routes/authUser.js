import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import nodemailer from "nodemailer";

const router = express.Router();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/userProfile");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "iamahmadshahzad228576@gmail.com",
    pass: "rpkz vraw sgef uhrl",
  },
});

const otpStore = {}; // { email: { otp, data, expire } }


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

router.post("/verify-otp", upload.single("image"), async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = otpStore[email];

    if (!record) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (record.expire < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (record.otp != otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const { name, phone, address, password } = record.data;

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      phone,
      address,
      password: hashed,
      image: req.file ? req.file.filename : "",
    });

    await user.save();

    delete otpStore[email];

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;