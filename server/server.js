import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authAdmin from "./routes/authAdmin.js";
import authUser from "./routes/authUser.js";
import path from "path";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

//  ROUTES
app.use("/api/admin", authAdmin);
app.use("/api/auth", authUser); // ✅ IMPORTANT for OTP system

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});