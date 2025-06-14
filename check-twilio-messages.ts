import twilio from 'twilio';

async function checkTwilioMessages() {
  try {
    console.log('Checking Twilio message history for today...');
    
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!
    );
    
    // Get today's date in UTC
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const messages = await client.messages.list({
      dateSent: today,
      limit: 20
    });
    
    console.log(`Found ${messages.length} messages sent today (${today.toDateString()}):`);
    
    if (messages.length === 0) {
      console.log('✓ No messages sent today - you have your full 9 message quota available');
    } else {
      messages.forEach((message, index) => {
        console.log(`${index + 1}. ${message.sid} - ${message.direction} - ${message.status}`);
        console.log(`   From: ${message.from}`);
        console.log(`   To: ${message.to}`);
        console.log(`   Date: ${message.dateSent}`);
        console.log(`   Body: ${message.body?.substring(0, 100)}...`);
        console.log('');
      });
    }
    
    // Test a simple message send
    console.log('Testing message send capability...');
    const testMessage = await client.messages.create({
      body: '🌅 Test message from SoulWisdom - checking WhatsApp connectivity',
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: process.env.WHATSAPP_ADMIN_NUMBER!
    });
    
    console.log(`✓ Test message sent successfully: ${testMessage.sid}`);
    
  } catch (error: any) {
    if (error.code === 63038) {
      console.log('❌ Daily message limit reached (this might be from yesterday\'s messages)');
    } else {
      console.error('Error checking messages:', error);
    }
  }
}

checkTwilioMessages();