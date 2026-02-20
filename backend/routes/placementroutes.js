import express from "express";
import { applyPlacement } from "../controllers/placementcontroller.js";
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/apply", protect, applyPlacement);

export default router;