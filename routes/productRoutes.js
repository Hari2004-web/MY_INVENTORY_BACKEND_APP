const express = require("express");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");
const productUpload = require('../middleware/productUploadMiddleware');
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductById,
} = require("../controllers/productController");

const router = express.Router();

router.use(authenticateToken);

// Use the upload middleware on the create and update routes
router.post("/", authorizeRoles("manager"), productUpload, createProduct);
router.put("/:id", authorizeRoles("manager"), productUpload, updateProduct);

router.delete("/:id", authorizeRoles("manager"), deleteProduct);
router.get("/", authorizeRoles("admin", "manager"), getProducts);
router.get("/:id", authorizeRoles("admin", "manager"), getProductById);

module.exports = router;