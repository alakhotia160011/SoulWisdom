import twilio from 'twilio';

async function configureWhatsAppWebhook() {
  try {
    console.log('Configuring WhatsApp webhook...');
    
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const replitUrl = `https://${process.env.REPL_ID}.replit.app`;
    
    if (!accountSid || !authToken) {
      console.error('Missing Twilio credentials');
      return;
    }
    
    const client = twilio(accountSid, authToken);
    const webhookUrl = `${replitUrl}/webhook/whatsapp`;
    
    console.log(`Webhook URL: ${webhookUrl}`);
    
    // Get the WhatsApp sandbox configuration
    try {
      const sandboxes = await client.messaging.v1.services.list({ limit: 10 });
      console.log(`Found ${sandboxes.length} messaging services`);
      
      if (sandboxes.length > 0) {
        const service = sandboxes[0];
        console.log(`Service SID: ${service.sid}`);
        
        // Update the webhook URL for the service
        await client.messaging.v1.services(service.sid).update({
          inboundRequestUrl: webhookUrl,
          fallbackUrl: webhookUrl
        });
        
        console.log('✓ Webhook URL configured successfully');
      }
    } catch (error) {
      console.log('Service configuration method failed, trying direct approach...');
    }
    
    // Alternative: Configure via phone number
    try {
      const phoneNumbers = await client.incomingPhoneNumbers.list({ limit: 10 });
      console.log(`Found ${phoneNumbers.length} phone numbers`);
      
      for (const number of phoneNumbers) {
        if (number.phoneNumber.includes('whatsapp') || number.capabilities.sms) {
          console.log(`Updating webhook for ${number.phoneNumber}`);
          
          await client.incomingPhoneNumbers(number.sid).update({
            smsUrl: webhookUrl,
            smsMethod: 'POST'
          });
          
          console.log(`✓ Updated webhook for ${number.phoneNumber}`);
        }
      }
    } catch (error) {
      console.log('Phone number configuration failed:', error.message);
    }
    
    console.log('\n--- Manual Configuration Required ---');
    console.log('Go to your Twilio Console:');
    console.log('1. Visit: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn');
    console.log('2. Click "Sandbox settings"');
    console.log(`3. Set webhook URL to: ${webhookUrl}`);
    console.log('4. Set HTTP method to: POST');
    console.log('5. Save the configuration');
    
  } catch (error) {
    console.error('Error configuring webhook:', error);
  }
}

configureWhatsAppWebhook();