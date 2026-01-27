import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authAdmin from "./routes/authAdmin.js";


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/admin", authAdmin);

connectDB();


app.listen(5000, () => {
    console.log("Server started on port 5000");
});
