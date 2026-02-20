import express from "express";
import {
  uploadMaterial,
  getMaterials
} from "../controllers/materialController.js";
import { protect, authorize } from "../middleware/authmiddleware.js";

const router = express.Router();

// 👨‍🏫 Only faculty/admin can upload
router.post("/upload", protect, authorize("faculty", "admin"), uploadMaterial);

// 👨‍🎓 Students can view
router.get("/", protect, getMaterials);

export default router;