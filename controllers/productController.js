// controllers/productController.js
const pool = require("../db/connect");

// ✅ Create Product
// ✅ Use req.user.id from JWT middleware
const createProduct = async (req, res) => {
  const { name, description, sku, price } = req.body;
  const created_by = req.user.id; // safe!

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
  const { name, description, sku, price, updated_by } = req.body; // must include updated_by

  try {
    const [result] = await pool.query(
      "CALL SP_DEALS_PRODUCTUPDATE(?, ?, ?, ?, ?, ?)",
      [id, name, description, sku, price, updated_by]
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

//  Get All Products
const getProducts = async (req, res) => {
  try {
    const [rows] = await pool.query("CALL SP_DEALS_PRODUCTVIEW()");
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get Product by ID
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("CALL SP_DEALS_PRODUCTVIEWBYID(?)", [id]);
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getProducts, 
  getProductById 
};

