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
    if (!event.body) return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing request body" })
    };

    const data = JSON.parse(event.body);
    const { bidId, questId } = data;

    if (!bidId || !questId) return {
      statusCode: 400,
      body: JSON.stringify({ message: "bidId and questId are required" })
    };

    console.log(`Accepting bid ${bidId} for quest ${questId}`);

    // Run both updates in a transaction so they succeed or fail together
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // 1. Accept the chosen bid
      await conn.execute(
        `UPDATE bids SET status = 'ACCEPTED' WHERE id = ? AND quest_id = ?`,
        [bidId, questId]
      );

      // 2. Reject all other bids on the same quest
      await conn.execute(
        `UPDATE bids SET status = 'REJECTED' WHERE quest_id = ? AND id != ?`,
        [questId, bidId]
      );

      // 3. Flip the quest status to IN_PROGRESS
      await conn.execute(
        `UPDATE quests SET status = 'IN_PROGRESS' WHERE id = ?`,
        [questId]
      );

      await conn.commit();
    } catch (txError) {
      await conn.rollback();
      throw txError;
    } finally {
      conn.release();
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true"
      },
      body: JSON.stringify({
        message: "Bid accepted! Quest is now IN_PROGRESS.",
        bidId,
        questId,
        status: "IN_PROGRESS"
      }),
    };
  } catch (error) {
    console.error("Error accepting bid:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to accept bid", details: String(error) })
    };
  }
};
