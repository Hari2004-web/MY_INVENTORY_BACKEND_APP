const productModel = require("../models/productModel");
const responseHandler = require("../utils/responseHandler");

const getProductsForShop = async (req, res) => {
  try {
    const products = await productModel.getPublicProducts();
    responseHandler.send({ res, result: { data: products } });
  } catch (error) {
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};

// NEW: Handles fetching recommended products
const getRecommendedProductsForShop = async (req, res) => {
  try {
    const products = await productModel.getRecommendedProducts();
    responseHandler.send({ res, result: { data: products } });
  } catch (error) {
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};

// ... (keep the other functions as they are) ...

const getCategoryProductsForShop = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await productModel.getProductsByCategory(category);
    
    // --- ADD THIS DEBUGGING LINE ---
    console.log(`[DEBUG] API received request for category: '${category}'. Found ${products.length} products.`);
    
    responseHandler.send({ res, result: { data: products } });
  } catch (error) {
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};

// NEW: Handles fetching a single product by ID for the shop
const getProductByIdForShop = async (req, res) => {
  try {
    const product = await productModel.getPublicProductById(req.params.id);
    if (!product) {
      return responseHandler.send({ res, result: { statusCode: 404, message: "Product not found" } });
    }
    responseHandler.send({ res, result: { data: product } });
  } catch (error) {
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};

module.exports = {
  getProductsForShop,
  getRecommendedProductsForShop,
  getCategoryProductsForShop,
  getProductByIdForShop,
  };