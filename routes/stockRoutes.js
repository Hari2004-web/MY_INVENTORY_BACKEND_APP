// routes/stockRoutes.js
const express = require("express");
const router = express.Router();
const {
  createStock,
  getStocks,
  updateStock,
  deleteStock,
} = require("../controllers/stockController");

const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

// Admin & Manager can view stocks
router.get("/", authenticateToken, authorizeRoles("admin", "manager"), getStocks);

// Only Manager can create/update/delete stocks
router.post("/", authenticateToken, authorizeRoles("manager"), createStock);
router.put("/:id", authenticateToken, authorizeRoles("manager"), updateStock);
router.delete("/:id", authenticateToken, authorizeRoles("manager"), deleteStock);

module.exports = router;
