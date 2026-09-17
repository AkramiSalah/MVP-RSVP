// Import Express.js
const express = require('express');

// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Set port and verify_token
const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN;

// Route for GET requests
app.get('/', (req, res) => {
  const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': token } = req.query;

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('WEBHOOK VERIFIED');
    res.status(200).send(challenge);
  } else {
    res.status(403).end();
  }
});

// Route for POST requests
app.post('/', (req, res) => {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log(`\n\nWebhook received ${timestamp}\n`);
  console.log(JSON.stringify(req.body, null, 2));
  res.status(200).end();
});

// Start the server
app.listen(port, () => {
  console.log(`\nListening on port ${port}\n`);
});


const axios = require('axios');

async function sendTestMessage() {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.PHONE_ID;

  const url = `https://graph.facebook.com/v25.0/${phoneNumberId}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    to: "972543599832",
    type: "template",
    template: {
      name: "jaspers_market_order_confirmation_v1",
      language: { code: "en_US" },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: "John Doe" },
            { type: "text", text: "123456" },
            { type: "text", text: "Sep 17, 2026" }
          ]
        }
      ]
    }
  };

  try {
    const response = await axios.post(url, payload, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Success!', response.data);
  } catch (error) {
    console.error('Failed:', error.response?.data || error.message);
  }
}

// Call it to test
sendTestMessage();