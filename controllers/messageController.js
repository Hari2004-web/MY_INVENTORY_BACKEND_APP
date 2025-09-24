const messageModel = require("../models/messageModel");
const responseHandler = require("../utils/responseHandler");
// 1. Re-import userModel and sendEmail
const userModel = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");

const sendMessage = async (req, res) => {
  try {
    const sender_id = req.user.id;
    const { recipient_id, subject, body } = req.body;

    // 2. Save the message to the internal database
    await messageModel.create({ sender_id, recipient_id, subject, body });

    // 3. Find the recipient's details to get their email address
    const recipient = await userModel.findUserById(recipient_id);
    if (!recipient || !recipient.email) {
      console.error(`Could not find user or user email for recipient ID: ${recipient_id}`);
      return responseHandler.send({ res, result: { statusCode: 201, message: "Message sent internally, but could not send email notification." } });
    }

    // 4. Send the actual email using the sendEmail utility
    await sendEmail({
      email: recipient.email,
      subject: `New Message from Admin: ${subject}`,
      message: `You have received a new message from an administrator in the portal.\n\n---\n\n${body}\n\n---\n\nPlease log in to the portal to view and reply.`
    });

    // 5. Confirm that both actions were successful
    responseHandler.send({ res, result: { statusCode: 201, message: "Message sent and email notification delivered" } });
  } catch (error) {
    console.error("Error sending message:", error);
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};

const getMyMessages = async (req, res) => {
  try {
    const recipient_id = req.user.id;
    const messages = await messageModel.getMessagesForUser(recipient_id);
    responseHandler.send({ res, result: { data: messages } });
  } catch (error) {
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};
const markMessageAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const messageId = req.params.id;
    await messageModel.markAsRead(messageId, userId);
    responseHandler.send({ res, result: { message: "Message marked as read" } });
  } catch (error) {
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};


module.exports = {
  sendMessage,
  getMyMessages,
  markMessageAsRead,
};