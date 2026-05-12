import express from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import exifParser from "exif-parser";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/ai/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post("/check-image", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    let exifData;

    try {
      const buffer = fs.readFileSync(file.path);
      const parsed = exifParser.create(buffer).parse();

      exifData =
        parsed?.tags && Object.keys(parsed.tags).length > 0
          ? parsed.tags
          : "No EXIF metadata found";
    } catch (err) {
      exifData = "No EXIF metadata found";
    }

    let aiResult;

    try {
      const formData = new FormData();

      formData.append("media", fs.createReadStream(file.path));

      formData.append("models", "genai,deepfake,face-attributes");

      formData.append("api_user", process.env.SIGHTENGINE_USER);
      formData.append("api_secret", process.env.SIGHTENGINE_SECRET);

      const response = await axios.post(
        "https://api.sightengine.com/1.0/check.json",
        formData,
        {
          headers: formData.getHeaders(),
        }
      );

      aiResult = response.data;

    } catch (err) {
      console.log("========== SIGHTENGINE ERROR ==========");
      console.log(err.response?.data || err.message);
      console.log("======================================");

      aiResult = {
        success: false,
        error: err.response?.data || err.message,
      };
    }

    /* ================= FINAL RESPONSE ================= */
    return res.json({
      success: true,
      fileName: file.originalname,
      filePath: file.path,
      exif: exifData,
      aiCheck: aiResult,
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

export default router;