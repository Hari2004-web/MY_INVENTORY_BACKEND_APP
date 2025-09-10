const userModel = require("../models/userModel");
const responseHandler = require("../utils/responseHandler");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

const createUser = async (req, res) => {
  try {
    const { username, email, role } = req.body;
    if (!username || !email || !role) {
      return responseHandler.send({ res, result: { statusCode: 400, message: "Username, email, and role are required" } });
    }
    const newUserResult = await userModel.createUser({ username, email, password: null, role });
    const newUserId = newUserResult[0].insertId;
    const setPasswordToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(setPasswordToken).digest("hex");
    const tokenExpiry = Date.now() + 24 * 60 * 60 * 1000;
    await userModel.setPasswordResetToken(newUserId, hashedToken, tokenExpiry);
    const setPasswordUrl = `http://localhost:5173/set-password/${setPasswordToken}`;
    await sendEmail({
      email: email,
      subject: 'You have been invited to the Inventory Management System',
      message: `Hello ${username},\n\nPlease click the following link to set your password:\n\n${setPasswordUrl}`
    });
    responseHandler.send({ res, result: { statusCode: 201, message: "Manager invitation sent successfully" } });
  } catch (error) {
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAll();
    responseHandler.send({ res, result: { data: users } });
  } catch (error) {
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};

const updateUser = async (req, res) => {
  try {
    const payload = { ...req.body, id: req.params.id };
    await userModel.updateUser(payload);
    responseHandler.send({ res, result: { message: "User updated" } });
  } catch (error) {
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};

const deleteUser = async (req, res) => {
  try {
    await userModel.deleteUser(req.params.id);
    responseHandler.send({ res, result: { message: "User deleted" } });
  } catch (error) {
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;
    const user = await userModel.findUserById(userId);
    if (!user) {
      return responseHandler.send({ res, result: { statusCode: 404, message: "User not found" } });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isMatch) {
      return responseHandler.send({ res, result: { statusCode: 401, message: "Incorrect old password" } });
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await userModel.updatePassword(userId, hashedNewPassword);
    responseHandler.send({ res, result: { message: "Password updated successfully" } });
  } catch (error) {
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};

const sendMessageToManager = async (req, res) => {
  try {
    const { email, subject, message } = req.body;
    await sendEmail({ email, subject, message });
    responseHandler.send({ res, result: { message: "Message sent successfully." } });
  } catch (error) {
    responseHandler.send({ res, result: { statusCode: 500, error: "Failed to send the message." } });
  }
};
// ADD THIS NEW CONTROLLER FUNCTION
const uploadAvatar = async (req, res) => {
  try {
    // The 'upload' middleware places the file info in req.file
    if (!req.file) {
      return responseHandler.send({ res, result: { statusCode: 400, message: "No file was uploaded." } });
    }

    // Construct the path to be stored in the database
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    // Update the user's record in the database
    await userModel.updateAvatar(req.user.id, avatarUrl);

    // Fetch the updated user data to send back to the frontend
    const updatedUser = await userModel.findUserById(req.user.id);

    // Send a success response with the new user data
    responseHandler.send({ 
        res, 
        result: { 
            message: "Avatar updated successfully", 
            data: { user: updatedUser } 
        } 
    });
  } catch (error) {
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};
// ADD THIS NEW CONTROLLER FUNCTION
const updateProfile = async (req, res) => {
  try {
    const { username } = req.body;
    const userId = req.user.id;

    if (!username || username.trim() === '') {
      return responseHandler.send({ res, result: { statusCode: 400, message: "Username cannot be empty." } });
    }

    await userModel.updateUsername(userId, username.trim());
    const updatedUser = await userModel.findUserById(userId);

    responseHandler.send({
      res,
      result: {
        message: "Profile updated successfully",
        data: { user: updatedUser },
      },
    });
  } catch (error) {
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  changePassword,
  sendMessageToManager,
  uploadAvatar,
  updateProfile,
};