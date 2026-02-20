import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authroutes.js";
import dashboardRoutes from "./routes/dashboardroutes.js";
import eventRoutes from "./routes/eventroutes.js";
import placementRoutes from "./routes/placementroutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import materialRoutes from "./routes/materialRoutes.js"

import libraryRoutes from "./routes/lib_routes.js";
import batchRoutes from "./routes/batchroutes.js";
import classRoutes from "./routes/classroutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/placements", placementRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/classes", classRoutes);

app.use("/api/attendance", attendanceRoutes);
app.use("/api/materials", materialRoutes);

app.get("/", (req, res) => { 
  res.send("🚀 API Running with Supabase");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});