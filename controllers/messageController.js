const messageModel = require("../models/messageModel");
const responseHandler = require("../utils/responseHandler");

const sendMessage = async (req, res) => {
  try {
    const sender_id = req.user.id; // Admin's ID from token
    const { recipient_id, subject, body } = req.body;
    await messageModel.create({ sender_id, recipient_id, subject, body });
    responseHandler.send({ res, result: { statusCode: 201, message: "Message sent successfully" } });
  } catch (error) {
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};

const getMyMessages = async (req, res) => {
  try {
    const recipient_id = req.user.id; // User's own ID from token
    const messages = await messageModel.getMessagesForUser(recipient_id);
    responseHandler.send({ res, result: { data: messages } });
  } catch (error) {
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};

module.exports = {
  sendMessage,
  getMyMessages,
};