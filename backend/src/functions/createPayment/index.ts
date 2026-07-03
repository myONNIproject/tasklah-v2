import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import Stripe from 'stripe';

// Initialize Stripe with your Secret Key (Passed in via environment variables later)
// ⚠️ We use a dummy key here for the prototype so it won't crash if the env var is missing
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key', {
  apiVersion: '2026-04-22.dahlia', // Updated to match your newly installed Stripe SDK!
});

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // CORS Headers are required for React to talk to AWS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  };

  try {
    if (!event.body) {
      return { statusCode: 400, headers, body: JSON.stringify({ message: "Missing request body" }) };
    }

    const data = JSON.parse(event.body);
    
    // Convert bounty to cents (Stripe requires amounts in the smallest currency unit)
    // E.g., $50.00 SGD = 5000 cents
    const amountInCents = Math.round(data.bounty * 100);

    // Create the PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'sgd',
      // For a marketplace, we capture later when the task is completed
      capture_method: 'manual', 
      metadata: {
        taskTitle: data.title,
        posterId: data.posterId,
      },
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
      }),
    };

  } catch (error) {
    console.error("Stripe Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Failed to create payment intent." }),
    };
  }
};
