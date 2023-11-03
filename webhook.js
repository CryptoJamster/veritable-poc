const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");

const app = express();
const port = 1080;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Define a route that listens for HTTP POST requests to /topic/:topic
app.post("/topic/:topic", (req, res) => {
  const { topic } = req.params;
  const payload = req.body;

  console.log(`Received POST request to /topic/${topic}`);
  console.log("Payload:", payload);

  if (payload && typeof payload.content === 'string') {
    // Save the payload content to a file
    fs.writeFileSync("payload.txt", payload.content);

    console.log("Payload saved to file: payload.txt");
  }

  res.status(200).send("Webhook received"); // Send a response if needed
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
