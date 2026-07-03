import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  uri: process.env.TIDB_CONNECTION_STRING,
  waitForConnections: true,
  connectionLimit: 5,
  ssl: { rejectUnauthorized: true }
});

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log("getTasks Lambda running - fetching from TiDB");

    const [rows] = await pool.execute(
      `SELECT id, poster_id, title, category, description, bounty, location, status, created_at
       FROM quests
       WHERE status = 'OPEN'
       ORDER BY created_at DESC
       LIMIT 50`
    );

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true"
      },
      body: JSON.stringify({
        tasks: rows
      }),
    };
  } catch (error) {
    console.error("Error fetching tasks from TiDB:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to fetch tasks.", details: String(error) })
    };
  }
};
