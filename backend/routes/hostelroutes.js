import express from "express";
import { protect, authorize } from "../middleware/authmiddleware.js";
import {
    searchStudents,
    getRooms, getMyRoom, createRoom, updateRoom, deleteRoom,
    getComplaints, createComplaint, updateComplaintStatus,
    getMessMenu, updateMessMenu,
} from "../controllers/hostelcontroller.js";

const router = express.Router();

// Student search — warden/admin only (for allocation)
router.get("/search-students", protect, authorize("hostel_warden", "admin"), searchStudents);

// Rooms — warden/admin only
router.get("/rooms", protect, authorize("hostel_warden", "admin"), getRooms);
router.post("/rooms", protect, authorize("hostel_warden", "admin"), createRoom);
router.put("/rooms/:id", protect, authorize("hostel_warden", "admin"), updateRoom);
router.delete("/rooms/:id", protect, authorize("hostel_warden", "admin"), deleteRoom);

// Student room lookup
router.get("/my-room", protect, getMyRoom);

// Complaints — all authenticated users can read, students create, warden updates
router.get("/complaints", protect, getComplaints);
router.post("/complaints", protect, authorize("student"), createComplaint);
router.put("/complaints/:id", protect, authorize("hostel_warden", "admin"), updateComplaintStatus);

// Mess menu — anyone reads, warden/admin updates
router.get("/mess", protect, getMessMenu);
router.put("/mess", protect, authorize("hostel_warden", "admin"), updateMessMenu);

export default router;
