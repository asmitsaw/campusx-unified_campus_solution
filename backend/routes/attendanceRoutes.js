import express from "express";
import {
  getScheduleByDate,
  getScheduleMonth,
  getStudents,
  getAttendanceRecords,
  getRecentAttendance,
  markAttendance,
  getMyAttendance,
  getStudentAttendance,
} from "../controllers/attendancecontroller.js";
import { protect, authorize } from "../middleware/authmiddleware.js";

const router = express.Router();

// 📅 Faculty: schedule endpoints
router.get("/schedule", protect, authorize("faculty", "admin"), getScheduleByDate);
router.get("/schedule/month", protect, authorize("faculty", "admin"), getScheduleMonth);

// 👨‍🎓 Faculty: student list
router.get("/students", protect, authorize("faculty", "admin"), getStudents);

// 📋 Faculty: attendance records for a session
router.get("/records/:scheduleId", protect, authorize("faculty", "admin"), getAttendanceRecords);

// 🕐 Faculty: recent attendance activity
router.get("/recent", protect, authorize("faculty", "admin"), getRecentAttendance);

// ✅ Faculty/Admin marks attendance
router.post("/mark", protect, authorize("faculty", "admin"), markAttendance);

// 📊 Student: own full attendance detail (new — matches by email)
router.get("/my", protect, getMyAttendance);

// 📊 Student: legacy summary (backward compat)
router.get("/student", protect, getStudentAttendance);

export default router;