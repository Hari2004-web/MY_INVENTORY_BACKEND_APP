// controllers/wishlistController.js
const wishlistModel = require("../models/wishlistModel");
const responseHandler = require("../utils/responseHandler");

const getWishlist = async (req, res) => {
  try {
    const wishlist = await wishlistModel.getWishlist(req.user.id);
    responseHandler.send({ res, result: { data: wishlist } });
  } catch (error) {
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};

const addToWishlist = async (req, res) => {
  try {
    await wishlistModel.addToWishlist(req.user.id, req.body.productId);
    responseHandler.send({ res, result: { statusCode: 201, message: "Added to wishlist" } });
  } catch (error) {
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    await wishlistModel.removeFromWishlist(req.user.id, req.params.productId);
    responseHandler.send({ res, result: { message: "Removed from wishlist" } });
  } catch (error) {
    responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};