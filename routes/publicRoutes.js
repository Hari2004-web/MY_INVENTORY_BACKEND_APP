const express = require("express");
const { getProductsForShop } = require("../controllers/publicController");

const router = express.Router();

// This route is public and does not require a login token.
// It corresponds to the frontend call in 'src/api/publicApi.js'.
router.get("/products", getProductsForShop);

module.exports = router;    