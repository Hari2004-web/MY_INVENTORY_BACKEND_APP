const express = require("express");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");
const { 
    createUser, 
    getAllUsers, 
    updateUser, 
    deleteUser, 
    changePassword 
} = require("../controllers/userController");

const router = express.Router();

// Route for any logged-in user to change their own password
router.post("/change-password", authenticateToken, changePassword);

// Admin-only routes for managing other users
router.use(authenticateToken, authorizeRoles("admin"));
router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").put(updateUser).delete(deleteUser);

module.exports = router;