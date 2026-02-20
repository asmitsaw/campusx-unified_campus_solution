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
import hostelRoutes from "./routes/hostelroutes.js";
import notificationRoutes from "./routes/notificationroutes.js";
import evRoutes from "./routes/ev_routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
// Serve locally-stored event banners as static files
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/placements", placementRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/hostel", hostelRoutes);

app.use("/api/attendance", attendanceRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/ev-events", evRoutes);

app.get("/", (req, res) => {
  res.send("🚀 API Running with Supabase - EV1 VERSION");
});

const PORT = 5000; // Port 5055 to bypass all ghost processes

const server = app.listen(PORT, () => {
  console.log(`🔥 EVENT SYSTEM (v3) ON PORT ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`❌ Port ${PORT} already in use. Try another one.`);
  } else {
    console.log(`❌ Server error:`, err);
  }
});
