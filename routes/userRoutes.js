const express = require("express");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// CRITICAL FIX: Added 'getCustomerPurchaseHistory' to the import list
const { 
    createUser, 
    getAllUsers, 
    updateUser, 
    deleteUser, 
    changePassword,
    sendMessageToManager,
    uploadAvatar,
    updateProfile,
    getAllCustomers,
    getCustomerPurchaseHistory // 👈 This was the missing part
} = require("../controllers/userController");

const router = express.Router();

// Routes available to ANY authenticated user
router.put("/profile", authenticateToken, updateProfile);
router.post("/profile/avatar", authenticateToken, upload, uploadAvatar);
router.post("/change-password", authenticateToken, changePassword);

// --- Admin & Manager Shared Routes ---
router.get("/customers", authenticateToken, authorizeRoles("admin", "manager"), getAllCustomers);
router.get("/customers/:id/history", authenticateToken, authorizeRoles("admin", "manager"), getCustomerPurchaseHistory);

// --- Routes available ONLY to 'admin' role ---
router.use(authenticateToken, authorizeRoles("admin"));

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").put(updateUser).delete(deleteUser);
router.post("/send-message", sendMessageToManager);

module.exports = router;