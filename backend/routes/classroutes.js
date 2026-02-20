import express from "express";
import { protect, authorize } from "../middleware/authmiddleware.js";
import { createClass, getClasses, deleteClass } from "../controllers/classcontroller.js";

const router = express.Router();

router.post("/", protect, authorize("admin", "faculty"), createClass);
router.get("/", protect, authorize("admin", "faculty"), getClasses);
router.delete("/:id", protect, authorize("admin", "faculty"), deleteClass);

export default router;
