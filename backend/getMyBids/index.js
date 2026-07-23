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
  const taskerId = event.queryStringParameters?.taskerId || 'tasker-demo-001';
  
  try {
    const conn = await getConnection();
    const [bids] = await conn.execute(
      'SELECT b.id, b.amount, b.status, b.created_at, b.quest_id, ' +
      'q.title, q.description, q.category, q.bounty, q.location, q.status as quest_status, q.poster_id ' +
      'FROM bids b JOIN quests q ON b.quest_id = q.id ' +
      'WHERE b.tasker_id = ? ORDER BY b.created_at DESC',
      [taskerId]
    );
    return { statusCode: 200, headers, body: JSON.stringify({ bids }) };
  } catch (error) {
    console.error('Error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to fetch bids', details: error.message }) };
  }
};
