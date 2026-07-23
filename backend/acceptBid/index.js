const mysql = require('mysql2/promise');

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
    const { quest_id, bid_id } = body;

    if (!quest_id || !bid_id) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing quest_id or bid_id' }) };
    }

    connection = await mysql.createConnection({
      host: process.env.TIDB_HOST,
      user: process.env.TIDB_USER,
      password: process.env.TIDB_PASSWORD,
      database: process.env.TIDB_DATABASE,
      port: process.env.TIDB_PORT || 4000,
      ssl: { rejectUnauthorized: true }
    });

    await connection.beginTransaction();

    const [bids] = await connection.execute(
      'SELECT tasker_id FROM bids WHERE id = ? AND quest_id = ?',
      [bid_id, quest_id]
    );
    if (bids.length === 0) {
      await connection.rollback();
      return { statusCode: 404, headers, body: JSON.stringify({ error: 'Bid not found' }) };
    }
    const taskerId = bids[0].tasker_id;

    const [quests] = await connection.execute(
      'SELECT poster_id FROM quests WHERE id = ? AND status = ?',
      [quest_id, 'OPEN']
    );
    if (quests.length === 0) {
      await connection.rollback();
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Quest not found or not open' }) };
    }
    const requesterId = quests[0].poster_id;

    await connection.execute(
      'UPDATE quests SET status = ? WHERE id = ?',
      ['IN_PROGRESS', quest_id]
    );

    await connection.execute(
      'UPDATE bids SET status = ? WHERE id = ?',
      ['ACCEPTED', bid_id]
    );

    await connection.execute(
      'UPDATE bids SET status = ? WHERE quest_id = ? AND id != ?',
      ['REJECTED', quest_id, bid_id]
    );

    await connection.commit();

    await awardBadgeIfNotExists(connection, requesterId, 'deal_maker');
    await awardBadgeIfNotExists(connection, taskerId, 'deal_maker');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Bid accepted, quest started' })
    };

  } catch (err) {
    if (connection) await connection.rollback();
    console.error('Error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  } finally {
    if (connection) await connection.end();
  }
};
