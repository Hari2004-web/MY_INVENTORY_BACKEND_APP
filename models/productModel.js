// models/productModel.js

const pool = require("../db/connect");

// ... create, getAllByManager, etc. functions remain the same ...
// MODIFIED: Added 'category' to the function signature and SQL query.
async function create({ name, description, sku, price, manager_id, image_url, category }) {
  const sql = "INSERT INTO products (name, description, sku, price, manager_id, image_url, category) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const [result] = await pool.query(sql, [name, description, sku, price, manager_id, image_url, category]);
  return result;
}

async function getAllByManager(manager_id) {
  const sql = "SELECT * FROM products WHERE manager_id = ?";
  const [rows] = await pool.query(sql, [manager_id]);
  return rows;
}

async function getAllByManagerAndCategory(manager_id, category) {
  const sql = "SELECT * FROM products WHERE manager_id = ? AND category = ?";
  const [rows] = await pool.query(sql, [manager_id, category]);
  return rows;
}

async function getAllProductsAdmin() {
  const sql = "SELECT * FROM products";
  const [rows] = await pool.query(sql);
  return rows;
}

async function getAllProductsAdminByCategory(category) {
  const sql = "SELECT * FROM products WHERE category = ?";
  const [rows] = await pool.query(sql, [category]);
  return rows;
}

async function getByIdAndManager(id, manager_id) {
  const sql = "SELECT * FROM products WHERE id = ? AND manager_id = ?";
  const [rows] = await pool.query(sql, [id, manager_id]);
  return rows[0];
}

// MODIFIED: Added 'category' to the function signature and SQL query.
async function update({ id, name, description, sku, price, manager_id, image_url, category }) {
  const sql = "UPDATE products SET name = ?, description = ?, sku = ?, price = ?, image_url = ?, category = ? WHERE id = ? AND manager_id = ?";
  return pool.query(sql, [name, description, sku, price, image_url, category, id, manager_id]);
}

async function remove(id, manager_id) {
  const sql = "DELETE FROM products WHERE id = ? AND manager_id = ?";
  return pool.query(sql, [id, manager_id]);
}


// --- Public Functions Updated ---

async function getPublicProducts() {
  const sql = `
    SELECT p.id, p.name, p.description, p.price, p.image_url, p.category, p.created_at, COALESCE(s.quantity, 0) as quantity 
    FROM products p LEFT JOIN stocks s ON p.id = s.product_id`;
  const [rows] = await pool.query(sql);
  return rows;
}

async function getRecommendedProducts() {
  const sql = `
    SELECT p.id, p.name, p.description, p.price, p.image_url, p.category, p.created_at, COALESCE(s.quantity, 0) as quantity,
      (SELECT SUM(bi.quantity) FROM bill_items bi WHERE bi.product_id = p.id) as total_sold
    FROM products p LEFT JOIN stocks s ON p.id = s.product_id
    ORDER BY total_sold DESC LIMIT 8`;
  const [rows] = await pool.query(sql);
  return rows;
}

async function getProductsByCategory(category) {
  const sql = `
    SELECT p.id, p.name, p.description, p.price, p.image_url, p.category, p.created_at, COALESCE(s.quantity, 0) as quantity 
    FROM products p LEFT JOIN stocks s ON p.id = s.product_id
    WHERE p.category = ?`;
  const [rows] = await pool.query(sql, [category]);
  return rows;
}

async function getPublicProductById(id) {
  const sql = `
    SELECT p.id, p.name, p.description, p.price, p.image_url, p.category, p.created_at, COALESCE(s.quantity, 0) as quantity 
    FROM products p LEFT JOIN stocks s ON p.id = s.product_id
    WHERE p.id = ?`;
  const [rows] = await pool.query(sql, [id]);
  return rows[0];
}

module.exports = {
  create,
  getAllByManager,
  getAllByManagerAndCategory,
  getAllProductsAdmin,
  getAllProductsAdminByCategory,
  getByIdAndManager,
  update,
  remove,
  getPublicProducts,
  getRecommendedProducts,
  getProductsByCategory,
  getPublicProductById,
};