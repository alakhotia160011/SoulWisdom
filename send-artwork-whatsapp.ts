import twilio from 'twilio';

async function sendArtworkToWhatsApp() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;
  const toNumber = process.env.WHATSAPP_ADMIN_NUMBER;
  
  if (!accountSid || !authToken || !fromNumber || !toNumber) {
    console.error('Missing credentials');
    return;
  }
  
  const client = twilio(accountSid, authToken);
  
  try {
    // Send artwork with proper direct image URL
    const artworkMessage = await client.messages.create({
      body: '🎨 Today\'s Spiritual Artwork: "The Sacred Web of Universal Interconnection"\n\nThis artwork depicts the cosmic web of interconnection with Om symbol, lotus flowers, sacred geometry, and diverse life forms in harmony.',
      mediaUrl: ['https://i.imgur.com/tf8ivY1.jpeg'],
      from: `whatsapp:${fromNumber}`,
      to: `whatsapp:${toNumber}`
    });
    
    console.log('Artwork message sent:', artworkMessage.sid);
    console.log('Status:', artworkMessage.status);
    
  } catch (error) {
    console.error('Error sending artwork:', error);
  }
}

sendArtworkToWhatsApp();