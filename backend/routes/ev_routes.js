import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { protect } from "../middleware/authmiddleware.js";
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getEventManagerStats,
  getEventManagerSchedule,
  getEventManagerActivity,
  getEventRegistrations,
} from "../controllers/ev_controller.js";

const router = express.Router();

// ── Multer setup: store banners in backend/uploads/events/ ────────────────────
const uploadDir = path.join("uploads", "events");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename:    (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files allowed"));
  },
});

// ── Routes ────────────────────────────────────────────────────────────────────
router.get("/",           getAllEvents);
router.get("/stats",      getEventManagerStats);
router.get("/schedule",   getEventManagerSchedule);
router.get("/activity",   getEventManagerActivity);
router.get("/:id",        getEventById);
router.get("/:id/registrations", getEventRegistrations);
router.post("/",          upload.single("banner"), createEvent);
router.put("/:id",        upload.single("banner"), updateEvent);
router.delete("/:id",     deleteEvent);
router.post("/:id/register", protect, registerForEvent);

export default router;
