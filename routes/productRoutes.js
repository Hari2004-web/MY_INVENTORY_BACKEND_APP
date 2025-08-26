// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

// Admin & Manager can view products
router.get("/", authenticateToken, authorizeRoles("admin", "manager"), getProducts);

// Only Admin can create/update/delete products
router.post("/", authenticateToken, authorizeRoles("admin"), createProduct);
router.put("/:id", authenticateToken, authorizeRoles("admin"), updateProduct);
router.delete("/:id", authenticateToken, authorizeRoles("admin"), deleteProduct);

module.exports = router;
