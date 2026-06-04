import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    size: {
      type: String,
      default: "",
    },

    colors: {
      type: String,
      default: "",
    },

    price: {
      type: String,
      default: "",
    },

    method: {
      type: String,
      enum: ["Hand Made", "Machine Made"],
      default: "",
    },

    availableQuantity: {
      type: Number,
      default: 0,
    },

    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);