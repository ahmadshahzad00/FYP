import express from "express";
import Contact from "../models/Contact.js";

const router = express.Router();

// ============================================
// PUBLIC ROUTE - User sends message
// ============================================
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Simple validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields"
      });
    }

    // Save to database
    const newMessage = new Contact({
      name,
      email,
      subject,
      message
    });

    await newMessage.save();

    res.status(201).json({
      success: true,
      message: "Message sent successfully!",
      data: newMessage
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// ============================================
// ADMIN ROUTE - Get all messages
// ============================================
router.get("/admin", async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: messages
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// ============================================
// ADMIN ROUTE - Delete message
// ============================================
router.delete("/admin/:id", async (req, res) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Message not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Message deleted successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// ============================================
// ADMIN ROUTE - Update status
// ============================================
router.put("/admin/:id", async (req, res) => {
  try {
    const { status } = req.body;
    
    const message = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found"
      });
    }

    res.status(200).json({
      success: true,
      data: message
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

export default router;