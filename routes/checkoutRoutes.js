const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const { initiateCheckout, confirmPayment } = require("../controllers/checkoutController");

const router = express.Router();

// All checkout routes require a user to be logged in
router.use(authenticateToken);

// Route to start the checkout process and get a QR code
router.post("/initiate", initiateCheckout);

// Route to confirm payment (simulated)
router.post("/confirm/:billId", confirmPayment);

module.exports = router;