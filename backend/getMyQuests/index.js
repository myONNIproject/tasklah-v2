import mysql from 'mysql2/promise';

let connection;

async function getConnection() {
  if (!connection) {
    connection = await mysql.createConnection(process.env.TIDB_CONNECTION_STRING);
  }
  return connection;
}

export const handler = async (event) => {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  const posterId = event.queryStringParameters?.posterId || 'user-123';
  try {
    const conn = await getConnection();
    const [quests] = await conn.execute('SELECT * FROM quests WHERE poster_id = ? ORDER BY id DESC', [posterId]);
    const questsWithBids = await Promise.all(
      quests.map(async (quest) => {
        const [bids] = await conn.execute('SELECT * FROM bids WHERE quest_id = ? ORDER BY amount ASC', [quest.id]);
        return { ...quest, bids };
      })
    );
    return { statusCode: 200, headers, body: JSON.stringify({ quests: questsWithBids }) };
  } catch (error) {
    console.error('Error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to fetch quests', details: error.message }) };
  }
};
