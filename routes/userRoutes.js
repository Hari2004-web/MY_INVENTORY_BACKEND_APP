const express = require("express");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware"); // Import avatar upload middleware

// 1. Make sure to import all the necessary controller functions
const { 
    createUser, 
    getAllUsers, 
    updateUser, 
    deleteUser, 
    changePassword,
    sendMessageToManager,
    uploadAvatar,
    updateProfile 
} = require("../controllers/userController");

const router = express.Router();

// --- Routes available to ANY authenticated user ---
// 2. Place all routes that any logged-in user can access HERE,
//    BEFORE the admin-only section.
router.put("/profile", authenticateToken, updateProfile);
router.post("/profile/avatar", authenticateToken, upload, uploadAvatar);
router.post("/change-password", authenticateToken, changePassword);


// --- Routes available ONLY to 'admin' role ---
// 3. This line acts as a security gate. Any route below this can only be accessed by admins.
router.use(authenticateToken, authorizeRoles("admin"));

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").put(updateUser).delete(deleteUser);
router.post("/send-message", sendMessageToManager);

module.exports = router;