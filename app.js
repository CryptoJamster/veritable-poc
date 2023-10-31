const express = require("express");
const axios = require('axios');
const cors = require("cors");

const app = express();
const port = 3200;

app.use(cors());

app.get("/create-invitation", async (req, res) => {
  try {
    // Step 1: Create an empty JSON object as the request data
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
    const responseCreateInvitation = await axios.request(configCreateInvitation);
    console.log("Response output", responseCreateInvitation.data);

    // Step 4: Extract the "invitation" and "connection_id" from the response
    const invitation = responseCreateInvitation.data.invitation;
    const connectionId = responseCreateInvitation.data.connection_id;

    // Step 5: Configure an HTTP POST request to receive the invitation
    const receiveInvitationConfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:8041/connections/receive-invitation',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(invitation),
    };

    // Step 6: Send the request to receive the invitation
    const receiveInvitationResponse = await axios.request(receiveInvitationConfig);
    console.log("Receive Invitation Response", receiveInvitationResponse.data);

    // Step 7: Construct the URL for the send-message endpoint
    const sendMessageUrl = `http://localhost:8021/connections/${connectionId}/send-message`;
    
    // Step 8: Use the query parameter or a default message
    const messageContent = req.query.messageContent || "SELECT * FROM DUAL;"; 

    // Step 9: Define the JSON body for the send-message request using the user's input
    const sendMessageBody = {
      content: messageContent,
    };

    // Step 10: Configure an HTTP POST request to send a message to the connection
    const sendMessageConfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: sendMessageUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(sendMessageBody),
    };

    // Step 11: Send the message to the connection
    const sendMessageResponse = await axios.request(sendMessageConfig);
    console.log("Send Message Response", sendMessageResponse.data);

    // Step 12: Return the response body from the /create-invitation endpoint
    res.json(sendMessageResponse.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
