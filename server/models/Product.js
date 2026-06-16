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
  images: [String], // Array of image paths
  mainImage: String, // Primary image path
}, {
  timestamps: true,
});

export default mongoose.model("Product", productSchema);