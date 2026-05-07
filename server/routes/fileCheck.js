import express from "express";
import multer from "multer";
import axios from "axios";
import exifParser from "exif-parser";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

/* ===== Multer ===== */
const upload = multer({ storage: multer.memoryStorage() });

/* ===== ROUTE ===== */
router.post("/check-image", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    /* ================= EXIF ================= */
    let exifData;
    try {
      const parser = exifParser.create(file.buffer);
      exifData = parser.parse();
    } catch (err) {
      exifData = "No EXIF metadata found";
    }

    /* ================= DEBUG KEY (ADD HERE) ================= */
    console.log("🔥 HIVE KEY LOADED:", process.env.HIVE_API_KEY);

    /* ================= HIVE AI CHECK ================= */
    let aiResult;

    try {
      const base64Image =
            "data:image/jpeg;base64," + file.buffer.toString("base64");

            const response = await axios.post(
                "https://api.thehive.ai/api/v3/task/sync",
                {
                    inputs: [
                    {
                        type: "image",
                        value: "https://your-image-url.com/image.jpg"
                    }
                    ],
                    models: ["sfw_image_classification"]
                },
                {
                    headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.HIVE_API_KEY}`
                    }
                }
            );

      aiResult = response.data;

    } catch (err) {
      console.log("HIVE ERROR STATUS:", err.response?.status);
      console.log("HIVE ERROR DATA:", err.response?.data);
      console.log("HIVE ERROR MESSAGE:", err.message);

      aiResult = {
        success: false,
        status: err.response?.status,
        error: err.response?.data || err.message,
      };
    }

    /* ================= RESPONSE ================= */
    res.json({
      success: true,
      fileName: file.originalname,
      exif: exifData,
      aiCheck: aiResult,
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;