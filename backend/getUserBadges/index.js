const mysql = require('mysql2/promise');

let connection;

async function getConnection() {
  if (!connection) {
    connection = await mysql.createConnection(process.env.TIDB_CONNECTION_STRING);
  }
  return connection;
}

exports.handler = async (event) => {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  const userId = event.queryStringParameters?.userId || 'user-123';

  try {
    const conn = await getConnection();
    const [rows] = await conn.execute(
      `SELECT b.id, b.name, b.description, b.icon, b.color, b.rarity, ub.earned_at
       FROM badges b
       JOIN user_badges ub ON b.id = ub.badge_id
       WHERE ub.user_id = ?`,
      [userId]
    );
    return { statusCode: 200, headers, body: JSON.stringify({ badges: rows }) };
  } catch (error) {
    console.error('Error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to fetch badges', details: error.message }) };
  }
};
