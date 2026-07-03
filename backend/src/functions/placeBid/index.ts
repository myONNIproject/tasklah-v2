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
    const { questId, taskerId, amount } = data;

    if (!questId || !taskerId || !amount) return {
      statusCode: 400,
      body: JSON.stringify({ message: "questId, taskerId and amount are required" })
    };

    // Check quest is still OPEN before allowing a bid
    const [quests] = await pool.execute(
      `SELECT id, status FROM quests WHERE id = ? AND status = 'OPEN'`,
      [questId]
    ) as any[];

    if (quests.length === 0) return {
      statusCode: 400,
      body: JSON.stringify({ message: "Quest is not available for bidding" })
    };

    const bidId = uuidv4();

    await pool.execute(
      `INSERT INTO bids (id, quest_id, tasker_id, amount, status)
       VALUES (?, ?, ?, ?, 'PENDING')`,
      [bidId, questId, taskerId, amount]
    );

    console.log(`Bid placed: ${bidId} on quest ${questId} by ${taskerId}`);

    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true"
      },
      body: JSON.stringify({
        message: "Bid placed successfully!",
        bid: { id: bidId, questId, taskerId, amount, status: 'PENDING' }
      }),
    };
  } catch (error: any) {
    // Handle duplicate bid gracefully
    if (error.code === 'ER_DUP_ENTRY') {
      return {
        statusCode: 409,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ message: "You have already placed a bid on this quest" })
      };
    }
    console.error("Error placing bid:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to place bid", details: String(error) })
    };
  }
};
