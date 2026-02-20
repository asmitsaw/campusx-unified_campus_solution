import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { protect, authorize } from "../middleware/authmiddleware.js";
import { uploadNote, getNotes, downloadNote, deleteNote } from "../controllers/notesController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for local PDF storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, "..", "uploads", "notes");
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e6)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(new Error("Only PDF files are allowed"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB max
});

const router = express.Router();

// Faculty/Admin: upload, list, delete notes
router.post("/upload", protect, authorize("faculty", "admin"), upload.single("file"), uploadNote);
router.get("/", protect, authorize("faculty", "admin", "student"), getNotes);
router.delete("/:id", protect, authorize("faculty", "admin"), deleteNote);

// Any authenticated user can download
router.get("/download/:filename", protect, downloadNote);

export default router;
