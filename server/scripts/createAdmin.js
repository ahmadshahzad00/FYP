import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import AdminUser from "../models/AdminUser.js";
import dotenv from "dotenv";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/sialkot_export_mella");
    
    const adminData = {
      firstname: "Super",
      lastname: "Admin",
      phone: "1234567890",
      email: "admin@example.com",
      password: await bcrypt.hash("admin123", 10),
      role: "super_admin",
      isActive: true
    };
    
    // Check if admin already exists
    const existingAdmin = await AdminUser.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log("Admin already exists with email:", adminData.email);
      console.log("Email:", adminData.email);
      console.log("Password: admin123");
      process.exit(0);
    }
    
    const admin = new AdminUser(adminData);
    await admin.save();
    
    console.log("✅ Admin created successfully!");
    console.log("📧 Email:", adminData.email);
    console.log("🔑 Password: admin123");
    console.log("👤 Role:", adminData.role);
    
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();