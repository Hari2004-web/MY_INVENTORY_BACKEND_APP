const express = require("express");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");
const { createBill, getBills, getBillById, getStats } = require("../controllers/billController");

const router = express.Router();

// CRITICAL FIX: This middleware now protects ALL routes in this file.
// Every request (POST, GET, etc.) must have a valid login token.
router.use(authenticateToken);

// This route is now secure. Only a logged-in user can create a bill.
router.post("/", createBill);

// These routes remain restricted to billing managers only.
router.get("/stats", authorizeRoles("billing_manager"), getStats);
router.get("/", authorizeRoles("billing_manager"), getBills);
router.get("/:id", authorizeRoles("billing_manager"), getBillById);

module.exports = router;