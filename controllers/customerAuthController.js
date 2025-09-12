const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const responseHandler = require("../utils/responseHandler");

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return responseHandler.send({ res, result: { statusCode: 400, message: "Username, email, and password are required." } });
    }
    
    await userModel.createUser({ username, email, password, role: 'customer' });

    responseHandler.send({ res, result: { statusCode: 201, message: "Customer account created successfully." } });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return responseHandler.send({ res, result: { statusCode: 409, message: "An account with this email already exists." } });
    }
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findUserByEmail(email);

    if (!user || user.role !== 'customer') {
      return responseHandler.send({ res, result: { statusCode: 404, message: "Customer account not found." } });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return responseHandler.send({ res, result: { statusCode: 401, message: "Invalid credentials." } });
    }
    
    const tokenPayload = { 
        id: user.id, 
        role: user.role, 
        username: user.username,
    };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "24h" });

    const userData = { 
        id: user.id, 
        username: user.username, 
        role: user.role, 
    };

    responseHandler.send({ res, result: { data: { token, user: userData } } });
  } catch (error) {
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};

module.exports = {
  register,
  login,
};