const pool = require("../db/connect");

// Create Stock
const createStock = async (req, res) => {
  const { product_id, quantity } = req.body;
  const created_by = req.user.id;

  try {
    await pool.query("CALL SP_DEALS_STOCKCREATE(?, ?, ?)", [
      product_id,
      quantity,
      created_by,
    ]);
    res.status(201).json({ success: true, message: "Stock created" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

//  Update Stock
const updateStock = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const updated_by = req.user.id;

  try {
    await pool.query("CALL SP_DEALS_STOCKUPDATE(?, ?, ?)", [
      id,
      quantity,
      updated_by,
    ]);
    res.json({ success: true, message: "Stock updated" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete Stock
const deleteStock = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("CALL SP_DEALS_STOCKDELETE(?)", [id]);
    res.json({ success: true, message: "Stock deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

//  View All Stocks
const getStocks = async (req, res) => {
  try {
    const [rows] = await pool.query("CALL SP_DEALS_STOCKVIEW()");
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// View Stock by ID
const getStockById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query("CALL SP_DEALS_STOCKVIEWBYID(?)", [id]);
    res.json({ success: true, data: rows[0][0] || null });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createStock,
  updateStock,
  deleteStock,
  getStocks,
  getStockById,
};
