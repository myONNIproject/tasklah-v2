import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: "ap-southeast-1" });

export const handler = async (event: any) => {
  try {
    // 1. Safely parse the body
    let body = {};
    if (event.body) {
      body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    }
    const userMessage = body.message || "Hello";

    // 2. Format the payload specifically for Claude 3 Sonnet
    const payload = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 1000,
      system: "You are ONNI, the helpful AI mascot for TaskLah! a gamified task marketplace in Singapore. Use a tiny bit of friendly Singlish.",
      messages: [
        {
          role: "user",
          content: [{ type: "text", text: userMessage }]
        }
      ]
    };

        const command = new InvokeModelCommand({
      // We MUST use the APAC inference profile ID to bypass the AWS restriction
      modelId: "apac.anthropic.claude-3-sonnet-20240229-v1:0", 
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(payload),
    });


    const response = await client.send(command);
    
    // 3. Safely decode the response
    const decodedBody = new TextDecoder().decode(response.body);
    const responseBody = JSON.parse(decodedBody);
    
    // Claude 3 returns text inside content[0].text
    const replyText = responseBody.content?.[0]?.text || "Sorry, I couldn't formulate a response.";

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ reply: replyText }),
    };

  } catch (error: any) {
    console.error("Bedrock Full Error:", error);
    
    // Return the actual error message to the frontend so we can debug it!
    return {
      statusCode: 200, // Keep 200 so the frontend can read the error JSON
      headers: { 
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        reply: `Bedrock Error: ${error.message || "Unknown error occurred inside Lambda"}` 
      }),
    };
  }
};
