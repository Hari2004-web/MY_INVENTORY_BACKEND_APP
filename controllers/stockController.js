// controllers/stockController.js
const pool = require("../db/connect");

// ✅ Add Stock
const createStock = async (req, res) => {
  const { product_id, quantity, location, updated_by } = req.body;
  try {
    const [result] = await pool.query(
      "CALL SP_DEALS_STOCKCREATION(?, ?, ?, ?)",
      [product_id, quantity, location, updated_by]
    );
    res.status(201).json({ success: true, message: "Stock added", data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Update Stock
const updateStock = async (req, res) => {
  const { id } = req.params;
  const { quantity, location, updated_by } = req.body;
  try {
    const [result] = await pool.query(
      "CALL SP_DEALS_STOCKUPDATE(?, ?, ?, ?)",
      [id, quantity, location, updated_by]
    );
    res.json({ success: true, message: "Stock updated", data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Delete Stock
const deleteStock = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("CALL SP_DEALS_STOCKDELETE(?)", [id]);
    res.json({ success: true, message: "Stock deleted", data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ View All Stocks
const getStocks = async (req, res) => {
  try {
    const [rows] = await pool.query("CALL SP_DEALS_STOCKVIEW()");
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { createStock, updateStock, deleteStock, getStocks };
