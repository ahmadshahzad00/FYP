import mongoose from "mongoose";

const adminUserSchema = new mongoose.Schema(
  {
    firstname: { 
      type: String, 
      required: true 
    },

    lastname: { 
      type: String, 
      required: true 
    },

    phone: {
      type: String, 
      required: true 
    },

    email: { 
      type: String, 
      required: true, 
      unique: true 
    },

    password: { 
      type: String, 
      required: true 
    },

    role: {
      type: String,
      enum: [
        "super_admin",
        "business_handler",
        "product_manager",
        "inquiry_manager",
        "contact_messages_handler"
      ],
      default: "business_handler"
    }
  },
  { timestamps: true }
);

export default mongoose.model("AdminUser", adminUserSchema);