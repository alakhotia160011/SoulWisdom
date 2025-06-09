import { storage } from './server/storage';
import { emailService } from './server/email-service';

async function sendTestEmail() {
  try {
    console.log('Getting today\'s lesson...');
    const todaysLesson = await storage.getTodaysLesson();
    
    if (!todaysLesson) {
      console.error('No lesson available');
      return;
    }

    console.log(`Sending lesson "${todaysLesson.title}" to ary.lakhotia@gmail.com...`);
    console.log(`Artwork URL: ${todaysLesson.artworkUrl}`);
    
    const emailSent = await emailService.sendDailyLesson(todaysLesson, [{ 
      id: 999, 
      email: 'ary.lakhotia@gmail.com', 
      isActive: true, 
      createdAt: new Date() 
    }]);

    if (emailSent) {
      console.log('✓ Test email sent successfully!');
    } else {
      console.error('✗ Failed to send test email');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

sendTestEmail();