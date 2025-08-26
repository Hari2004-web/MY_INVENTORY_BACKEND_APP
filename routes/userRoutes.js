// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { createUser, updateUser, deleteUser, getUsers } = require("../controllers/userController");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

// Only logged in users can access
router.use(authenticateToken);

// Routes with role-based access
router.get("/", authorizeRoles("admin", "manager"), getUsers);
router.post("/", authorizeRoles("admin"), createUser);
router.put("/:id", authorizeRoles("admin"), updateUser);
router.delete("/:id", authorizeRoles("admin"), deleteUser);

module.exports = router;
