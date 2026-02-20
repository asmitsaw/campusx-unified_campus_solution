
import express from "express";
import {
  markAttendance,
  getStudentAttendance
} from "../controllers/attendancecontroller.js";
import { protect, authorize } from "../middleware/authmiddleware.js";

const router = express.Router();

// 👨‍🏫 Faculty/Admin marks attendance
router.post("/mark", protect, authorize("faculty", "admin"), markAttendance);

// 👨‍🎓 Student views attendance
router.get("/student", protect, getStudentAttendance);

export default router;