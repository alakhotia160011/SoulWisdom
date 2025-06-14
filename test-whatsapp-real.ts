import twilio from 'twilio';

async function testWhatsAppConnection() {
  console.log('Testing Twilio WhatsApp connection...');
  
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;
  const toNumber = process.env.WHATSAPP_ADMIN_NUMBER;
  
  console.log('Account SID format:', accountSid?.substring(0, 4) + '...');
  console.log('From number:', fromNumber);
  console.log('To number:', toNumber);
  
  if (!accountSid || !authToken || !fromNumber || !toNumber) {
    console.error('Missing required environment variables');
    return;
  }
  
  if (!accountSid.startsWith('AC')) {
    console.error('Account SID must start with "AC"');
    console.log('Current Account SID starts with:', accountSid.substring(0, 4));
    return;
  }
  
  try {
    const client = twilio(accountSid, authToken);
    
    const message = await client.messages.create({
      body: '🙏 Hello! Your spiritual lessons WhatsApp integration is now active. You will receive daily lessons at 7 AM EST.\n\nTry sending "today" to get today\'s lesson!',
      from: `whatsapp:${fromNumber}`,
      to: `whatsapp:${toNumber}`
    });
    
    console.log('✓ WhatsApp test message sent successfully!');
    console.log('Message SID:', message.sid);
    console.log('Status:', message.status);
    
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
  }
}

testWhatsAppConnection();