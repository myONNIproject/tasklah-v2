import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  uri: process.env.TIDB_CONNECTION_STRING,
  waitForConnections: true,
  connectionLimit: 5,
  ssl: { rejectUnauthorized: true }
});

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing request body" })
    };

    const data = JSON.parse(event.body);
    const questId = uuidv4();
    const posterId = data.posterId || 'anonymous';

    console.log("TiDB Lambda v2 running - inserting quest:", data.title);

    await pool.execute(
      `INSERT INTO quests (id, poster_id, title, category, description, bounty, location, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'OPEN')`,
      [questId, posterId, data.title, data.category, data.description || '', data.bounty, data.location]
    );

    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true"
      },
      body: JSON.stringify({
        message: "Task successfully posted to TiDB!",
        task: {
          id: questId,
          title: data.title,
          category: data.category,
          bounty: data.bounty,
          location: data.location,
          status: 'OPEN',
          posterId
        }
      }),
    };
  } catch (error) {
    console.error("Error saving task to TiDB:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to create task.", details: String(error) })
    };
  }
};
