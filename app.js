const express = require("express");
const axios = require('axios');
const cors = require("cors");

const app = express();
const port = 3200;

app.use(cors());

let connectionIdGlobal = "";
console.log("Connection ID Global", connectionIdGlobal);

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
    console.log("Response output", invitation);

    connectionIdGlobal = responseCreateInvitation.data.connection_id;

    // Step 5: Configure an HTTP POST request to receive the invitation
    const receiveInvitationConfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:8041/connections/receive-invitation',
      headers: {
        'Content-Type': 'application/json',
      },
      data: invitation,
    };

    // Step 6: Send the request to receive the invitation
    const receiveInvitationResponse = await axios.request(receiveInvitationConfig);
    console.log("Receive Invitation Response", receiveInvitationResponse.data);

    // Step 7: Return the response body from the /create-invitation endpoint
    res.json(receiveInvitationResponse.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get("/hardcoded-connection-msg", async (req, res) => {

  const axios = require('axios');
  let data = JSON.stringify({
    content: req.query.messageContent || "SELECT D.* FROM DUAL D;",
  });
  console.log("Data:", data);
  
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `http://localhost:8021/connections/${connectionIdGlobal}/send-message`,
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };
  
  const response = await axios.request(config);
  console.log("Response", response.data);
  res.json(response.data);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
