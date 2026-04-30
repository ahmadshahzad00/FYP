import mongoose from "mongoose";

const businessSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    companyName: { type: String, required: true },
    ownerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    whatsapp: { type: String, required: true },
    yearEstablished: { type: Number, required: true },
    factoryAddress: { type: String, required: true },
    ntnNumber: { type: String, required: true },

    category: { type: String, required: true },
    products: { type: String, required: true },

    website: String,
    description: String,

    facebook: String,
    instagram: String,
    twitter: String,
    tiktok: String,
    pinterest: String,

    // FILES
    chamberMembership: {
      type: String,
      required: true,
    },

    cnicFront: {
      type: String,
      required: true,
    },

    cnicBack: {
      type: String,
      required: true,
    },

    logo: String,

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Business", businessSchema);