const productModel = require("../models/productModel");
const responseHandler = require("../utils/responseHandler");

const createProduct = async (req, res) => {
  try {
    const payload = { ...req.body, created_by: req.user.id };
    await productModel.create(payload);
    responseHandler.send({ res, result: { statusCode: 201, message: "Product created" } });
  } catch (error) {
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await productModel.getAll();
    responseHandler.send({ res, result: { data: products } });
  } catch (error) {
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await productModel.getById(req.params.id);
    if (!product) {
        return responseHandler.send({ res, result: { statusCode: 404, message: "Product not found"} });
    }
    responseHandler.send({ res, result: { data: product } });
  } catch (error) {
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};

const updateProduct = async (req, res) => {
  try {
    const payload = { ...req.body, id: req.params.id, updated_by: req.user.id };
    await productModel.update(payload);
    responseHandler.send({ res, result: { message: "Product updated" } });
  } catch (error) {
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await productModel.remove(req.params.id);
    responseHandler.send({ res, result: { message: "Product deleted" } });
  } catch (error) {
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById, // Ensure this is exported
  updateProduct,
  deleteProduct,
};