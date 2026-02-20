import express from "express";
import { protect, authorize } from "../middleware/authmiddleware.js";
import {
    createDrive,
    updateDrive,
    deleteDrive,
    getAllDrives,
    getDrive,
    applyPlacement,
    getMyApplications,
    getDriveApplicants,
    updateApplicationStatus,
    createTrainingSession,
    getTrainingSessions,
    getStats,
    getRecentActivity,
} from "../controllers/placementcontroller.js";

const router = express.Router();

// ── Public/Student ──────────────────────────
router.get("/drives", protect, getAllDrives);
router.get("/drives/:id", protect, getDrive);
router.post("/apply", protect, applyPlacement);
router.get("/my-applications", protect, getMyApplications);
router.get("/training-sessions", protect, getTrainingSessions);
router.get("/stats", protect, getStats);
router.get("/recent-activity", protect, authorize("tpo", "admin"), getRecentActivity);

// ── TPO only ────────────────────────────────
router.post("/drives", protect, authorize("tpo", "admin"), createDrive);
router.put("/drives/:id", protect, authorize("tpo", "admin"), updateDrive);
router.delete("/drives/:id", protect, authorize("tpo", "admin"), deleteDrive);
router.get("/drives/:id/applicants", protect, authorize("tpo", "admin"), getDriveApplicants);
router.put("/applications/:applicationId/status", protect, authorize("tpo", "admin"), updateApplicationStatus);
router.post("/training-sessions", protect, authorize("tpo", "admin"), createTrainingSession);

export default router;