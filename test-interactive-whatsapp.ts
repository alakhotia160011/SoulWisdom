import { initializeTwilioWhatsApp } from './server/whatsapp-twilio';

async function testInteractiveWhatsApp() {
  try {
    console.log('Testing interactive WhatsApp with OpenAI integration...');
    
    const whatsapp = initializeTwilioWhatsApp();
    const testNumber = 'whatsapp:+16176420146';
    
    // Test different commands and questions
    const testMessages = [
      'today',
      'What does today\'s lesson mean for my spiritual growth?',
      'How can I practice patience in difficult times?',
      'inspire',
      'help',
      'traditions'
    ];
    
    for (const message of testMessages) {
      console.log(`\n--- Testing: "${message}" ---`);
      
      try {
        const result = await whatsapp.processIncomingMessage(message, testNumber);
        console.log(`✓ Response processed: ${result}`);
        
        // Wait between tests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.log(`✗ Error processing "${message}": ${error.message}`);
      }
    }
    
    console.log('\n✓ Interactive WhatsApp testing completed');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testInteractiveWhatsApp();