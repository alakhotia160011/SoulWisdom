import { generateTodaysLesson } from './server/lesson-generator';
import { storage } from './server/storage';
import { emailService } from './server/email-service';

async function createManualLesson() {
  try {
    console.log('Creating new lesson for June 16, 2025...');
    
    // Generate lesson using existing system
    const lessonResult = await generateTodaysLesson(storage);
    
    if (!lessonResult.success) {
      console.log('Failed to generate lesson:', lessonResult.error);
      return;
    }
    
    console.log(`Created: "${lessonResult.lesson.title}"`);
    console.log(`Source: ${lessonResult.lesson.passage.source}`);
    
    // Send to your email
    const subscriber = {
      id: 999,
      email: 'ary.lakhotia@gmail.com',
      phoneNumber: null,
      whatsappActive: false,
      emailActive: true,
      isActive: true,
      createdAt: new Date()
    };
    
    console.log('Sending email...');
    const emailSent = await emailService.sendDailyLesson(lessonResult.lesson, [subscriber]);
    
    if (emailSent) {
      console.log('Email delivered successfully');
    } else {
      console.log('Email delivery failed - SMTP authentication required');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

createManualLesson();