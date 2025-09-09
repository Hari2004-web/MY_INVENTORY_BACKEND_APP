const express = require("express");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");
// FIX: Add 'markMessageAsRead' to the import list
const { sendMessage, getMyMessages, markMessageAsRead } = require("../controllers/messageController");

const router = express.Router();

// All message routes require the user to be logged in
router.use(authenticateToken);

// An admin can send a message
router.post("/", authorizeRoles("admin"), sendMessage);

// Any logged-in user can get their own messages
router.get("/", getMyMessages);

// A user can mark one of their messages as read
router.put("/:id/read", markMessageAsRead);

module.exports = router;