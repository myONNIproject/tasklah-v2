/**
 * TaskLah! API Service Layer
 * This is the bridge to your AWS API Gateway.
 */

const API_BASE_URL = import.meta.env.VITE_AWS_API_URL || 'https://placeholder-api.tasklah.sg';

export const taskService = {
  // Fetch tasks from DynamoDB (via Lambda)
  getTasks: async () => {
    // For now, this returns a promise that resolves to our sample data
    // In production, this will be: await fetch(`${API_BASE_URL}/tasks`)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: '1', title: "Deliver 2x Chicken Rice", price: 25, cat: "Delivery" },
          { id: '2', title: "Assemble IKEA Bed", price: 60, cat: "Home" }
        ]);
      }, 500);
    });
  },

  // Post a new task to DynamoDB
  createTask: async (taskData: any) => {
    console.log("SYNCING WITH AP-SOUTHEAST-1...", taskData);
    // This is where the "Red Line" moderation happens in the cloud
    return { status: 'success', taskId: Math.random().toString(36).substr(2, 9) };
  }
};
