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

router.use(authenticateToken);

// ONLY managers can create, update, and delete
router.post("/", authorizeRoles("manager"), createProduct);
router.put("/:id", authorizeRoles("manager"), updateProduct);
router.delete("/:id", authorizeRoles("manager"), deleteProduct);

// BOTH admins and managers can view
router.get("/", authorizeRoles("admin", "manager"), getProducts);
router.get("/:id", authorizeRoles("admin", "manager"), getProductById);

module.exports = router;