// models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  category: String,
  description: String,
  size: String,
  colors: String,
  price: String,
  method: String,
  availableQuantity: Number,
  images: [String],
  mainImage: String,
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },
  
  // Rating fields
  ratings: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    review: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
    },
  }],
  
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  
  totalRatings: {
    type: Number,
    default: 0,
  },

}, {
  timestamps: true,
});

// Index for search
productSchema.index({ name: 'text', description: 'text', category: 'text' });

export default mongoose.model("Product", productSchema);