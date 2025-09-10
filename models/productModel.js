const pool = require("../db/connect");

async function create({ name, description, sku, price, created_by, manager_id, image_url }) {
  const sql = "INSERT INTO products (name, description, sku, price, created_by, manager_id, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const [result] = await pool.query(sql, [name, description, sku, price, created_by, manager_id, image_url]);
  return result;
}

async function getAllByManager(manager_id) {
  const sql = "SELECT * FROM products WHERE manager_id = ?";
  const [rows] = await pool.query(sql, [manager_id]);
  return rows;
}

async function getAllProductsAdmin() {
  const sql = "SELECT * FROM products";
  const [rows] = await pool.query(sql);
  return rows;
}

async function getByIdAndManager(id, manager_id) {
  const sql = "SELECT * FROM products WHERE id = ? AND manager_id = ?";
  const [rows] = await pool.query(sql, [id, manager_id]);
  return rows[0];
}

async function update({ id, name, description, sku, price, updated_by, manager_id, image_url }) {
  const sql = "UPDATE products SET name = ?, description = ?, sku = ?, price = ?, updated_by = ?, image_url = ? WHERE id = ? AND manager_id = ?";
  return pool.query(sql, [name, description, sku, price, updated_by, image_url, id, manager_id]);
}

async function remove(id, manager_id) {
  const sql = "DELETE FROM products WHERE id = ? AND manager_id = ?";
  return pool.query(sql, [id, manager_id]);
}
// ADD THIS NEW FUNCTION
async function getPublicProducts() {
  const sql = `
    SELECT 
      p.id, 
      p.name, 
      p.description, 
      p.price, 
      p.image_url, 
      COALESCE(s.quantity, 0) as quantity 
    FROM 
      products p 
    LEFT JOIN 
      stocks s ON p.id = s.product_id
  `;
  const [rows] = await pool.query(sql);
  return rows;
}

module.exports = {
  create,
  getAllByManager,
  getAllProductsAdmin,
  getByIdAndManager,
  update,
  remove,
  getPublicProducts,
};