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

module.exports = {
  getProductsForShop,
};