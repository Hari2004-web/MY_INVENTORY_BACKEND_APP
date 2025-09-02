const express = require("express");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");
const { createUser, getAllUsers, updateUser, deleteUser } = require("../controllers/userController");

const router = express.Router();

router.use(authenticateToken, authorizeRoles("admin")); // Secure all routes for admins

router.route("/")
  .get(getAllUsers)
  .post(createUser); // Add the POST route for creating users

router.route("/:id")
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;