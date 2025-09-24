const express = require("express");
const router = express.Router();
const { register, login, forgotPassword, resetPassword, setPassword, verifyOtp } = require("../controllers/authController");

// Handles initial admin registration
router.post("/register", register);

// Handles all user logins (admin, manager, etc.)
router.post("/login", login);

// Handles the request to send a password reset email
router.post("/forgot-password", forgotPassword);

// --- THIS IS THE NEW ROUTE ---
// Handles the OTP verification
router.post("/verify-otp", verifyOtp);

// Handles the submission of the new password from the reset link
router.post("/reset-password", resetPassword);

// Handles the submission of a new password for an invited user
router.post("/set-password/:token", setPassword);

module.exports = router;