const stockModel = require("../models/stockModel");
const userModel = require("../models/userModel");
const messageModel = require("../models/messageModel");
const responseHandler = require("../utils/responseHandler");

const LOW_STOCK_THRESHOLD = 10;

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

    if (payload.quantity <= LOW_STOCK_THRESHOLD) {
      const stockItem = await stockModel.getById(payload.id);
      const productName = stockItem ? stockItem.product_name : 'An item';
      
      const admins = await userModel.findUsersByRole('admin');
      if (admins.length > 0) {
        const adminSender = admins[0];
        const managers = await userModel.findUsersByRole('manager');

        await Promise.all(
          managers.map(manager => 
            messageModel.create({
              sender_id: adminSender.id,
              recipient_id: manager.id,
              subject: `❗ Low Stock Alert: ${productName}`,
              body: `This is an automated alert.\n\nThe stock for "${productName}" is running low.\n\nQuantity Remaining: ${payload.quantity}\n\nPlease restock soon.`
            })
          )
        );
      }
    }
    responseHandler.send({ res, result: { message: "Stock updated successfully" } });
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
  getStockById,
  updateStock,
  deleteStock,
};