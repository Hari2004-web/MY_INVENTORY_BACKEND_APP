// controllers/productController.js
const pool = require("../db/connect");

// ✅ Create Product
const createProduct = async (req, res) => {
  const { name, description, sku, price, created_by } = req.body;
  try {
    const [result] = await pool.query(
      "CALL SP_DEALS_PRODUCTCREATION(?, ?, ?, ?, ?)",
      [name, description, sku, price, created_by]
    );
    res.status(201).json({ success: true, message: "Product created", data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Update Product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, sku, price } = req.body;
  try {
    const [result] = await pool.query(
      "CALL SP_DEALS_PRODUCTUPDATE(?, ?, ?, ?, ?)",
      [id, name, description, sku, price]
    );
    res.json({ success: true, message: "Product updated", data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Delete Product
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("CALL SP_DEALS_PRODUCTDELETE(?)", [id]);
    res.json({ success: true, message: "Product deleted", data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Get All Products
const getProducts = async (req, res) => {
  try {
    const [rows] = await pool.query("CALL SP_DEALS_PRODUCTVIEW()");
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { createProduct, updateProduct, deleteProduct, getProducts };
