import express from "express";
import multer from "multer";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import exifParser from "exif-parser";
import dotenv from "dotenv";

import Product from "../models/Product.js";

dotenv.config();

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/products/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  "/upload-product",
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        businessId,
        name,
        category,
        description,
        size,
        colors,
        price,
        method,
        availableQuantity,
      } = req.body;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Product image required",
        });
      }

      /* ==========================
         EXIF CHECK
      ========================== */

      let hasExif = false;

      try {
        const buffer = fs.readFileSync(req.file.path);

        const parsed = exifParser.create(buffer).parse();

        if (
          parsed?.tags &&
          Object.keys(parsed.tags).length > 0
        ) {
          hasExif = true;
        }
      } catch (err) {}

      if (hasExif) {
        fs.unlinkSync(req.file.path);

        return res.status(400).json({
          success: false,
          message:
            "Image rejected. EXIF metadata detected.",
        });
      }

      /* ==========================
         AI CHECK
      ========================== */

      const formData = new FormData();

      formData.append(
        "media",
        fs.createReadStream(req.file.path)
      );

      formData.append(
        "models",
        "genai,deepfake"
      );

      formData.append(
        "api_user",
        process.env.SIGHTENGINE_USER
      );

      formData.append(
        "api_secret",
        process.env.SIGHTENGINE_SECRET
      );

      const aiResponse = await axios.post(
        "https://api.sightengine.com/1.0/check.json",
        formData,
        {
          headers: formData.getHeaders(),
        }
      );

      const result = aiResponse.data;

      let aiProbability = 0;

      if (result.type?.ai_generated) {
        aiProbability =
          result.type.ai_generated * 100;
      }

      if (aiProbability > 40) {
        fs.unlinkSync(req.file.path);

        return res.status(400).json({
          success: false,
          message:
            "Please upload a real product image. AI generated image detected.",
          aiProbability,
        });
      }

      /* ==========================
         SAVE PRODUCT
      ========================== */

      const product = await Product.create({
        businessId,
        name,
        category,
        description,
        size,
        colors,
        price,
        method,
        availableQuantity,
        image: req.file.path,
      });

      return res.status(201).json({
        success: true,
        message: "Product uploaded successfully",
        product,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

export default router;