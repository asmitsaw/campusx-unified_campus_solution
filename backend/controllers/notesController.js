import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NOTES_DIR = path.join(__dirname, "..", "uploads", "notes");

// Ensure directory exists
if (!fs.existsSync(NOTES_DIR)) {
    fs.mkdirSync(NOTES_DIR, { recursive: true });
}

// ── Upload a note (PDF) ─────────────────────────────────────────────────────
export const uploadNote = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const { subject, description } = req.body;
        const facultyId = req.user.id;
        const facultyName = req.user.name || "Faculty Member";
        const facultyEmail = req.user.email || "unknown";

        // Build metadata
        const meta = {
            id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
            originalName: req.file.originalname,
            filename: req.file.filename,
            subject: subject || "General",
            description: description || "",
            facultyId,
            facultyName,
            facultyEmail,
            size: req.file.size,
            uploadedAt: new Date().toISOString(),
        };

        // Save metadata alongside file
        const metaPath = path.join(NOTES_DIR, "notes_meta.json");
        let allMeta = [];
        if (fs.existsSync(metaPath)) {
            try {
                allMeta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
            } catch { allMeta = []; }
        }
        allMeta.push(meta);
        fs.writeFileSync(metaPath, JSON.stringify(allMeta, null, 2));

        res.status(201).json({ success: true, data: meta });
    } catch (err) {
        console.error("[Notes Upload]", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ── List all notes (optionally filter by faculty) ────────────────────────────
export const getNotes = async (req, res) => {
    try {
        const metaPath = path.join(NOTES_DIR, "notes_meta.json");
        if (!fs.existsSync(metaPath)) {
            return res.json({ success: true, data: [] });
        }

        let allMeta = [];
        try {
            allMeta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
        } catch { allMeta = []; }

        // Faculty sees only their own; admin/student sees all
        const role = req.user.role;
        const userId = req.user.id;
        if (role === "faculty") {
            allMeta = allMeta.filter(n => n.facultyId === userId);
        }

        // Sort newest first
        allMeta.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

        res.json({ success: true, data: allMeta });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ── Download a note ──────────────────────────────────────────────────────────
export const downloadNote = async (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(NOTES_DIR, filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ success: false, message: "File not found" });
        }

        // Get original name from meta
        const metaPath = path.join(NOTES_DIR, "notes_meta.json");
        let originalName = filename;
        if (fs.existsSync(metaPath)) {
            try {
                const allMeta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
                const note = allMeta.find(n => n.filename === filename);
                if (note) originalName = note.originalName;
            } catch { }
        }

        res.setHeader("Content-Disposition", `inline; filename="${originalName}"`);
        res.setHeader("Content-Type", "application/pdf");
        fs.createReadStream(filePath).pipe(res);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ── Delete a note ────────────────────────────────────────────────────────────
export const deleteNote = async (req, res) => {
    try {
        const { id } = req.params;
        const metaPath = path.join(NOTES_DIR, "notes_meta.json");

        if (!fs.existsSync(metaPath)) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }

        let allMeta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
        const note = allMeta.find(n => n.id === id);

        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }

        // Only allow owner or admin to delete
        if (req.user.role !== "admin" && note.facultyId !== req.user.id) {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        // Delete file
        const filePath = path.join(NOTES_DIR, note.filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Remove from metadata
        allMeta = allMeta.filter(n => n.id !== id);
        fs.writeFileSync(metaPath, JSON.stringify(allMeta, null, 2));

        res.json({ success: true, message: "Note deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
