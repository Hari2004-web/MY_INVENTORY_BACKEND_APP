const billModel = require("../models/billModel");
const { get } = require("../routes/billRoutes");
const responseHandler = require("../utils/responseHandler");

// controllers/billController.js

const createBill = async (req, res) => {
  try {
    const payload = { ...req.body, created_by: req.user.id };
    const newBill = await billModel.createBill(payload);
    responseHandler.send({ res, result: { statusCode: 201, message: "Bill created successfully", data: newBill } });
  } catch (error) {
    // Check for our custom insufficient stock error
    if (error.message.startsWith('Insufficient stock')) {
      // Send a "Conflict" status code and the specific error message
      return responseHandler.send({ res, result: { statusCode: 409, message: error.message, error: error.message } });
    }
    // Handle other potential errors
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};

const getBills = async (req, res) => {
  try {
    const bills = await billModel.getBills();
    responseHandler.send({ res, result: { data: bills } });
  } catch (error) {
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};

// ADD THIS NEW FUNCTION
const getBillById = async (req, res) => {
  try {
    const bill = await billModel.getBillById(req.params.id);
    if (!bill) {
      return responseHandler.send({ res, result: { statusCode: 404, message: "Bill not found" } });
    }
    responseHandler.send({ res, result: { data: bill } });
  } catch (error) {
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};


// ADD THIS NEW FUNCTION
const getStats = async (req, res) => {
  try {
    const stats = await billModel.getBillingStats();
    responseHandler.send({ res, result: { data: stats } });
  } catch (error) {
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};


module.exports = {
  createBill,
  getBills,
  getBillById, // EXPORT THE NEW FUNCTION
  getStats // EXPORT THE NEW FUNCTION
};