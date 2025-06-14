import twilio from 'twilio';

async function debugWhatsAppConfiguration() {
  console.log('Debugging WhatsApp configuration...');
  
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;
  const toNumber = process.env.WHATSAPP_ADMIN_NUMBER;
  
  console.log('Environment variables:');
  console.log('- Account SID:', accountSid?.substring(0, 8) + '...');
  console.log('- From number:', fromNumber);
  console.log('- To number:', toNumber);
  
  if (!accountSid || !authToken || !fromNumber || !toNumber) {
    console.error('Missing required environment variables');
    return;
  }
  
  try {
    const client = twilio(accountSid, authToken);
    
    // Check account information
    console.log('\nChecking account information...');
    const account = await client.api.accounts(accountSid).fetch();
    console.log('Account status:', account.status);
    console.log('Account type:', account.type);
    
    // List phone numbers
    console.log('\nListing phone numbers...');
    const phoneNumbers = await client.incomingPhoneNumbers.list();
    phoneNumbers.forEach(number => {
      console.log(`- ${number.phoneNumber} (${number.capabilities})`);
    });
    
    // Check message history
    console.log('\nChecking recent messages...');
    const messages = await client.messages.list({ limit: 5 });
    messages.forEach(message => {
      console.log(`Message ${message.sid}:`);
      console.log(`  From: ${message.from}`);
      console.log(`  To: ${message.to}`);
      console.log(`  Status: ${message.status}`);
      console.log(`  Error: ${message.errorCode || 'None'}`);
      console.log(`  Date: ${message.dateCreated}`);
      console.log('---');
    });
    
    // Try sending a simple test message
    console.log('\nSending simple test message...');
    const testMessage = await client.messages.create({
      body: 'Test message from spiritual lessons app - please confirm receipt',
      from: `whatsapp:${fromNumber}`,
      to: `whatsapp:${toNumber}`
    });
    
    console.log('Test message sent:');
    console.log('- Message SID:', testMessage.sid);
    console.log('- Status:', testMessage.status);
    console.log('- To:', testMessage.to);
    console.log('- From:', testMessage.from);
    
    // Wait and check message status
    setTimeout(async () => {
      try {
        const updatedMessage = await client.messages(testMessage.sid).fetch();
        console.log('\nMessage status update:');
        console.log('- Status:', updatedMessage.status);
        console.log('- Error code:', updatedMessage.errorCode || 'None');
        console.log('- Error message:', updatedMessage.errorMessage || 'None');
      } catch (error) {
        console.error('Error checking message status:', error);
      }
    }, 5000);
    
  } catch (error) {
    console.error('Error in WhatsApp debugging:', error);
  }
}

debugWhatsAppConfiguration();