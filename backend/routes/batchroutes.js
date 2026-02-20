import express from "express";
import { protect, authorize } from "../middleware/authmiddleware.js";
import { createBatch, getBatches, getBatchStudents, deleteBatch } from "../controllers/batchcontroller.js";

const router = express.Router();

// Admin only: create & delete batches
router.post("/", protect, authorize("admin"), createBatch);
router.delete("/:id", protect, authorize("admin"), deleteBatch);

// Admin + Faculty: view batches and students
router.get("/", protect, authorize("admin", "faculty"), getBatches);
router.get("/:id/students", protect, authorize("admin", "faculty"), getBatchStudents);

export default router;
