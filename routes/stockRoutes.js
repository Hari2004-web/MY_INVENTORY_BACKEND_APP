const express = require("express");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");
const {
  createStock,
  updateStock,
  deleteStock,
  getStocks,
  getStockById,
} = require("../controllers/stockController");

const router = express.Router();

// Manager can create, update, delete stock
router.post("/", authenticateToken, authorizeRoles("manager"), createStock);
router.put("/:id", authenticateToken, authorizeRoles("manager"), updateStock);
router.delete("/:id", authenticateToken, authorizeRoles("manager"), deleteStock);

// Any logged-in user can view stocks
router.get("/", authenticateToken, getStocks);
router.get("/:id", authenticateToken, getStockById);

module.exports = router;
