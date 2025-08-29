const express = require("express");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

//  Admin-only access to manage users
router.get("/", authenticateToken, authorizeRoles("admin"), getAllUsers);
router.get("/:id", authenticateToken, authorizeRoles("admin"), getUserById);
router.post("/", authenticateToken, authorizeRoles("admin"), createUser);
router.put("/:id", authenticateToken, authorizeRoles("admin"), updateUser);
router.delete("/:id", authenticateToken, authorizeRoles("admin"), deleteUser);

module.exports = router;
