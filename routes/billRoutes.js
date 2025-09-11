const express = require("express");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");
const { createBill, getBills, getBillById , getStats} = require("../controllers/billController"); // <-- Import getBillById

const router = express.Router();

router.use(authenticateToken, authorizeRoles("billing_manager"));
router.get("/stats", getStats); // <-- ADD THIS NEW ROUTE

router.post("/", createBill);
router.get("/", getBills);
router.get("/:id", getBillById); // <-- ADD THIS NEW ROUTE

module.exports = router;