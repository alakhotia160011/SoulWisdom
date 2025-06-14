import twilio from 'twilio';
import { storage } from './server/storage';

async function testReplitArtworkDelivery() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;
  const toNumber = process.env.WHATSAPP_ADMIN_NUMBER;
  
  if (!accountSid || !authToken || !fromNumber || !toNumber) {
    console.error('Missing credentials');
    return;
  }
  
  // Get today's lesson and artwork URL
  const todaysLesson = await storage.getTodaysLesson();
  if (!todaysLesson || !todaysLesson.artworkUrl) {
    console.error('No lesson or artwork found');
    return;
  }
  
  const client = twilio(accountSid, authToken);
  
  // Construct artwork URL using the Replit app URL
  const replitUrl = `https://${process.env.REPL_ID}.replit.app`;
  const artworkUrl = `${replitUrl}${todaysLesson.artworkUrl}`;
  
  console.log('Testing artwork URL:', artworkUrl);
  
  try {
    // Test the URL accessibility first
    const response = await fetch(artworkUrl);
    console.log('URL accessibility test:', response.status, response.statusText);
    
    if (response.ok) {
      // Send WhatsApp message with artwork
      const message = await client.messages.create({
        body: `🎨 Today's Spiritual Artwork\n\n"${todaysLesson.title}"\n\n${todaysLesson.artworkDescription}`,
        mediaUrl: [artworkUrl],
        from: `whatsapp:${fromNumber}`,
        to: `whatsapp:${toNumber}`
      });
      
      console.log('WhatsApp message sent:', message.sid);
      console.log('Status:', message.status);
      
      // Check status after delay
      setTimeout(async () => {
        try {
          const updatedMessage = await client.messages(message.sid).fetch();
          console.log('Final status:', updatedMessage.status);
          console.log('Error code:', updatedMessage.errorCode || 'None');
        } catch (error) {
          console.error('Error checking status:', error);
        }
      }, 8000);
    } else {
      console.error('Artwork URL not accessible');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testReplitArtworkDelivery();