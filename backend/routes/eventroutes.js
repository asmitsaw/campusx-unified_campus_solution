import express from "express";
import { registerEvent } from "../controllers/eventcontroller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", protect, registerEvent);

export default router;