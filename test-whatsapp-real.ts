import { getTwilioWhatsAppService } from './server/whatsapp-twilio';

async function testWhatsAppConnection() {
  try {
    console.log('Testing WhatsApp artwork delivery...');
    
    const whatsappService = getTwilioWhatsAppService();
    if (!whatsappService) {
      console.error('WhatsApp service not initialized');
      return;
    }

    // Send today's daily lesson with artwork
    console.log('Sending daily lesson with artwork...');
    const success = await whatsappService.sendDailyLesson();
    
    if (success) {
      console.log('✅ Daily lesson with artwork sent successfully to WhatsApp!');
    } else {
      console.log('❌ Failed to send daily lesson to WhatsApp');
    }

  } catch (error) {
    console.error('Error testing WhatsApp connection:', error);
  }
}

testWhatsAppConnection();