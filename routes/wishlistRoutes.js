// routes/wishlistRoutes.js
const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const { getWishlist, addToWishlist, removeFromWishlist } = require("../controllers/wishlistController");

const router = express.Router();

// This ensures only logged-in users can access their wishlist
router.use(authenticateToken);

router.get("/", getWishlist);
router.post("/", addToWishlist);
router.delete("/:productId", removeFromWishlist);

module.exports = router;