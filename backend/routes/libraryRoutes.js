import express from "express";
import { searchBooks, issueBook, getIssuedBooks } from "../controllers/libraryController.js";
import { protect } from "../middleware/authmiddleware.js"; // Optional: protect certain routes

const router = express.Router();

// Public search (or protected based on requirements)
router.get("/search", searchBooks);

// Issue book - ideally protected
// For prototyping, we'll keep it open but expect user_id in body
router.post("/issue", issueBook);

// Get my books
router.get("/my-books", getIssuedBooks);

export default router;
