const express = require("express");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");
const { 
    createUser, 
    getAllUsers, 
    updateUser, 
    deleteUser, 
    changePassword,
    sendMessageToManager
} = require("../controllers/userController");

const router = express.Router();

// This route is for any authenticated user (manager or admin)
router.post("/change-password", authenticateToken, changePassword);

// The routes below are ONLY for admins
router.use(authenticateToken, authorizeRoles("admin"));

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").put(updateUser).delete(deleteUser);

// This line defines the route for sending a message
router.post("/send-message", sendMessageToManager); 

module.exports = router;