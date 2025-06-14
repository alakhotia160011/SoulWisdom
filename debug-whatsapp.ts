import { storage } from './server/storage';

async function debugWhatsAppConfiguration() {
  try {
    console.log('=== DEBUGGING WHATSAPP ARTWORK DELIVERY ===\n');
    
    // Check today's lesson artwork URLs
    const todaysLesson = await storage.getTodaysLesson();
    if (!todaysLesson) {
      console.error('❌ No lesson found for today');
      return;
    }

    console.log('📖 Today\'s Lesson:', todaysLesson.title);
    console.log('🎨 Local artwork URL:', todaysLesson.artworkUrl);
    console.log('📧 Email artwork URL:', todaysLesson.emailArtworkUrl);
    console.log('📝 Artwork description:', todaysLesson.artworkDescription);
    console.log('');

    // Test artwork URL accessibility
    if (todaysLesson.emailArtworkUrl) {
      console.log('🔍 Testing artwork URL accessibility...');
      
      try {
        const response = await fetch(todaysLesson.emailArtworkUrl);
        console.log('Status:', response.status);
        console.log('Content-Type:', response.headers.get('content-type'));
        console.log('URL accessible:', response.ok ? '✅ YES' : '❌ NO');
      } catch (error) {
        console.error('❌ URL fetch failed:', error.message);
      }
    } else {
      console.log('❌ No email artwork URL found');
    }

    // Check Twilio credentials
    console.log('\n🔧 Twilio Configuration:');
    console.log('Account SID exists:', !!process.env.TWILIO_ACCOUNT_SID);
    console.log('Auth Token exists:', !!process.env.TWILIO_AUTH_TOKEN);
    console.log('From Number exists:', !!process.env.TWILIO_PHONE_NUMBER);
    console.log('Admin Number exists:', !!process.env.WHATSAPP_ADMIN_NUMBER);

    if (process.env.TWILIO_ACCOUNT_SID) {
      console.log('Account SID format valid:', process.env.TWILIO_ACCOUNT_SID.startsWith('AC') ? '✅' : '❌');
    }

    // Check environment variables
    console.log('\n🌐 Environment:');
    console.log('REPL_ID:', process.env.REPL_ID || 'Not set');
    console.log('NODE_ENV:', process.env.NODE_ENV || 'Not set');

  } catch (error) {
    console.error('Debug error:', error);
  }
}

debugWhatsAppConfiguration();