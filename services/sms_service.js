// import twilio from 'twilio';
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken =  process.env.TWILIO_AUTH_TOKEN;
// const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

// const client = new twilio(accountSid, authToken);


// export const sendSMS = (to, message) => {
  //   client.messages
  //     .create({
    //       body: message,
    //       from: twilioPhone,
    //       to: to              // Recipient's phone number in E.164 format, e.g., +1234567890
    //     })
    //     .then(message => console.log(`Message sent with SID: ${message.sid}`))
    //     .catch(err => console.error('Failed to send message:', err));
    // }
    
    // Example usage
    // sendSMS('+2348062254916', 'Hi Tolaaaaaniiiiiiiiii');
    
import dotenv from 'dotenv';
import axios from 'axios';
import qs from 'qs';
// const axios = require('axios');
// const qs = require('qs');
dotenv.config();

const kudiToken = process.env.KUDI_SMS_TOKEN;


export const sendWhatsApp = (guest) => {
  let data = qs.stringify({
    'token': kudiToken,
    'recipient': guest.phone,
    'template_code': '58303363',
    'parameters': guest.name+', '+guest.guestId+', '+guest.profileUrl,
    'button_parameters': '',
    'header_parameters': '' 
  });
  
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://my.kudisms.net/api/whatsapp',
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data : data
  };
  
  axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });
}


// sendWhatsApp(null);