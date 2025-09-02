const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const responseHandler = require("../utils/responseHandler");

// ... (register function is fine)
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
    console.log("--- LOGIN ATTEMPT ---");
    console.log("Attempting login for email:", email);

    const user = await userModel.findUserByEmail(email);

    if (!user) {
      console.log("DEBUG: User not found in database.");
      return responseHandler.send({ res, result: { statusCode: 404, message: "User not found" } });
    }

    console.log("DEBUG: User found:", user.username);
    console.log("DEBUG: Plain text password from form:", password);
    console.log("DEBUG: Hashed password from database:", user.password_hash);

    const validPassword = await bcrypt.compare(password, user.password_hash);

    console.log("DEBUG: bcrypt.compare result:", validPassword); // This will be true or false

    if (!validPassword) {
      console.log("DEBUG: Password comparison failed.");
      return responseHandler.send({ res, result: { statusCode: 401, message: "Invalid credentials" } });
    }

    console.log("DEBUG: Password comparison successful. Generating token.");
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const userData = { id: user.id, username: user.username, role: user.role };
    
    responseHandler.send({ res, result: { data: { token, user: userData } } });

  } catch (error) {
    console.error("!!! FATAL ERROR in login controller:", error);
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};

module.exports = { register, login };