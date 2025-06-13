// Generate a new lesson with proper email artwork URL and send test email
import { storage } from "./server/storage";
import { emailService } from "./server/email-service";
import { generateTodaysLesson } from "./server/lesson-generator";

async function testArtworkEmail() {
  try {
    console.log('Generating new lesson with updated artwork system...');
    
    // Generate a new lesson (this will create proper email artwork URLs)
    const newLesson = await generateTodaysLesson(storage);
    
    if (!newLesson) {
      console.log('Failed to generate new lesson');
      return;
    }
    
    console.log(`Generated lesson: "${newLesson.title}"`);
    console.log(`Website artwork URL: ${newLesson.artworkUrl}`);
    console.log(`Email artwork URL: ${newLesson.emailArtworkUrl || 'Not set'}`);
    
    // Send test email to your address
    const testSubscriber = { 
      id: 999, 
      email: 'ary.lakhotia@gmail.com', 
      createdAt: new Date(), 
      isActive: true 
    };
    
    console.log('Sending test email with updated artwork system...');
    const success = await emailService.sendDailyLesson(newLesson, [testSubscriber]);
    
    if (success) {
      console.log('✓ Test email sent successfully');
      console.log('Check your email - the artwork should now display properly');
    } else {
      console.log('✗ Failed to send test email');
    }
    
  } catch (error) {
    console.error('Error in test:', error);
  }
}

testArtworkEmail();