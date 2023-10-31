// Import necessary libraries and modules
const express = require("express"); // For creating the Express app
const axios = require('axios');     // For making HTTP requests
const cors = require("cors");       // For enabling Cross-Origin Resource Sharing (CORS)

// Create an Express application
const app = express();
const port = 3200; // Define the port where the server will listen

// Enable CORS for all routes to allow requests from other origins
app.use(cors());

// Define a route that responds to HTTP GET requests at "/create-invitation"
app.get("/create-invitation", async (req, res) => {
  try {
    // Create an empty JSON object as the request data
    const data = JSON.stringify({});

    // Log the request data
    console.log("Data output", data);

    // Configure an HTTP POST request
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:8021/connections/create-invitation',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    // Log the request configuration
    console.log("Config output", config);

    // Send the HTTP request and await the response
    const response = await axios.request(config);

    // Log the response data
    console.log("Response output", response.data);

    // Extract the "connection_id" from the response and send it as a JSON response
    const connectionId = response.data.connection_id;
    res.json({ connection_id: connectionId });
  } catch (error) {
    // Handle errors: log the error and send a 500 Internal Server Error response
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the Express server and log the server's address and port
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
