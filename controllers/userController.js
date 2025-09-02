const userModel = require("../models/userModel");
const responseHandler = require("../utils/responseHandler");
const bcrypt = require("bcryptjs"); // Import bcrypt

// This function is for admins to create new users (managers)
const createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password || !role) {
        return responseHandler.send({ res, result: { statusCode: 400, message: "All fields are required" } });
    }
    // Hash the password before creating the user
    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.createUser({ username, email, password: hashedPassword, role });
    responseHandler.send({ res, result: { statusCode: 201, message: "User created successfully" } });
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

module.exports = { createUser, getAllUsers, updateUser, deleteUser }; // Export createUser