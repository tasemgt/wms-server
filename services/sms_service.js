import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken =  process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client = new twilio(accountSid, authToken);


export const sendSMS = (to, message) => {
  client.messages
    .create({
      body: message,
      from: twilioPhone,
      to: to              // Recipient's phone number in E.164 format, e.g., +1234567890
    })
    .then(message => console.log(`Message sent with SID: ${message.sid}`))
    .catch(err => console.error('Failed to send message:', err));
}

// Example usage
// sendSMS('+2348062254916', 'Hi Tolaaaaaniiiiiiiiii');
