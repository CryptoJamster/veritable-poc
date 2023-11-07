const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const axios = require("axios"); // You may need to install this package

const app = express();
const port = 1080;

const payloadsDir = "alice_payloads";

// Ensure the "alice_payloads" directory exists, create it if it doesn't
if (!fs.existsSync(payloadsDir)) {
  fs.mkdirSync(payloadsDir);
}

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Define a route that listens for HTTP POST requests to /topic/:topic
app.post("/topic/:topic", async (req, res) => {
  const { topic } = req.params;
  const payload = req.body;

  console.log(`Received POST request to /topic/${topic}`);
  console.log("Payload:", payload);

  if (payload && typeof payload.content === 'string') {
    const filename = `payload.txt`; // Create the filename
    const filePath = path.join(payloadsDir, filename);

    // Save the payload content to a file
    fs.writeFileSync(filePath, payload.content);

    console.log(`Payload saved to file: ${filename}`);
  }

  res.status(200).send("Webhook received"); // Send a response if needed
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
