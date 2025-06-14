import { getTwilioWhatsAppService } from './server/whatsapp-twilio';
import { storage } from './server/storage';

async function sendArtworkToWhatsApp() {
  try {
    console.log('=== TESTING WHATSAPP ARTWORK DELIVERY ===\n');
    
    // Get today's lesson
    const todaysLesson = await storage.getTodaysLesson();
    if (!todaysLesson) {
      console.error('No lesson found');
      return;
    }

    console.log('Lesson:', todaysLesson.title);
    console.log('Local artwork:', todaysLesson.artworkUrl);
    console.log('Email artwork URL:', todaysLesson.emailArtworkUrl);
    
    // Test direct media message sending
    const whatsappService = getTwilioWhatsAppService();
    if (!whatsappService) {
      console.error('WhatsApp service not available');
      return;
    }

    // Send artwork directly with multiple URL formats
    const artworkUrls = [
      todaysLesson.emailArtworkUrl,
      `https://${process.env.REPL_ID}.replit.app${todaysLesson.artworkUrl}`,
      'https://i.imgur.com/tf8ivY1.jpeg' // Direct test URL
    ];

    for (const url of artworkUrls) {
      if (url) {
        console.log(`\nTesting artwork URL: ${url}`);
        
        try {
          // Test URL accessibility first
          const response = await fetch(url);
          console.log(`URL status: ${response.status}`);
          console.log(`Content-Type: ${response.headers.get('content-type')}`);
          
          if (response.ok) {
            // Send test message with artwork
            const testMessage = `🎨 Test Artwork Delivery\n\nTesting: ${url}`;
            const sent = await whatsappService.sendMessage(testMessage, url);
            console.log(`Message sent: ${sent ? '✅' : '❌'}`);
            
            if (sent) {
              console.log('SUCCESS: Artwork delivered successfully!');
              break;
            }
          }
        } catch (error) {
          console.error(`Error with URL ${url}:`, error.message);
        }
      }
    }

  } catch (error) {
    console.error('Error in artwork delivery test:', error);
  }
}

sendArtworkToWhatsApp();