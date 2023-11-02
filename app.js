// Import required packages
const express = require("express");
const axios = require('axios');
const cors = require("cors");

// Create an Express application
const app = express();
const port = 3200;

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Global variables to store data
let responseCreateInvitationGlobal = "";
let invitationBodyGlobal = "";
let connectionIdGlobal = "";

// Define an endpoint to create an invitation
app.get("/create-invitation", async (req, res) => {
  try {
    // Step 1: Prepare an empty JSON object as the request data
    const data = JSON.stringify({});
    console.log("Data output", data);

    // Step 2: Configure an HTTP POST request to create an invitation
    const configCreateInvitation = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:8021/connections/create-invitation',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };
    console.log("Config output", configCreateInvitation);

    // Step 3: Send the request to create an invitation
    responseCreateInvitationGlobal = await axios.request(configCreateInvitation);
    console.log("Create invitation response", responseCreateInvitationGlobal.data);

    // Step 4: Extract the invitation from the response
    invitationBodyGlobal = responseCreateInvitationGlobal.data.invitation;
    console.log("Invitation body response", invitationBodyGlobal);

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
      url: 'http://localhost:8041/connections/receive-invitation',
      headers: {
        'Content-Type': 'application/json',
      },
      data: invitationBodyGlobal,
    };

    // Step 8: Send the request to receive the invitation
    const receiveInvitationResponse = await axios.request(receiveInvitationConfig);
    console.log("Receive invitation response", receiveInvitationResponse.data);

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
    let data = JSON.stringify({
      content: req.query.messageContent || "SELECT D.* FROM DUAL D;",
    });
    console.log("Data:", data);

    // Step 11: Retrieve the connection ID from the global variable
    connectionIdGlobal = responseCreateInvitationGlobal.data.connection_id;

    // Step 12: Configure an HTTP POST request to send the message
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `http://localhost:8021/connections/${connectionIdGlobal}/send-message`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    // Step 13: Send the message and handle the response
    const response = await axios.request(config);
    console.log("Response", response.data);

    // Step 14: Return the response data
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
