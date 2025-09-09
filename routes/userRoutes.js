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

router.post("/change-password", authenticateToken, changePassword);

router.use(authenticateToken, authorizeRoles("admin"));

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").put(updateUser).delete(deleteUser);
router.post("/send-message", sendMessageToManager);

module.exports = router;