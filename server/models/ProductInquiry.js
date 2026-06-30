import mongoose from "mongoose";

const productInquirySchema = new mongoose.Schema({
  // Product Information
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  productName: {
    type: String,
    required: true,
    trim: true,
  },
  productPrice: {
    type: Number,
  },

  // Business Information
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: true,
  },
  businessOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  businessName: {
    type: String,
    required: true,
  },

  // Customer Information
  customerName: {
    type: String,
    required: true,
    trim: true,
  },
  customerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  customerPhone: {
    type: String,
    required: true,
    trim: true,
  },
  customerCountry: {
    type: String,
    trim: true,
  },
  customerCity: {
    type: String,
    trim: true,
  },

  // Inquiry Details
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  inquiryType: {
    type: String,
    enum: ["general", "price", "bulk_order", "customization", "shipping", "availability", "warranty", "specification", "sample", "other"],
    default: "general",
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
  preferredDeliveryDate: {
    type: Date,
  },

  // Status Tracking
  status: {
    type: String,
    enum: ["pending", "read", "replied", "resolved"],
    default: "pending",
  },
  
  // Responses
  responses: [
    {
      message: {
        type: String,
        required: true,
      },
      sender: {
        type: String,
        enum: ["business_owner", "customer"],
        required: true,
      },
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  // Timestamps - Only these two fields are needed
  readAt: {
    type: Date,
  },
  firstResponseAt: {
    type: Date,
  },
  resolvedAt: {
    type: Date,
  },
  
}, {
  // Mongoose will automatically handle createdAt and updatedAt
  timestamps: true
});

// ============================================
// INDEXES FOR BETTER PERFORMANCE
// ============================================
productInquirySchema.index({ business: 1, status: 1 });
productInquirySchema.index({ businessOwner: 1, status: 1 });
productInquirySchema.index({ product: 1, createdAt: -1 });
productInquirySchema.index({ status: 1, createdAt: -1 });

// ============================================
// METHODS (No next function anywhere)
// ============================================

// Mark as read
productInquirySchema.methods.markAsRead = async function() {
  if (this.status === "pending") {
    this.status = "read";
    this.readAt = new Date();
  }
  return this.save();
};

// Add response
productInquirySchema.methods.addResponse = async function(message, sender, senderId) {
  this.responses.push({
    message,
    sender,
    senderId,
    createdAt: new Date(),
  });
  
  if (this.status === "pending" || this.status === "read") {
    this.status = "replied";
    if (!this.firstResponseAt) {
      this.firstResponseAt = new Date();
    }
  }
  
  return this.save();
};

// Resolve inquiry
productInquirySchema.methods.resolve = async function() {
  this.status = "resolved";
  this.resolvedAt = new Date();
  return this.save();
};

// ============================================
// VIRTUAL FIELDS
// ============================================
productInquirySchema.virtual("responseTime").get(function() {
  if (this.firstResponseAt && this.createdAt) {
    const diff = this.firstResponseAt - this.createdAt;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return { hours, minutes };
  }
  return null;
});

productInquirySchema.virtual("isUrgent").get(function() {
  return this.priority === "high" || this.priority === "urgent";
});

// ============================================
// TO JSON CONFIG (to include virtuals)
// ============================================
productInquirySchema.set("toJSON", { virtuals: true });
productInquirySchema.set("toObject", { virtuals: true });

const ProductInquiry = mongoose.model("ProductInquiry", productInquirySchema);

export default ProductInquiry;