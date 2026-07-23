const mysql = require('mysql2/promise');
const { randomUUID } = require('crypto');

async function awardBadgeIfNotExists(connection, userId, badgeId) {
  try {
    const [existing] = await connection.execute(
      'SELECT 1 FROM user_badges WHERE user_id = ? AND badge_id = ?',
      [userId, badgeId]
    );
    if (existing.length > 0) return false;
    await connection.execute(
      'INSERT INTO user_badges (user_id, badge_id) VALUES (?, ?)',
      [userId, badgeId]
    );
    console.log('Badge ' + badgeId + ' awarded to ' + userId);
    return true;
  } catch (err) {
    console.error('Badge award failed:', err);
    return false;
  }
}

async function checkFirstBid(connection, taskerId) {
  const [rows] = await connection.execute(
    'SELECT COUNT(*) as c FROM bids WHERE tasker_id = ?',
    [taskerId]
  );
  return Number(rows[0].c) === 1;
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  let connection;
  try {
    const body = JSON.parse(event.body);
    const { quest_id, tasker_id, amount } = body;

    if (!quest_id || !tasker_id || amount === undefined) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing required fields' }) };
    }

    connection = await mysql.createConnection({
      host: process.env.TIDB_HOST,
      user: process.env.TIDB_USER,
      password: process.env.TIDB_PASSWORD,
      database: process.env.TIDB_DATABASE,
      port: process.env.TIDB_PORT || 4000,
      ssl: { rejectUnauthorized: true }
    });

    const [quests] = await connection.execute(
      'SELECT status FROM quests WHERE id = ?',
      [quest_id]
    );
    if (quests.length === 0 || quests[0].status !== 'OPEN') {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Quest not available' }) };
    }

    const bidId = randomUUID();
    await connection.execute(
      'INSERT INTO bids (id, quest_id, tasker_id, amount, status, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [bidId, quest_id, tasker_id, amount, 'PENDING']
    );

    const isFirstBid = await checkFirstBid(connection, tasker_id);
    if (isFirstBid) {
      await awardBadgeIfNotExists(connection, tasker_id, 'first_bid');
    }

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ id: bidId, message: 'Bid placed successfully' })
    };

  } catch (err) {
    console.error('Error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  } finally {
    if (connection) await connection.end();
  }
};
