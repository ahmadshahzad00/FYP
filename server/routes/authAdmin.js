import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/AdminUser.js";

const router = express.Router();

router.post("/admin-register", async (req, res) => {
  try {
    const { firstname, lastname, phone, email, password } = req.body;

    if (!firstname || !lastname || !phone || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstname,
      lastname,
      phone,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
