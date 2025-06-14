const dotenv = require('dotenv');
const twilio = require('twilio');


dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

// console.log(`Twilio Account SID: ${accountSid}`);

const client = new twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

function sendSMS(to, message) {
  client.messages
    .create({
      body: message,
      from: TWILIO_PHONE_NUMBER,
      to: to              // Recipient's phone number in E.164 format, e.g., +1234567890
    })
    .then(message => console.log(`Message sent with SID: ${message.sid}`))
    .catch(err => console.error('Failed to send message:', err));
}

// Example usage
// sendSMS('+447551119360', 'Hello from Node.js and Twilio!');
