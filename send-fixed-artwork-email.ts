import { storage } from './server/storage';
import { emailService } from './server/email-service';

async function sendFixedArtworkEmail() {
  try {
    console.log('Getting today\'s lesson with proper storage...');
    
    // Get today's lesson using the working storage system
    const todaysLesson = await storage.getTodaysLesson();
    
    if (!todaysLesson) {
      console.log('No lesson found for today');
      return;
    }

    console.log(`Found lesson: ${todaysLesson.title}`);
    console.log(`Current artworkUrl: ${todaysLesson.artworkUrl}`);
    
    // Get all subscribers
    const allSubscribers = await storage.getAllSubscriptions();
    
    if (allSubscribers.length === 0) {
      console.log('No subscribers found');
      return;
    }

    console.log(`Sending fixed artwork email to ${allSubscribers.length} subscribers`);
    console.log(`Artwork will be served from: https://soul-wisdom-arylakhotia.replit.app${todaysLesson.artworkUrl}`);

    // Send the daily lesson with corrected artwork URL
    const success = await emailService.sendDailyLesson(todaysLesson, allSubscribers);
    
    if (success) {
      console.log(`✓ Fixed artwork email sent successfully to ${allSubscribers.length} subscribers`);
      console.log('✓ All emails now use deployed website artwork URLs');
    } else {
      console.log('✗ Failed to send fixed artwork email');
    }

  } catch (error) {
    console.error('Error sending fixed artwork email:', error);
  }
}

sendFixedArtworkEmail();