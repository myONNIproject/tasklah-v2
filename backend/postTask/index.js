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

async function checkFirstQuest(connection, requesterId) {
  const [rows] = await connection.execute(
    'SELECT COUNT(*) as c FROM quests WHERE poster_id = ?',
    [requesterId]
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
    const { title, description, category, budget, requester_id } = body;

    if (!title || !requester_id) {
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

    const questId = randomUUID();
    await connection.execute(
      'INSERT INTO quests (id, title, description, category, bounty, poster_id, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
      [questId, title, description || null, category || null, budget || null, requester_id, 'OPEN']
    );

    const isFirstQuest = await checkFirstQuest(connection, requester_id);
    if (isFirstQuest) {
      await awardBadgeIfNotExists(connection, requester_id, 'first_quest');
    }

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ id: questId, message: 'Quest created successfully' })
    };

  } catch (err) {
    console.error('Error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  } finally {
    if (connection) await connection.end();
  }
};
