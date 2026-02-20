import express from "express";
import { getDashboard } from "../controllers/dashboardcontroller.js";
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/", protect, getDashboard);

export default router;