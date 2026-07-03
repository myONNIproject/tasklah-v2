import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';

// Initialize the DynamoDB Client (Connects to ap-southeast-1 by default)
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// The name of our table (Terraform will create this for us later)
const TABLE_NAME = process.env.TASKS_TABLE_NAME || 'TaskLah_Tasks';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // 1. Check if the frontend actually sent data
    if (!event.body) {
      return { statusCode: 400, body: JSON.stringify({ message: "Missing request body" }) };
    }

    // 2. Parse the data sent from your React app
    const data = JSON.parse(event.body);

    // 3. Construct the item to save in the database
    const newTask = {
      id: uuidv4(), // Generate a unique ID (e.g., tk-8f7d6s...)
      title: data.title,
      category: data.category,
      bounty: data.bounty,
      location: data.location,
      status: 'OPEN',
      posterId: data.posterId || 'anonymous',
      createdAt: new Date().toISOString(), // Timestamp
      // We start trust score neutral
      posterTrustScore: 3.0, 
    };

    // 4. Send the command to AWS DynamoDB
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: newTask,
    });

    await docClient.send(command);

    // 5. Tell the React app it was successful!
    return {
      statusCode: 201,
      // We must include CORS headers so the frontend is allowed to talk to this API
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        message: "Task successfully posted to TaskLah network!",
        task: newTask
      }),
    };

  } catch (error) {
    console.error("Error saving task:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to create task in DynamoDB." }),
    };
  }
};
