const express = require("express");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");
const { sendMessage, getMyMessages } = require("../controllers/messageController");

const router = express.Router();

router.use(authenticateToken);

// An admin can send a message
router.post("/", authorizeRoles("admin"), sendMessage);

// Any logged-in user can get their own messages
router.get("/", getMyMessages);

module.exports = router;