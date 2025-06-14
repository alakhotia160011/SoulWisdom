import { emailService } from './server/email-service';
import { storage } from './server/storage';

async function sendYesterdayLesson() {
  try {
    console.log('Getting yesterday\'s lesson...');
    
    // Get the specific lesson (ID 10 - The Lost Sheep)
    const lesson = await storage.getLessonById(10);
    
    if (!lesson) {
      console.log('Yesterday\'s lesson not found');
      return;
    }
    
    console.log(`Found lesson: "${lesson.title}"`);
    console.log(`Artwork URL: ${lesson.artworkUrl}`);
    
    // Create a single subscriber array for the specific email
    const subscribers = [{
      id: 999,
      email: 'ary.lakhotia@gmail.com',
      isActive: true,
      createdAt: new Date(),
      preferences: null
    }];
    
    console.log('Sending yesterday\'s lesson email...');
    const success = await emailService.sendDailyLesson(lesson, subscribers);
    
    if (success) {
      console.log('✓ Yesterday\'s lesson email sent successfully');
      console.log('The email includes the spiritual artwork from the lesson');
    } else {
      console.log('✗ Failed to send yesterday\'s lesson email');
    }
    
  } catch (error) {
    console.error('Error sending yesterday\'s lesson:', error);
  }
}

sendYesterdayLesson();