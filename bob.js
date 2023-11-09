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

// Serve the alice.js file with the appropriate Content-Type
app.get('/bob.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'bob.js'));
  res.setHeader('Content-Type', 'text/javascript');
});

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Enable JSON Body Parser
app.use(bodyParser.json());

// Global variables to store data
let responseCreateInvitationGlobal = "";
let invitationBodyGlobal = "";
let connectionIdGlobal = "";

// Define an endpoint to create an invitation
app.get("/create-invitation", async (req, res) => {
  try {
    // Step 1: Prepare an empty JSON object as the request data
    const data = JSON.stringify({});

    // Step 2: Configure an HTTP POST request to create an invitation
    const configCreateInvitation = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:8041/connections/create-invitation',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };
    console.log("Invitation message", configCreateInvitation);

    // Step 3: Send the request to create an invitation
    responseCreateInvitationGlobal = await axios.request(configCreateInvitation);
    console.log("Invitation response", responseCreateInvitationGlobal.data);

    // Step 4: Extract the invitation from the response
    invitationBodyGlobal = responseCreateInvitationGlobal.data.invitation;
    console.log("Invitation body", invitationBodyGlobal);

    // Step 5: Return the response data
    res.json(responseCreateInvitationGlobal.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Define an endpoint to receive an invitation
app.get("/receive-invitation", async (req, res) => {
  try {
    // Step 6: Check if an invitation is available
    if (!invitationBodyGlobal) {
      // Handle the case where invitationBodyGlobal is not set
      res.status(500).json({ error: 'Invitation data is not available.' });
      return;
    }

    // Step 7: Configure an HTTP POST request to receive the invitation
    const receiveInvitationConfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:8021/connections/receive-invitation',
      headers: {
        'Content-Type': 'application/json',
      },
      data: invitationBodyGlobal,
    };

    // Step 8: Send the request to receive the invitation
    const receiveInvitationResponse = await axios.request(receiveInvitationConfig);
    console.log("Accept invitation response", receiveInvitationResponse.data);

    // Step 9: Return the response data
    res.json(receiveInvitationResponse.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

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

    // Step 11: Retrieve the connection ID from the global variable
    connectionIdGlobal = responseCreateInvitationGlobal.data.connection_id;
    console.log("Connection ID", connectionIdGlobal);

    // Step 12: Configure an HTTP POST request to send the message
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `http://localhost:8041/connections/${connectionIdGlobal}/send-message`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    // Step 13: Send the message and handle the response
    const response = await axios.request(config);
    console.log("Send message response", response.data);

    // Step 14: Return the response data
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

// Define an endpoint to retrieve the latest message
app.get("/get-latest-message", (req, res) => {
  try {
    // Step 1: Read the contents of the file created by webhook-bob.js
    const content = fs.readFileSync("bob_payloads/payload.txt", "utf8");

    // Step 2: Return the content as a response
    res.status(200).send(content);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
