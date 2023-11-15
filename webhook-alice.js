const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

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
        // Create a filename and determine the file path
        const filename = `payload.txt`;
        const filePath = path.join(payloadsDir, filename);

        // Log information about the file being written
        console.log(`File written to: ${filePath}`);

        try {
          // Save the payload content to a file
          fs.writeFileSync(filePath, payload.content);
          console.log(`File written to: ${filePath}`);
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

// Define an endpoint for SSE log updates
app.get("/log-sse", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Create a watcher for the log file
  const logFilePath = "./alice_payloads/payload.txt"; // Update with the correct log file path
  const watcher = chokidar.watch(logFilePath);

  // // Send initial log content to the client
  // const initialLogContent = fs.readFileSync(logFilePath, "utf8");
  // const initialLogLines = initialLogContent.split("\n");
  // for (const line of initialLogLines) {
  //   if (line.trim() !== "") {
  //     res.write(`data: ${line}\n\n`);
  //   }
  // }

  // Listen for changes to the log file and send updates over SSE
  watcher.on("change", path => {
    try {
      const logContent = fs.readFileSync(path, "utf8");
      const logLines = logContent.split("\n");
      for (const line of logLines) {
        if (line.trim() !== "") {
          res.write(`data: ${line}\n\n`);
        }
      }
    } catch (error) {
      // Handle the error here, e.g., log it or take appropriate action
      console.error("Error while sending log updates over SSE:", error);
    }
  });
});
