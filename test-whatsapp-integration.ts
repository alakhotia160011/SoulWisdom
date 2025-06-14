import { getTwilioWhatsAppService } from './server/whatsapp-twilio';
import { storage } from './server/storage';

async function testWhatsAppIntegration() {
  try {
    console.log('=== TESTING WHATSAPP INTEGRATION ===\n');
    
    const whatsappService = getTwilioWhatsAppService();
    if (!whatsappService) {
      console.error('WhatsApp service not initialized');
      return;
    }

    // Get today's lesson
    const todaysLesson = await storage.getTodaysLesson();
    if (!todaysLesson) {
      console.error('No lesson found');
      return;
    }

    console.log(`Testing lesson: ${todaysLesson.title}`);
    console.log(`Story length: ${todaysLesson.story.length} characters`);
    console.log(`Artwork URL: ${todaysLesson.emailArtworkUrl}`);
    console.log('');

    // Test daily lesson delivery with detailed logging
    console.log('Sending daily lesson with artwork...');
    const success = await whatsappService.sendDailyLesson();
    
    if (success) {
      console.log('✅ Daily lesson sent successfully');
    } else {
      console.log('❌ Failed to send daily lesson');
    }

    // Test individual commands
    console.log('\nTesting individual commands...');
    
    // Test "today" command
    const todayResponse = await whatsappService.processIncomingMessage('today');
    console.log(`Today command response length: ${todayResponse.length} characters`);
    
    // Test "help" command
    const helpResponse = await whatsappService.processIncomingMessage('help');
    console.log(`Help command response length: ${helpResponse.length} characters`);

  } catch (error) {
    console.error('Error in WhatsApp integration test:', error);
  }
}

testWhatsAppIntegration();