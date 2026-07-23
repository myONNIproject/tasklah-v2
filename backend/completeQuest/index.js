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

async function checkKiasuKompromise(connection, taskerId) {
  const [rows] = await connection.execute(
    'SELECT COUNT(*) as c FROM bids b JOIN quests q ON b.quest_id = q.id WHERE b.tasker_id = ? AND b.status = ? AND q.status = ?',
    [taskerId, 'ACCEPTED', 'COMPLETED']
  );
  return Number(rows[0].c) === 1;
}

async function checkTaskMaster(connection, taskerId) {
  const [rows] = await connection.execute(
    'SELECT COUNT(*) as c FROM bids b JOIN quests q ON b.quest_id = q.id WHERE b.tasker_id = ? AND b.status = ? AND q.status = ?',
    [taskerId, 'ACCEPTED', 'COMPLETED']
  );
  return Number(rows[0].c) >= 5;
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
    const { quest_id } = body;

    if (!quest_id) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing quest_id' }) };
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

    const [quests] = await connection.execute(
      'SELECT id FROM quests WHERE id = ? AND status = ?',
      [quest_id, 'IN_PROGRESS']
    );
    if (quests.length === 0) {
      await connection.rollback();
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Quest not in progress' }) };
    }

    await connection.execute(
      'UPDATE quests SET status = ? WHERE id = ?',
      ['COMPLETED', quest_id]
    );

    const [bids] = await connection.execute(
      'SELECT tasker_id FROM bids WHERE quest_id = ? AND status = ?',
      [quest_id, 'ACCEPTED']
    );

    await connection.commit();

    if (bids.length > 0) {
      const taskerId = bids[0].tasker_id;

      const isFirstCompletion = await checkKiasuKompromise(connection, taskerId);
      if (isFirstCompletion) {
        await awardBadgeIfNotExists(connection, taskerId, 'kiasu_kompromise');
      }

      const isTaskMaster = await checkTaskMaster(connection, taskerId);
      if (isTaskMaster) {
        await awardBadgeIfNotExists(connection, taskerId, 'task_master');
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Quest completed successfully' })
    };

  } catch (err) {
    if (connection) await connection.rollback();
    console.error('Error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  } finally {
    if (connection) await connection.end();
  }
};
