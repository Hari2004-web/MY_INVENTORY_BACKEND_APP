const express = require("express");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductById,
} = require("../controllers/productController");

const router = express.Router();

// Only manager can create products
router.post("/", authenticateToken, authorizeRoles("manager"), createProduct);

// Manager can also update or delete
router.put("/:id", authenticateToken, authorizeRoles("manager"), updateProduct);
router.delete("/:id", authenticateToken, authorizeRoles("manager"), deleteProduct);

// Anyone logged in can view products
router.get("/", authenticateToken, getProducts);
router.get("/:id", authenticateToken, getProductById);

module.exports = router;
