import express from "express";
import {
  searchBooks,
  requestBook,
  getPendingRequests,
  updateRequestStatus,
  issueBook,
  getIssuedBooks,
  getMyRequests,
  sendMessage,
  getMessages,
  getChatUsers,
} from "../controllers/lib_controller.js";

const router = express.Router();

// Book search
router.get("/search", searchBooks);

// Student: request a book
router.post("/request", requestBook);

// Student: view own requests
router.get("/my-requests", getMyRequests);

// Librarian: view all requests
router.get("/requests", getPendingRequests);

// Librarian: approve or reject a request
router.patch("/requests/:id/status", updateRequestStatus);

// Librarian: directly issue a book
router.post("/issue", issueBook);

// Get issued books (all or filtered by user_id for student)
router.get("/my-books", getIssuedBooks);

// Chat system
router.post("/messages", sendMessage);
router.get("/messages", getMessages);
router.get("/chat-users", getChatUsers);

export default router;
