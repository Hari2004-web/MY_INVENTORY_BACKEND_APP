const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const responseHandler = require("../utils/responseHandler");

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const users = await userModel.getAll();
    if (users.some(user => user.role === 'admin')) {
      return responseHandler.send({ res, result: { statusCode: 403, message: "An admin already exists." } });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.createUser({ username, email, password: hashedPassword, role: 'admin' });
    responseHandler.send({ res, result: { statusCode: 201, message: "Admin registered successfully" } });
  } catch (error) {
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findUserByEmail(email);
    if (!user) {
      return responseHandler.send({ res, result: { statusCode: 404, message: "User not found" } });
    }
    // A user with no password hash (e.g., invited manager) cannot log in directly
    if (!user.password_hash) {
        return responseHandler.send({ res, result: { statusCode: 401, message: "Account not activated. Please use the 'Set Password' link from your invitation email." } });
    }
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return responseHandler.send({ res, result: { statusCode: 401, message: "Invalid credentials" } });
    }
    
    // Create the token payload with all necessary info
    const tokenPayload = { 
        id: user.id, 
        role: user.role, 
        username: user.username,
        avatar_url: user.avatar_url
    };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "1h" });

    // FIX: Create the user data object to send to the frontend, including the avatar_url
    const userData = { 
        id: user.id, 
        username: user.username, 
        role: user.role, 
        avatar_url: user.avatar_url // This was the missing piece
    };

    responseHandler.send({ res, result: { data: { token, user: userData } } });
  } catch (error) {
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findUserByEmail(email);
    if (!user) {
      return responseHandler.send({ res, result: { statusCode: 404, message: "User with that email does not exist." } });
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const tokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await userModel.setPasswordResetToken(user.id, hashedToken, tokenExpiry);
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request',
      message: `Click this link to reset your password: ${resetUrl}`
    });
    responseHandler.send({ res, result: { message: "Password reset email sent." } });
  } catch (error) {
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await userModel.findUserByResetToken(hashedToken);
    if (!user) {
      return responseHandler.send({ res, result: { statusCode: 400, message: "Token is invalid or has expired." } });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.updatePassword(user.id, hashedPassword);
    responseHandler.send({ res, result: { message: "Password has been reset successfully." } });
  } catch (error) {
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};

const setPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await userModel.findUserByResetToken(hashedToken);
    if (!user) {
      return responseHandler.send({ res, result: { statusCode: 400, message: "Token is invalid or has expired." } });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.updatePassword(user.id, hashedPassword);
    responseHandler.send({ res, result: { message: "Password has been set successfully. You can now log in." } });
  } catch (error) {
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  setPassword,
};