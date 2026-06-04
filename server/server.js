import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authAdmin from "./routes/authAdmin.js";
import authUser from "./routes/authUser.js";
import registerBusinessRoute from "./routes/registerBusiness.js";
import fileCheckRoutes from "./routes/fileCheck.js";
import uploadProduct from "./routes/uploadProduct.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));


// ROUTE 
app.use("/api/admin", authAdmin);
app.use("/api/auth", authUser);
app.use("/api/business", registerBusinessRoute);
app.use("/api/file", fileCheckRoutes);
app.use("/api/product", uploadProduct);

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});