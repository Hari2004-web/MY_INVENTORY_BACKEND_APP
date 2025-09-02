const stockModel = require("../models/stockModel");
const responseHandler = require("../utils/responseHandler");

const createStock = async (req, res) => {
  try {
    const payload = { ...req.body, created_by: req.user.id };
    await stockModel.create(payload);
    responseHandler.send({ res, result: { statusCode: 201, message: "Stock created" } });
  } catch (error) {
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};

const getStocks = async (req, res) => {
  try {
    const stocks = await stockModel.getAll();
    responseHandler.send({ res, result: { data: stocks } });
  } catch (error) {
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};

// ADD THIS MISSING FUNCTION
const getStockById = async (req, res) => {
    try {
        const stock = await stockModel.getById(req.params.id);
        if (!stock) {
            return responseHandler.send({ res, result: { statusCode: 404, message: "Stock not found"} });
        }
        responseHandler.send({ res, result: { data: stock } });
    } catch (error) {
        responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
    }
};

const updateStock = async (req, res) => {
  try {
    const payload = { ...req.body, id: req.params.id, updated_by: req.user.id };
    await stockModel.update(payload);
    responseHandler.send({ res, result: { message: "Stock updated" } });
  } catch (error) {
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};

const deleteStock = async (req, res) => {
  try {
    await stockModel.remove(req.params.id);
    responseHandler.send({ res, result: { message: "Stock deleted" } });
  } catch (error) {
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};

module.exports = {
  createStock,
  getStocks,
  getStockById, // Ensure this is exported
  updateStock,
  deleteStock,
};