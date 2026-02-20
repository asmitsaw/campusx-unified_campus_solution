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
  res.send("🚀 API Running with Supabase");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});