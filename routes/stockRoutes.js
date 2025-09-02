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

router.use(authenticateToken);

// ONLY managers can create, update, and delete
router.post("/", authorizeRoles("manager"), createStock);
router.put("/:id", authorizeRoles("manager"), updateStock);
router.delete("/:id", authorizeRoles("manager"), deleteStock);

// BOTH admins and managers can view
router.get("/", authorizeRoles("admin", "manager"), getStocks);
router.get("/:id", authorizeRoles("admin", "manager"), getStockById);

module.exports = router;