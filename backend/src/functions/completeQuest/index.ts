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
    const { questId } = data;

    if (!questId) return {
      statusCode: 400,
      body: JSON.stringify({ message: "questId is required" })
    };

    console.log(`Completing quest ${questId}`);

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // 1. Verify quest is IN_PROGRESS before completing
      const [quests] = await conn.execute(
        `SELECT id, status FROM quests WHERE id = ? AND status = 'IN_PROGRESS'`,
        [questId]
      ) as any[];

      if (quests.length === 0) {
        await conn.rollback();
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Quest is not IN_PROGRESS or does not exist" })
        };
      }

      // 2. Flip quest to COMPLETED
      await conn.execute(
        `UPDATE quests SET status = 'COMPLETED' WHERE id = ?`,
        [questId]
      );

      // 3. Mark the accepted bid as COMPLETED too
      await conn.execute(
        `UPDATE bids SET status = 'COMPLETED' WHERE quest_id = ? AND status = 'ACCEPTED'`,
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
        message: "Quest completed! Escrow released to Tasker.",
        questId,
        status: "COMPLETED"
      }),
    };
  } catch (error) {
    console.error("Error completing quest:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to complete quest", details: String(error) })
    };
  }
};
