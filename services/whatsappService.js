const dotenv = require('dotenv');
const axios = require('axios');
// const QRCode = require('qrcode');


dotenv.config();

const WHATSAPP_API_URL = 'https://graph.facebook.com/v22.0';
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

exports.sendApprovalMessage = async (guest) => {

  console.log('Sending WhatsApp message to:', guest);
  try {
    const payload = {
      messaging_product: 'whatsapp',
      to: guest.phone,
      type: 'template',
      template: {
        name: 'guest_approval_template',  // Replace with your template name
        language: { code: 'en' },
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: guest.name },
              { type: 'text', text: guest.profileUrl },
            ]
          }
        //   {
        //     type: 'image',
        //     image: {
        //       link: qrDataURL
        //     }
        //   }
        ]
      }
    };

    const response = await axios.post(
      `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ WhatsApp message sent:', response.data);
  } catch (err) {
    console.error('❌ Error sending WhatsApp message:', err.response?.data || err.message);
  }
};

exports.sendRSVPCreationMessage = async (guest) => {

  console.log('Sending RSVP message to:', guest);

  const template = guest.attendingStatus === 'no'? 'rsvp_creation_rejection' : 'rsvp_creation_confirmation';

  try {
    const payload = {
      messaging_product: 'whatsapp',
      to: guest.phone,
      type: 'template',
      template: {
        name: template,  // Use the appropriate template name
        language: { code: 'en_US' },
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: guest.name }
            ]
          }
        ]
      }
    };

    const response = await axios.post(
      `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ WhatsApp message sent:', response.data);
  } catch (err) {
    console.error('❌ Error sending WhatsApp message:', err.response?.data || err.message);
  }
};