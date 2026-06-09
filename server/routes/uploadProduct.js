import express from "express";
import multer from "multer";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import exifParser from "exif-parser";
import dotenv from "dotenv";

import Product from "../models/Product.js";
import Business from "../models/Business.js";

dotenv.config();

const router = express.Router();

// Ensure upload directory exists
if (!fs.existsSync("uploads/products/")) {
  fs.mkdirSync("uploads/products/", { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/products/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// GET products by business ID
router.get("/products/:businessId", async (req, res) => {
  try {
    const { businessId } = req.params;
    
    const products = await Product.find({ businessId }).sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET single product by ID
router.get("/product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    
    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// POST create new product
router.post("/upload-product", upload.single("image"), async (req, res) => {
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

    // Validate required fields
    if (!businessId) {
      return res.status(400).json({
        success: false,
        message: "Business ID is required",
      });
    }

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Product image required",
      });
    }

    // Verify business exists
    const business = await Business.findById(businessId);
    if (!business) {
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    /* ==========================
       EXIF CHECK
    ========================== */
    let hasExif = false;
    try {
      const buffer = fs.readFileSync(req.file.path);
      const parsed = exifParser.create(buffer).parse();
      if (parsed?.tags && Object.keys(parsed.tags).length > 0) {
        hasExif = true;
      }
    } catch (err) {
      // EXIF parsing failed, continue
    }

    if (hasExif) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: "Image rejected. EXIF metadata detected.",
      });
    }

    /* ==========================
       AI CHECK (Optional - can be disabled if API keys not set)
    ========================== */
    if (process.env.SIGHTENGINE_USER && process.env.SIGHTENGINE_SECRET) {
      try {
        const formData = new FormData();
        formData.append("media", fs.createReadStream(req.file.path));
        formData.append("models", "genai,deepfake");
        formData.append("api_user", process.env.SIGHTENGINE_USER);
        formData.append("api_secret", process.env.SIGHTENGINE_SECRET);

        const aiResponse = await axios.post(
          "https://api.sightengine.com/1.0/check.json",
          formData,
          {
            headers: formData.getHeaders(),
            timeout: 10000,
          }
        );

        const result = aiResponse.data;
        let aiProbability = 0;

        if (result.type?.ai_generated) {
          aiProbability = result.type.ai_generated * 100;
        }

        if (aiProbability > 40) {
          fs.unlinkSync(req.file.path);
          return res.status(400).json({
            success: false,
            message: "Please upload a real product image. AI generated image detected.",
            aiProbability,
          });
        }
      } catch (aiError) {
        console.error("AI Check Error:", aiError.message);
        // Continue without AI check if it fails
      }
    }

    /* ==========================
       SAVE PRODUCT
    ========================== */
    const product = await Product.create({
      businessId,
      name,
      category: category || "",
      description: description || "",
      size: size || "",
      colors: colors || "",
      price: price || "",
      method: method || "",
      availableQuantity: availableQuantity || 0,
      image: req.file.path,
    });

    return res.status(201).json({
      success: true,
      message: "Product uploaded successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    
    // Clean up uploaded file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// PUT update product
router.put("/update-product/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      category,
      description,
      size,
      colors,
      price,
      method,
      availableQuantity,
    } = req.body;

    // Find existing product
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Prepare update data
    const updateData = {
      name: name || existingProduct.name,
      category: category || existingProduct.category,
      description: description || existingProduct.description,
      size: size || existingProduct.size,
      colors: colors || existingProduct.colors,
      price: price || existingProduct.price,
      method: method || existingProduct.method,
      availableQuantity: availableQuantity || existingProduct.availableQuantity,
    };

    // If new image uploaded, process it
    if (req.file) {
      // Check EXIF for new image
      let hasExif = false;
      try {
        const buffer = fs.readFileSync(req.file.path);
        const parsed = exifParser.create(buffer).parse();
        if (parsed?.tags && Object.keys(parsed.tags).length > 0) {
          hasExif = true;
        }
      } catch (err) {}

      if (hasExif) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({
          success: false,
          message: "Image rejected. EXIF metadata detected.",
        });
      }

      // AI check for new image
      if (process.env.SIGHTENGINE_USER && process.env.SIGHTENGINE_SECRET) {
        try {
          const formData = new FormData();
          formData.append("media", fs.createReadStream(req.file.path));
          formData.append("models", "genai,deepfake");
          formData.append("api_user", process.env.SIGHTENGINE_USER);
          formData.append("api_secret", process.env.SIGHTENGINE_SECRET);

          const aiResponse = await axios.post(
            "https://api.sightengine.com/1.0/check.json",
            formData,
            {
              headers: formData.getHeaders(),
              timeout: 10000,
            }
          );

          const result = aiResponse.data;
          let aiProbability = 0;

          if (result.type?.ai_generated) {
            aiProbability = result.type.ai_generated * 100;
          }

          if (aiProbability > 40) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
              success: false,
              message: "Please upload a real product image. AI generated image detected.",
            });
          }
        } catch (aiError) {
          console.error("AI Check Error:", aiError.message);
        }
      }

      // Delete old image
      if (existingProduct.image && fs.existsSync(existingProduct.image)) {
        fs.unlinkSync(existingProduct.image);
      }
      
      updateData.image = req.file.path;
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    
    // Clean up uploaded file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// DELETE product
router.delete("/delete-product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    
    // Delete image file
    if (product.image && fs.existsSync(product.image)) {
      fs.unlinkSync(product.image);
    }
    
    // Delete product from database
    await Product.findByIdAndDelete(id);
    
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;