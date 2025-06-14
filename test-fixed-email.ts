import { emailService } from './server/email-service';
import { storage } from './server/storage';

async function testFixedEmail() {
  try {
    console.log('Getting yesterday\'s lesson to test fixed email...');
    
    // Get the specific lesson (ID 10 - The Lost Sheep)
    const lesson = await storage.getLessonById(10);
    
    if (!lesson) {
      console.log('Lesson not found');
      return;
    }
    
    console.log(`Testing fixed email template for: "${lesson.title}"`);
    
    // Create a single subscriber array for the specific email
    const subscribers = [{
      id: 999,
      email: 'ary.lakhotia@gmail.com',
      isActive: true,
      createdAt: new Date(),
      preferences: null
    }];
    
    console.log('Sending test email with fixed template...');
    const success = await emailService.sendDailyLesson(lesson, subscribers);
    
    if (success) {
      console.log('✓ Fixed email template sent successfully');
      console.log('The email should now display the button and footer properly');
    } else {
      console.log('✗ Failed to send test email');
    }
    
  } catch (error) {
    console.error('Error sending test email:', error);
  }
}

testFixedEmail();