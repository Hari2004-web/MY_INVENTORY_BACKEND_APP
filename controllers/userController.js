const userModel = require("../models/userModel");
const responseHandler = require("../utils/responseHandler");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

// --- MODIFIED FUNCTION ---
const createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // 1. Validate that all required fields are present
    if (!username || !email || !password || !role) {
      return responseHandler.send({ res, result: { statusCode: 400, message: "Username, email, password, and role are required" } });
    }

    // 2. Pass the user data (including the plain-text password) directly to the model.
    // The model will now be responsible for hashing.
    await userModel.createUser({ username, email, password, role });

    // 3. Send a success response
    responseHandler.send({ res, result: { statusCode: 201, message: "User created successfully" } });

  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
        return responseHandler.send({ res, result: { statusCode: 409, message: "A user with this email already exists." } });
    }
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

const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return responseHandler.send({ res, result: { statusCode: 400, message: "No file was uploaded." } });
    }
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    await userModel.updateAvatar(req.user.id, avatarUrl);
    const updatedUser = await userModel.findUserById(req.user.id);
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