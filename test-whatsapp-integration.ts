import { getWhatsAppManualService } from './server/whatsapp-manual';

async function testWhatsAppIntegration() {
  console.log('🔧 Testing WhatsApp Integration');
  console.log('================================\n');
  
  const whatsappService = getWhatsAppManualService();
  
  if (!whatsappService) {
    console.log('❌ WhatsApp service not initialized');
    console.log('Make sure WHATSAPP_ADMIN_NUMBER and OPENAI_API_KEY are set\n');
    return;
  }
  
  console.log('✅ WhatsApp service is ready\n');
  
  // Test different commands
  const testCommands = [
    'today',
    'help',
    'What is the meaning of life?',
    'bible',
    'How can I find inner peace?'
  ];
  
  for (const command of testCommands) {
    console.log(`📱 Command: "${command}"`);
    console.log('─'.repeat(50));
    
    try {
      const response = await whatsappService.processCommand(command);
      console.log(`🤖 Response:\n${response}\n`);
    } catch (error) {
      console.log(`❌ Error: ${error}\n`);
    }
    
    console.log('═'.repeat(60));
    console.log();
  }
  
  console.log('🎉 WhatsApp integration test completed!');
  console.log('\nYou can now interact with your spiritual lessons through:');
  console.log('• POST /api/whatsapp/message with {"command": "your message"}');
  console.log('• GET /api/whatsapp/daily-lesson for today\'s lesson');
  console.log('\nThe system will also send daily lessons at 7 AM EST automatically.');
}

testWhatsAppIntegration();