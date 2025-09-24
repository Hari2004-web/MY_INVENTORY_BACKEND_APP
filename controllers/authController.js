const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const responseHandler = require("../utils/responseHandler");

// ... (register, login, forgotPassword, verifyOtp, resetPassword functions remain the same) ...
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
    
    if (!email || !password) {
        return responseHandler.send({ res, result: { statusCode: 400, message: "Email and password are required." } });
    }

    const user = await userModel.findUserByEmail(email);

    if (!user || !user.password_hash) {
      return responseHandler.send({ res, result: { statusCode: 401, message: "Invalid credentials" } });
    }
    
    const passwordFromForm = String(password);
    const storedHash = String(user.password_hash);

    const validPassword = await bcrypt.compare(passwordFromForm, storedHash);

    if (!validPassword) {
      return responseHandler.send({ res, result: { statusCode: 401, message: "Invalid credentials" } });
    }
    
    const tokenPayload = { 
        id: user.id, 
        role: user.role, 
        username: user.username,
        avatar_url: user.avatar_url
    };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "1h" });

    const userData = { 
        id: user.id, 
        username: user.username, 
        role: user.role, 
        avatar_url: user.avatar_url
    };

    responseHandler.send({ res, result: { data: { token, user: userData } } });
  } catch (error) {
    console.error("CRITICAL LOGIN ERROR:", error);
    responseHandler.send({ res, result: { statusCode: 500, error: "An internal server error occurred." } });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findUserByEmail(email);
    if (!user) {
      return responseHandler.send({ res, result: { message: "If an account with that email exists, an OTP has been sent." } });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10); // Hash the OTP
    
    // Set OTP expiry to 10 minutes from now
    const tokenExpiry = new Date(Date.now() + 10 * 60 * 1000); 

    await userModel.setPasswordResetToken(user.id, hashedOtp, tokenExpiry);
    
    await sendEmail({
      email: user.email,
      subject: 'Your Password Reset OTP',
      message: `You requested a password reset. Your OTP is: ${otp}\n\nThis OTP will expire in 10 minutes.`
    });
    
    responseHandler.send({ res, result: { message: "If an account with that email exists, an OTP has been sent." } });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    responseHandler.send({ res, result: { statusCode: 500, message: "An error occurred while trying to send the reset email." } });
  }
};

// --- NEW FUNCTION TO VERIFY OTP ---
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await userModel.findUserByEmail(email);

    if (!user || !user.reset_token || !(await bcrypt.compare(otp, user.reset_token)) || new Date() > user.reset_token_expires) {
      return responseHandler.send({ res, result: { statusCode: 400, message: "Invalid OTP or OTP has expired." } });
    }
    
    // If OTP is valid, send a success response
    responseHandler.send({ res, result: { message: "OTP verified successfully." } });
  } catch (error) {
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};

const resetPassword = async (req, res) => {
  try {
    // The OTP is no longer needed here, just the email and new password
    const { email, password } = req.body;
    const user = await userModel.findUserByEmail(email);

    if (!user) {
      return responseHandler.send({ res, result: { statusCode: 400, message: "User not found." } });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.updatePasswordAndClearToken(user.id, hashedPassword);
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
      return responseHandler.send({ res, result: { statusCode: 400, message: "This link is invalid or has expired." } });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.updatePasswordAndClearToken(user.id, hashedPassword);
    responseHandler.send({ res, result: { message: "Password has been set successfully. You can now log in." } });
  } catch (error) {
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};


module.exports = {
  register,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  setPassword,
};  