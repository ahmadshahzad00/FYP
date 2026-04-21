import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

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
      pass: "rpkzvrawsgefuhrl",
    },

});

const otpStore = {}; 

router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    // check existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    otpStore[email] = {
      otp,
      expire: Date.now() + 2 * 60 * 1000, // 2 minutes
      data: req.body,
    };

    // send email
    await transporter.sendMail({
      to: email,
      subject: "OTP Verification",
      html: `
        <h2>Your OTP is: ${otp}</h2>
        <p>This OTP is valid for 2 minutes.</p>
      `,
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

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    // create user 
    const user = new User({
      name,
      email,
      phone,
      address,
      password: hashed,
      image: req.file ? req.file.filename : "",
      isVerified: true, 
    });

    await user.save();

    // remove OTP after success
    delete otpStore[email];

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= LOGIN USER ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // console.log("LOGIN REQUEST:", req.body);

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // check verified (only blocks unverified users)
    if (!user.isVerified) {
      return res.status(400).json({
        message: "Please verify your email first",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        name: user.name,
        email: user.email,
        image: user.image,
      },
    });
  } catch (err) {
    // console.log("LOGIN ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

/* router.get("/test", (req, res) => {
  res.send("Server working");
}); */

export default router;