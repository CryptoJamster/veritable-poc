const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 1081;

const payloadsDir = "bob_payloads";

// Ensure the "bob_payloads" directory exists, create it if it doesn't
if (!fs.existsSync(payloadsDir)) {
  fs.mkdirSync(payloadsDir);
}

// Ensure the "payload.txt" file exists with initial content, create it if it doesn't
const initialPayloadContent = 'Welcome!';
const filePath = path.join(payloadsDir, 'payload.txt');
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, initialPayloadContent + '\n');
}

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Define a route that listens for HTTP POST requests to /topic/:topic
app.post("/topic/:topic", async (req, res) => {
  try {
    // Extract the topic and payload from the request
    const { topic } = req.params;
    const payload = req.body;

    // Log specific parts of the request for better visibility
    console.log("Received POST request:");
    console.log("Headers:", req.headers);
    console.log("Params:", req.params);
    console.log("Body:", req.body);

    // Log information about the received request
    if (topic == 'basicmessages') {
      console.log(`Received POST request to /topic/${topic}`);
      console.log("Payload:", payload);

      // Check if the payload has content of type string
      if (payload && typeof payload.content === 'string') {
        // Log information about the file being written
        console.log(`File written to: ${filePath}`);

        try {
          // Append the payload content to the file
          fs.writeFileSync(filePath, payload.content + '\n');
          console.log(`File appended to: ${filePath}`);
        } catch (error) {
          // Handle errors if there's an issue writing to the file
          console.error("Error writing to file:", error);
          res.status(500).send("Error writing to file");
        }
      }
    }

    // Send a successful response to the client
    res.status(200).send("Webhook received");
  } catch (error) {
    // Handle errors if there's an issue processing the request
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
