// controllers/userController.js

const userModel = require("../models/userModel");
const responseHandler = require("../utils/responseHandler");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");
const billModel = require("../models/billModel");
const crypto = require("crypto");

const createUser = async (req, res) => {
  try {
    const { username, email, role } = req.body;
    if (!username || !email || !role) {
      return responseHandler.send({ res, result: { statusCode: 400, message: "Username, email, and role are required" } });
    }
    if (role === 'customer') {
        return responseHandler.send({ res, result: { statusCode: 400, message: "This endpoint cannot be used to create customer accounts." } });
    }

    // Generate a token for setting the password
    const setPasswordToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(setPasswordToken).digest("hex");
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // Token is valid for 24 hours

    // Create user without a password, but with the token
    const newUser = await userModel.createUser({
      username,
      email,
      role,
      reset_token: hashedToken,
      reset_token_expires: tokenExpiry,
    });

    // Send the set password email
    const setPasswordUrl = `http://localhost:5173/set-password/${setPasswordToken}`;
    
    // --- THIS IS THE FIX ---
    // The 'await' keyword ensures that the server waits for the email to be sent
    // before proceeding to the next line.
    await sendEmail({
      email: newUser.email,
      subject: "Welcome! Set Your Password",
      message: `You have been invited to join the platform. Please set your password by clicking this link: ${setPasswordUrl}\n\nThis link will expire in 24 hours.`
    });

    // This success response is now only sent AFTER the email has been successfully dispatched.
    responseHandler.send({ res, result: { statusCode: 201, message: "User created and invitation email sent." } });
  
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return responseHandler.send({ res, result: { statusCode: 409, message: "A user with this email already exists." } });
    }
    // This will now catch any errors from the 'sendEmail' function as well.
    console.error("Error in createUser controller:", error);
    responseHandler.send({ res, result: { statusCode: 500, error: "An unexpected error occurred on the server." } });
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

const getAllCustomers = async (req, res) => {
    try {
        const customers = await userModel.findUsersByRole('customer');
        responseHandler.send({ res, result: { data: customers } });
    } catch (error) {
        responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
    }
};

const getCustomerPurchaseHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const bills = await billModel.getBillsByUserId(id);
        responseHandler.send({ res, result: { data: bills } });
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
  getAllCustomers,
  getCustomerPurchaseHistory,
};