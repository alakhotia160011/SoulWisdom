import twilio from 'twilio';

async function testImgurDirect() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;
  const toNumber = process.env.WHATSAPP_ADMIN_NUMBER;
  
  if (!accountSid || !authToken || !fromNumber || !toNumber) {
    console.error('Missing credentials');
    return;
  }
  
  const client = twilio(accountSid, authToken);
  
  // Test direct Imgur URL
  const imgurDirectUrl = 'https://i.imgur.com/tf8ivY1.jpeg';
  
  console.log('Testing direct Imgur URL:', imgurDirectUrl);
  
  try {
    const message = await client.messages.create({
      body: '🎨 Testing artwork delivery - The Sacred Web of Universal Interconnection',
      mediaUrl: [imgurDirectUrl],
      from: `whatsapp:${fromNumber}`,
      to: `whatsapp:${toNumber}`
    });
    
    console.log('Message sent:', message.sid);
    console.log('Status:', message.status);
    
    // Check status after delay
    setTimeout(async () => {
      const updatedMessage = await client.messages(message.sid).fetch();
      console.log('Final status:', updatedMessage.status);
      console.log('Error code:', updatedMessage.errorCode);
      console.log('Error message:', updatedMessage.errorMessage);
    }, 10000);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testImgurDirect();