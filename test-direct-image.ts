import { initializeTwilioWhatsApp } from './server/whatsapp-twilio';

async function testDirectImageDelivery() {
  try {
    console.log('Testing direct image delivery to WhatsApp...');
    
    // Use a known working image URL that Twilio can access
    const reliableImageUrls = [
      'https://picsum.photos/800/600.jpg',
      'https://httpbin.org/image/jpeg',
      'https://via.placeholder.com/800x600/4A5568/FFFFFF?text=Spiritual+Artwork'
    ];
    
    const whatsapp = initializeTwilioWhatsApp();
    const adminNumber = process.env.WHATSAPP_ADMIN_NUMBER || '+16176420146';
    
    for (const imageUrl of reliableImageUrls) {
      console.log(`\n--- Testing image URL: ${imageUrl} ---`);
      
      // First verify URL is accessible
      try {
        const response = await fetch(imageUrl);
        console.log(`URL status: ${response.status}`);
        console.log(`Content-Type: ${response.headers.get('content-type')}`);
        
        if (response.ok) {
          // Send via WhatsApp
          console.log('Sending via WhatsApp...');
          const result = await whatsapp.sendMessage(
            adminNumber,
            '🖼️ Testing direct image delivery',
            imageUrl
          );
          
          if (result.success) {
            console.log(`✓ WhatsApp message sent: ${result.messageId}`);
            console.log(`✓ Media message sent: ${result.mediaMessageId}`);
            
            // Wait and check message status
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Check message status via Twilio API
            if (result.mediaMessageId) {
              const statusCheck = await fetch(
                `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages/${result.mediaMessageId}.json`,
                {
                  headers: {
                    'Authorization': `Basic ${Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64')}`
                  }
                }
              );
              
              const status = await statusCheck.json();
              console.log(`Message status: ${status.status}`);
              if (status.error_code) {
                console.log(`Error code: ${status.error_code}`);
              }
            }
          } else {
            console.log(`✗ Failed: ${result.error}`);
          }
        }
      } catch (error) {
        console.log(`✗ URL test failed: ${error.message}`);
      }
      
      // Wait between tests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testDirectImageDelivery();