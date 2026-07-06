import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    // Product Information
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productCode: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },

    // Business Information
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    businessOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Customer Information
    customerName: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      required: true,
    },
    customerPhone: {
      type: String,
      required: true,
    },

    // Complaint Details
    subject: {
      type: String,
      required: true,
    },
    complaintType: {
      type: String,
      enum: [
        "quality_issue",
        "delivery_delay",
        "wrong_product",
        "damaged_product",
        "quantity_mismatch",
        "price_issue",
        "customer_service",
        "payment_issue",
        "other",
      ],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },

    // Attachments
    attachments: [
      {
        name: String,
        url: String,
        size: Number,
      },
    ],

    // Status Tracking
    status: {
      type: String,
      enum: ["pending", "in_review", "in_progress", "resolved", "closed"],
      default: "pending",
    },
    resolution: {
      type: String,
      default: "",
    },
    resolvedAt: {
      type: Date,
    },

    // Responses/Conversation
    responses: [
      {
        message: {
          type: String,
          required: true,
        },
        sender: {
          type: String,
          enum: ["customer", "business_owner", "admin"],
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

    // Metadata
    ipAddress: String,
    userAgent: String,
  },
  { timestamps: true }
);

// Indexes for better performance
complaintSchema.index({ product: 1, status: 1 });
complaintSchema.index({ business: 1, status: 1 });
complaintSchema.index({ businessOwner: 1, status: 1 });
complaintSchema.index({ productCode: 1 });
complaintSchema.index({ status: 1, createdAt: -1 });

// Methods
complaintSchema.methods.addResponse = async function (message, sender, senderId) {
  this.responses.push({
    message,
    sender,
    senderId,
    createdAt: new Date(),
  });
  return this.save();
};

complaintSchema.methods.resolve = async function (resolution) {
  this.status = "resolved";
  this.resolution = resolution;
  this.resolvedAt = new Date();
  return this.save();
};

export default mongoose.model("Complaint", complaintSchema);