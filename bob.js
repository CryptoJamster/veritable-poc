// Import required packages
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

// Create an Express application
const app = express();
const port = 3201;

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Route for serving your HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/bob.html'));
});

// Serve the bob.js file with the appropriate Content-Type
app.get('/bob.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'bob.js'));
  res.setHeader('Content-Type', 'text/javascript');
});

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Enable JSON Body Parser
app.use(bodyParser.json());

// Define an endpoint to send a message
app.get("/send-message", async (req, res) => {
  try {
    // Step 10: Prepare the message content
    const messageContent = req.query.messageContent;

    if (!messageContent || messageContent.trim() === "") {
      return res.status(400).send('Message content cannot be blank.');
    }

    let data = JSON.stringify({
      content: messageContent,
    });
    console.log("Message content", data);

    // Step 11: Retrieve the latest connection from the /connections/ endpoint
    const connectionsResponse = await axios.get('http://localhost:8041/connections');

    // Step 12: Extract the connection_id from the last connection in the results array
    const results = connectionsResponse.data.results;

    if (!results || results.length === 0) {
      return res.status(500).send('No connections found in the latest response.');
    }

    const latestConnection = results[results.length - 1];
    const connectionId = latestConnection.connection_id;

    console.log("Connection ID", connectionId);

    // Step 13: Configure an HTTP POST request to send the message
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `http://localhost:8041/connections/${connectionId}/send-message`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    // Step 14: Send the message and handle the response
    const response = await axios.request(config);
    console.log("Send message response", response.data);

    // Step 15: Return the response data
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

// Define an endpoint to retrieve the latest message
app.get("/get-latest-message", async (req, res) => {
  try {
    // Step 1: Read the contents of the file created by webhook-bob.js
    const content = fs.readFileSync("bob_payloads/payload.txt", "utf8");

    // Step 5: Return the content as a response
    res.status(200).send(content);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
