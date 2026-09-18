
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN;
const whatsappToken = process.env.WHATSAPP_TOKEN;


// Webhook Verification (GET)
app.get('/', (req, res) => {
  const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': token } = req.query;

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('WEBHOOK VERIFIED');
    res.status(200).send(challenge);
  } else {
    res.status(403).end();
  }
});

// Incoming Events (POST)
app.post('/', async (req, res) => {
  // Always respond 200 fast so Meta doesn't retry
  res.status(200).end();

  const entry = req.body.entry?.[0]?.changes?.[0]?.value;
  const message = entry?.messages?.[0];

  if (message) {
    const senderId = entry.metadata.phone_number_id;
    const from = message.from;

    console.log(`Received message from ${from}:`, message.text?.body || message.type);

    // Example: Auto-reply with an interactive button message
    try {
      await messageWithInteractiveReply(
        senderId,
        from,
        "Thanks for reaching out! How can we help?",
        "btn_support",
        "Talk to Support"
      );
    } catch (err) {
      console.error('Failed to reply:', err.response?.data || err.message);
    }
  }
});

// WhatsApp API Caller using axios
async function makeApiCall(senderPhoneNumberId, requestBody) {
  const url = `https://graph.facebook.com/v21.0/${senderPhoneNumberId}/messages`;

  const response = await axios.post(url, requestBody, {
    headers: {
      'Authorization': `Bearer ${whatsappToken}`,
      'Content-Type': 'application/json'
    }
  });

  return response.data;
}

// Send Interactive Button Message (Max 3 buttons allowed by WhatsApp)
async function messageWithInteractiveReply(
  senderPhoneNumberId,
  recipientPhoneNumber,
  messageText,
  buttonId = "btn_1",
  buttonLabel = "Reply"
) {
  const requestBody = {
    messaging_product: "whatsapp",
    to: recipientPhoneNumber,
    type: "interactive",
    interactive: {
      type: "button",
      body: {
        text: messageText
      },
      action: {
        buttons: [
          {
            type: "reply",
            reply: {
              id: buttonId,
              title: buttonLabel.slice(0, 20) // Meta 20-character limit
            }
          }
        ]
      }
    }
  };

  return makeApiCall(senderPhoneNumberId, requestBody);
}

app.listen(port, async () => {
  console.log(`Server listening on port ${port}`);

  // Test sending an interactive button message on server boot
  const recipient = "972543599832"; // Must be international format without '+' or leading zeros
  const senderId = process.env.PHONE_ID;

  try {
    console.log(`Attempting to send test interactive message to ${recipient}...`);
    const result = await messageWithInteractiveReply(
      senderId,
      recipient,
      "This is a test interactive message! Click below:",
      "btn_test_1",
      "Confirm Action"
    );
    console.log("Message sent successfully:", result);
  } catch (err) {
    console.error("Failed to send message:", JSON.stringify(err.response?.data || err.message, null, 2));
  }
});