const productModel = require("../models/productModel");
const responseHandler = require("../utils/responseHandler");

const createProduct = async (req, res) => {
  try {
    const manager_id = req.user.id;
    const image_url = req.file ? `/uploads/products/${req.file.filename}` : null;
    const payload = { ...req.body, created_by: manager_id, manager_id: manager_id, image_url };
    await productModel.create(payload);
    responseHandler.send({ res, result: { statusCode: 201, message: "Product created successfully" } });
  } catch (error) {
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};

const getProducts = async (req, res) => {
  try {
    let products;
    if (req.user.role === 'admin') {
      products = await productModel.getAllProductsAdmin();
    } else {
      const manager_id = req.user.id;
      products = await productModel.getAllByManager(manager_id);
    }
    responseHandler.send({ res, result: { data: products } });
  } catch (error) {
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};

const updateProduct = async (req, res) => {
  try {
    const manager_id = req.user.id;
    const image_url = req.file ? `/uploads/products/${req.file.filename}` : req.body.image_url;
    const payload = { ...req.body, id: req.params.id, updated_by: manager_id, manager_id: manager_id, image_url };
    await productModel.update(payload);
    responseHandler.send({ res, result: { message: "Product updated successfully" } });
  } catch (error) {
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const manager_id = req.user.id;
    await productModel.remove(req.params.id, manager_id);
    responseHandler.send({ res, result: { message: "Product deleted successfully" } });
  } catch (error) {
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};

const getProductById = async (req, res) => {
    try {
        const manager_id = req.user.id;
        const product = await productModel.getByIdAndManager(req.params.id, manager_id);
        if (!product) {
            return responseHandler.send({ res, result: { statusCode: 404, message: "Product not found"} });
        }
        responseHandler.send({ res, result: { data: product } });
    } catch (error) {
        responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
    }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};