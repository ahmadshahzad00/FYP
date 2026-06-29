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

const upload = multer({ 
  storage,
  limits: { files: 5 }
});

// Helper function to generate 6 character alphanumeric code
const generateProductCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

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
  } catch (err) {}

  if (hasExif) {
    fs.unlinkSync(filePath);
    return { passed: false, message: "Image rejected. EXIF metadata detected." };
  }

  // AI check
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
    } catch (aiError) {}
  }

  return { passed: true, message: "Image passed" };
};

// ==================== PUBLIC ROUTES ====================

// GET all products for public
router.get("/public-products", async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice } = req.query;
    
    let query = {};
    
    const anyProduct = await Product.findOne({ status: { $exists: true } });
    if (anyProduct) {
      query.status = "Active";
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { productCode: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (category) {
      query.category = category;
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = minPrice;
      if (maxPrice) query.price.$lte = maxPrice;
    }
    
    const products = await Product.find(query)
      .populate('businessId', 'companyName ownerName logo category status email phone whatsapp facebook instagram website')
      .sort({ createdAt: -1 });
    
    const formattedProducts = products.map(product => {
      const productObj = product.toObject();
      return {
        ...productObj,
        businessDetails: product.businessId || null,
        businessName: product.businessId?.companyName || 'Unknown Business',
        ownerName: product.businessId?.ownerName || 'Unknown Owner',
        averageRating: product.averageRating || 0,
        totalRatings: product.totalRatings || 0,
        images: product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []),
      };
    });
    
    res.status(200).json({
      success: true,
      count: formattedProducts.length,
      products: formattedProducts,
    });
  } catch (error) {
    console.error("Error in public-products:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET product by ID with full details
router.get("/public-product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('businessId', 'companyName ownerName logo category status email phone whatsapp facebook instagram website')
      .populate('ratings.userId', 'name email');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    
    res.status(200).json({
      success: true,
      product: {
        ...product.toObject(),
        businessDetails: product.businessId,
        averageRating: product.averageRating || 0,
        totalRatings: product.totalRatings || 0,
        images: product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []),
      },
    });
  } catch (error) {
    console.error("Error in public-product:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET product by product code
router.get("/product-by-code/:productCode", async (req, res) => {
  try {
    const { productCode } = req.params;
    const product = await Product.findOne({ productCode })
      .populate('businessId', 'companyName ownerName logo category status email phone whatsapp facebook instagram website')
      .populate('ratings.userId', 'name email');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found with this code",
      });
    }
    
    res.status(200).json({
      success: true,
      product: {
        ...product.toObject(),
        businessDetails: product.businessId,
        averageRating: product.averageRating || 0,
        totalRatings: product.totalRatings || 0,
        images: product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []),
      },
    });
  } catch (error) {
    console.error("Error in product-by-code:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Add/Update rating for a product
router.post("/rate-product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, rating, review } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }
    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    
    const existingRatingIndex = product.ratings?.findIndex(
      r => r.userId && r.userId.toString() === userId
    ) ?? -1;
    
    if (existingRatingIndex !== -1) {
      product.ratings[existingRatingIndex].rating = rating;
      product.ratings[existingRatingIndex].review = review || product.ratings[existingRatingIndex].review;
      product.ratings[existingRatingIndex].updatedAt = new Date();
    } else {
      if (!product.ratings) product.ratings = [];
      product.ratings.push({
        userId,
        rating,
        review: review || "",
        createdAt: new Date(),
      });
    }
    
    const totalRatings = product.ratings?.length || 0;
    const sumRatings = product.ratings?.reduce((sum, r) => sum + r.rating, 0) || 0;
    product.averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;
    product.totalRatings = totalRatings;
    
    await product.save();
    
    const updatedProduct = await Product.findById(id)
      .populate('ratings.userId', 'name email');
    
    res.status(200).json({
      success: true,
      message: "Rating submitted successfully",
      product: updatedProduct,
      averageRating: product.averageRating,
      totalRatings: product.totalRatings,
    });
  } catch (error) {
    console.error("Error in rate-product:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get product ratings
router.get("/product-ratings/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('ratings.userId', 'name email');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    
    res.status(200).json({
      success: true,
      averageRating: product.averageRating || 0,
      totalRatings: product.totalRatings || 0,
      ratings: product.ratings || [],
      productCode: product.productCode,
    });
  } catch (error) {
    console.error("Error in product-ratings:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==================== AUTHENTICATED ROUTES ====================

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
    console.error("Error in products by business:", error);
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
    console.error("Error in product by ID:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET all products with business details (for admin)
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
    console.error("Error in products-with-business:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==================== UPLOAD PRODUCT ====================

// POST create new product with multiple images
router.post("/upload-product", async (req, res) => {
  upload.array("images", 5)(req, res, async function(err) {
    if (err) {
      console.error("Multer error:", err);
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

      // Check all images
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

      if (failedImages.length > 0) {
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

      // Create product - model will auto-generate productCode
      const productData = {
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
        status: "Active",
        ratings: [],
        averageRating: 0,
        totalRatings: 0,
      };

      // Generate product code manually as fallback
      let productCode = generateProductCode();
      let codeExists = await Product.findOne({ productCode });
      
      while (codeExists) {
        productCode = generateProductCode();
        codeExists = await Product.findOne({ productCode });
      }
      
      productData.productCode = productCode;

      const product = new Product(productData);
      await product.save();

      return res.status(201).json({
        success: true,
        message: "Product uploaded successfully",
        product,
        productCode: product.productCode,
      });
    } catch (error) {
      console.error("Error creating product:", error);
      
      // Clean up uploaded files
      if (req.files) {
        req.files.forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      }
      
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  });
});

// PUT update product with multiple images
router.put("/update-product/:id", async (req, res) => {
  upload.array("images", 5)(req, res, async function(err) {
    if (err) {
      console.error("Multer error:", err);
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

        if (failedImages.length > 0) {
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

      let newImages = [];
      
      if (existingImages) {
        const keepImages = existingImages.split(',');
        newImages = keepImages.filter(img => img && img.trim());
      } else if (existingProduct.images) {
        newImages = [...existingProduct.images];
      }

      newImages = [...newImages, ...validNewImages];
      
      if (newImages.length > 5) {
        const removedImages = newImages.splice(5);
        removedImages.forEach(img => {
          if (fs.existsSync(img)) {
            fs.unlinkSync(img);
          }
        });
      }

      const oldImages = existingProduct.images || [];
      const imagesToDelete = oldImages.filter(img => !newImages.includes(img));
      
      imagesToDelete.forEach(img => {
        if (fs.existsSync(img)) {
          fs.unlinkSync(img);
        }
      });

      updateData.images = newImages;

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
      console.error("Error updating product:", error);
      
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
    }
    
    await Product.findByIdAndDelete(id);
    
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;