const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/customerAuthController");

// Public route for any customer to register
router.post("/register", register);

// Public route for any customer to log in
router.post("/login", login);

module.exports = router;