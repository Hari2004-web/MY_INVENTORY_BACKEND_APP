const pool = require("../db/connect");

async function create({ sender_id, recipient_id, subject, body }) {
  return pool.query(
    "INSERT INTO messages (sender_id, recipient_id, subject, body) VALUES (?, ?, ?, ?)",
    [sender_id, recipient_id, subject, body]
  );
}

async function getMessagesForUser(recipient_id) {
  const [rows] = await pool.query(
    "SELECT m.*, u.username as sender_name FROM messages m JOIN users u ON m.sender_id = u.id WHERE m.recipient_id = ? ORDER BY m.created_at DESC",
    [recipient_id]
  );
  return rows;
}

module.exports = {
  create,
  getMessagesForUser,
};