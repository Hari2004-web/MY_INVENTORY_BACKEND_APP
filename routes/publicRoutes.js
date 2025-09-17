const express = require("express");
const { getProductsForShop, getRecommendedProductsForShop, getCategoryProductsForShop , getProductByIdForShop} = require("../controllers/publicController");

const router = express.Router();

// This route is for general product lists (not currently used by the main page but good to have)
router.get("/products", getProductsForShop);

// NEW: Route for fetching recommended (best-selling) products
router.get("/products/recommended", getRecommendedProductsForShop);

// NEW: Route for fetching products from a specific category
router.get("/products/category/:category", getCategoryProductsForShop);

// NEW: Route for fetching a single product by its ID
router.get("/product/:id", getProductByIdForShop);

module.exports = router;