import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authroutes.js";
import dashboardRoutes from "./routes/dashboardroutes.js";
import eventRoutes from "./routes/eventroutes.js";
import placementRoutes from "./routes/placementroutes.js";


import libraryRoutes from "./routes/libraryRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/placements", placementRoutes);
app.use("/api/library", libraryRoutes);


app.get("/", (req, res) => {
  res.json({ message: "🚀 API Running with Supabase" });
});

// 404 — always return JSON, never HTML
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global error handler — always return JSON, never HTML
app.use((err, req, res, next) => {
  console.error("❌ Unhandled error:", err);
  res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
