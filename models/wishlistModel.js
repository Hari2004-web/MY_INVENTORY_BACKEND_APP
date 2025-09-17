// models/wishlistModel.js
const pool = require("../db/connect");

async function getWishlist(userId) {
  // This query joins the wishlist and products tables to get the full product details
  const [rows] = await pool.query(
    `SELECT p.* FROM products p
     JOIN wishlist w ON p.id = w.product_id
     WHERE w.user_id = ?`,
    [userId]
  );
  return rows;
}

async function addToWishlist(userId, productId) {
  // Uses IGNORE to prevent errors if the item is already in the wishlist
  return pool.query("INSERT IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)", [userId, productId]);
}

async function removeFromWishlist(userId, productId) {
  return pool.query("DELETE FROM wishlist WHERE user_id = ? AND product_id = ?", [userId, productId]);
}

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};