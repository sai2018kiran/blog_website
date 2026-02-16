import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import blogRoutes from './routes/blogRoutes.js';
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === "production";

const app = express();

// ✅ Enable CORS for frontend (allow Render frontends if FRONTEND_URL not set)
const FRONTEND_URL = (process.env.FRONTEND_URL || "http://localhost:5173").trim();
const corsOptions = {
  origin: (origin, callback) => {
    const fromRender = origin && origin.endsWith(".onrender.com");
    const allowed = origin === FRONTEND_URL || (process.env.NODE_ENV === "production" && fromRender);
    if (allowed) {
      callback(null, origin); // use request origin in Access-Control-Allow-Origin
    } else if (!origin) {
      callback(null, true);   // allow same-origin or tools that don't send Origin
    } else {
      callback(null, false);
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

// API Routes (must be before static files so /api/* is not served as static)
import userRoutes from "./routes/userRoutes.js";
app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);

// Serve React app only when frontend/dist exists (single-URL deploy). Else API-only (separate deploy).
const distPath = path.join(__dirname, "..", "frontend", "dist");
const hasFrontendBuild = isProduction && fs.existsSync(distPath);
if (hasFrontendBuild) {
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.json({ message: "Blog API is running", docs: "/api/users, /api/blogs" });
  });
}

// MongoDB connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = (process.env.MONGO_URI || "").trim();
if (!MONGO_URI || (!MONGO_URI.startsWith("mongodb://") && !MONGO_URI.startsWith("mongodb+srv://"))) {
  console.error("MONGO_URI is missing or invalid. Set MONGO_URI in Render Environment to a valid MongoDB connection string (e.g. mongodb+srv://user:pass@cluster.xxx.mongodb.net/dbname).");
  process.exit(1);
}
mongoose
  .connect(MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch((err) => console.error(err));
