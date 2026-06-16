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

// Configure multer for multiple images (max 5)
const upload = multer({ 
  storage,
  limits: { files: 5 }
}).array("images", 5);

// Helper function to check a single image for EXIF and AI
const checkImage = async (filePath) => {
  // EXIF check
  let hasExif = false;
  try {
    const buffer = fs.readFileSync(filePath);
    const parsed = exifParser.create(buffer).parse();
    if (parsed?.tags && Object.keys(parsed.tags).length > 0) {
      hasExif = true;
    }
  } catch (err) {
    // EXIF parsing failed, continue
  }

  if (hasExif) {
    fs.unlinkSync(filePath);
    return { passed: false, message: "Image rejected. EXIF metadata detected." };
  }

  // AI check (Optional - can be disabled if API keys not set)
  if (process.env.SIGHTENGINE_USER && process.env.SIGHTENGINE_SECRET) {
    try {
      const formData = new FormData();
      formData.append("media", fs.createReadStream(filePath));
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
        fs.unlinkSync(filePath);
        return { passed: false, message: "AI generated image detected. Please upload a real product image." };
      }
    } catch (aiError) {
      // Silent fail - continue without AI check
    }
  }

  return { passed: true, message: "Image passed" };
};

// Test route
router.get("/test", (req, res) => {
  res.json({ 
    success: true, 
    message: "API is working!",
    timestamp: new Date().toISOString()
  });
});

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

// POST create new product with multiple images
router.post("/upload-product", (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Upload error:", err);
      return res.status(400).json({
        success: false,
        message: err.message || "Error uploading files",
      });
    }

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

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one product image is required",
        });
      }

      if (req.files.length > 5) {
        // Clean up uploaded files
        req.files.forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
        return res.status(400).json({
          success: false,
          message: "Maximum 5 images allowed",
        });
      }

      // Verify business exists
      const business = await Business.findById(businessId);
      if (!business) {
        // Clean up uploaded files
        req.files.forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
        return res.status(404).json({
          success: false,
          message: "Business not found",
        });
      }

      // Check all images - FAIL if ANY image fails
      const failedImages = [];
      const validImagePaths = [];

      for (const file of req.files) {
        const result = await checkImage(file.path);
        if (result.passed) {
          validImagePaths.push(file.path);
        } else {
          failedImages.push({ filename: file.originalname, error: result.message });
        }
      }

      // If ANY image fails, reject the entire upload
      if (failedImages.length > 0) {
        // Clean up any valid images that were uploaded
        validImagePaths.forEach(path => {
          if (fs.existsSync(path)) {
            fs.unlinkSync(path);
          }
        });
        
        return res.status(400).json({
          success: false,
          message: `Upload failed: ${failedImages.length} image(s) failed validation`,
          errors: failedImages,
        });
      }

      // Save product with multiple images
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
        images: validImagePaths,
        image: validImagePaths[0],
      });

      return res.status(201).json({
        success: true,
        message: "Product uploaded successfully",
        product,
      });
    } catch (error) {
      console.error(error);
      
      // Clean up uploaded files if they exist
      if (req.files) {
        req.files.forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      }
      
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });
});

// PUT update product with multiple images
router.put("/update-product/:id", (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Upload error:", err);
      return res.status(400).json({
        success: false,
        message: err.message || "Error uploading files",
      });
    }

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
        existingImages,
      } = req.body;

      // Find existing product
      const existingProduct = await Product.findById(id);
      if (!existingProduct) {
        if (req.files) {
          req.files.forEach(file => {
            if (fs.existsSync(file.path)) {
              fs.unlinkSync(file.path);
            }
          });
        }
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      // Check new images if any - FAIL if ANY fails
      let failedImages = [];
      let validNewImages = [];

      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const result = await checkImage(file.path);
          if (result.passed) {
            validNewImages.push(file.path);
          } else {
            failedImages.push({ filename: file.originalname, error: result.message });
          }
        }

        // If ANY new image fails, reject the entire update
        if (failedImages.length > 0) {
          // Clean up valid new images
          validNewImages.forEach(path => {
            if (fs.existsSync(path)) {
              fs.unlinkSync(path);
            }
          });
          
          return res.status(400).json({
            success: false,
            message: `Update failed: ${failedImages.length} image(s) failed validation`,
            errors: failedImages,
          });
        }
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

      // Handle images update
      let newImages = [];
      
      if (existingImages) {
        const keepImages = existingImages.split(',');
        newImages = keepImages.filter(img => img && img.trim());
      } else if (existingProduct.images) {
        newImages = [...existingProduct.images];
      }

      // Add valid new images
      newImages = [...newImages, ...validNewImages];
      
      // Limit to max 5 images
      if (newImages.length > 5) {
        const removedImages = newImages.splice(5);
        removedImages.forEach(img => {
          if (fs.existsSync(img)) {
            fs.unlinkSync(img);
          }
        });
      }

      // Delete old images that are not kept
      const oldImages = existingProduct.images || [];
      const imagesToDelete = oldImages.filter(img => !newImages.includes(img));
      
      imagesToDelete.forEach(img => {
        if (fs.existsSync(img)) {
          fs.unlinkSync(img);
        }
      });

      updateData.images = newImages;
      updateData.image = newImages[0] || existingProduct.image;

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
      
      if (req.files) {
        req.files.forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      }
      
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });
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
    
    if (product.images && product.images.length > 0) {
      product.images.forEach(image => {
        if (fs.existsSync(image)) {
          fs.unlinkSync(image);
        }
      });
    } else if (product.image && fs.existsSync(product.image)) {
      fs.unlinkSync(product.image);
    }
    
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

// GET all products with business details
router.get("/products-with-business", async (req, res) => {
  try {
    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .lean();

    if (!products || products.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        products: [],
        message: "No products found"
      });
    }

    const businessIds = [...new Set(products.map(p => p.businessId).filter(Boolean))];
    
    const businesses = await Business.find(
      { _id: { $in: businessIds } },
      { _id: 1, companyName: 1, ownerName: 1 }
    ).lean();

    const businessMap = new Map();
    businesses.forEach(business => {
      businessMap.set(business._id.toString(), {
        businessName: business.companyName,
        ownerName: business.ownerName
      });
    });

    const productsWithBusiness = products.map(product => ({
      ...product,
      businessDetails: businessMap.get(product.businessId?.toString()) || {
        businessName: 'Unknown Business',
        ownerName: 'Unknown Owner'
      }
    }));

    return res.status(200).json({
      success: true,
      count: productsWithBusiness.length,
      products: productsWithBusiness
    });
  } catch (error) {
    console.error("Error in /products-with-business:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;