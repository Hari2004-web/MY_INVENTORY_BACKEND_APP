const express = require("express");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");
const { sendMessage, getMyMessages } = require("../controllers/messageController");

const router = express.Router();

// All message routes require the user to be logged in
router.use(authenticateToken);

// Admins can send messages
router.post("/", authorizeRoles("admin"), sendMessage);

// Any logged-in user can get their own messages
router.get("/", getMyMessages);

module.exports = router;