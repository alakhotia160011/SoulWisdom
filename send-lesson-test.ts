// Test script to send today's lesson to ary.lakhotia@gmail.com for artwork testing
// Run with: npx tsx send-lesson-test.ts

import { emailService } from "./server/email-service";
import { storage } from "./server/storage";

async function sendTestLesson() {
  try {
    console.log('Getting today\'s lesson...');
    const todaysLesson = await storage.getTodaysLesson();
    
    if (!todaysLesson) {
      console.log('No lesson found for today');
      return;
    }
    
    console.log(`Sending test lesson: "${todaysLesson.title}" to ary.lakhotia@gmail.com`);
    console.log(`Artwork URL: ${todaysLesson.artworkUrl}`);
    
    const testSubscriber = { 
      id: 999, 
      email: 'ary.lakhotia@gmail.com', 
      createdAt: new Date(), 
      isActive: true 
    };
    
    const success = await emailService.sendDailyLesson(todaysLesson, [testSubscriber]);
    
    if (success) {
      console.log('✓ Test lesson sent successfully to ary.lakhotia@gmail.com');
      console.log('Check your email for the artwork display test');
    } else {
      console.log('✗ Failed to send test lesson');
    }
  } catch (error) {
    console.error('Error sending test lesson:', error);
  }
}

sendTestLesson();