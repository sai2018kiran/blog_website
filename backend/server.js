import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import blogRoutes from './routes/blogRoutes.js';
dotenv.config();

const app = express();

// ✅ Enable CORS for frontend
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(cors({ origin: FRONTEND_URL, credentials: true }));

app.use(express.json());

// Routes
import userRoutes from "./routes/userRoutes.js";
app.use("/api/users", userRoutes);
app.use('/api/blogs', blogRoutes);

// MongoDB connection
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch((err) => console.error(err));
