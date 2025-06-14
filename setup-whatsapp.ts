import { initializeWhatsApp } from './server/whatsapp-service';

async function setupWhatsApp() {
  console.log('🔧 WhatsApp Integration Setup');
  console.log('=====================================\n');
  
  // Check for required environment variables
  const openaiKey = process.env.OPENAI_API_KEY;
  const adminNumber = process.env.WHATSAPP_ADMIN_NUMBER;
  
  if (!openaiKey) {
    console.log('❌ OPENAI_API_KEY not found in environment variables');
    console.log('Please add your OpenAI API key to continue\n');
    return;
  }
  
  if (!adminNumber) {
    console.log('❌ WHATSAPP_ADMIN_NUMBER not found in environment variables');
    console.log('Please add your WhatsApp number (with country code) to environment variables');
    console.log('Example: +15551234567\n');
    console.log('Add this to your Replit secrets or .env file:');
    console.log('WHATSAPP_ADMIN_NUMBER=+your_whatsapp_number\n');
    return;
  }
  
  console.log('✅ Environment variables found');
  console.log(`Admin WhatsApp: ${adminNumber}`);
  console.log('✅ OpenAI API key configured\n');
  
  console.log('📱 Initializing WhatsApp client...');
  console.log('This will generate a QR code that you need to scan with your WhatsApp\n');
  
  try {
    const whatsappService = initializeWhatsApp(adminNumber, openaiKey);
    
    console.log('Instructions:');
    console.log('1. Open WhatsApp on your phone');
    console.log('2. Go to Settings > Linked Devices');
    console.log('3. Tap "Link a Device"');
    console.log('4. Scan the QR code that appears below');
    console.log('5. Once connected, you can interact with your spiritual lessons bot!\n');
    
    console.log('Bot Commands:');
    console.log('• "today" - Get today\'s lesson');
    console.log('• "yesterday" - Get yesterday\'s lesson');
    console.log('• "bible", "quran", "gita" - Get lessons from specific traditions');
    console.log('• Ask any spiritual question naturally');
    console.log('• "help" - Show all commands\n');
    
    console.log('💡 The bot will automatically send you daily lessons at 7 AM EST');
    console.log('Keep this terminal open until the QR code is scanned...\n');
    
  } catch (error) {
    console.error('Error setting up WhatsApp:', error);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 WhatsApp setup interrupted');
  process.exit(0);
});

setupWhatsApp();