import { generateTodaysLesson } from './server/lesson-generator';
import { storage } from './server/storage';
import { emailService } from './server/email-service';

async function generateAndSendTodaysLesson() {
  try {
    console.log('Generating fresh lesson for June 17, 2025...');
    
    // Generate new lesson using the system
    const result = await generateTodaysLesson(storage);
    
    if (!result.success) {
      console.log('Generation failed:', result.error);
      return;
    }
    
    console.log(`Created: "${result.lesson.title}"`);
    console.log(`Source: ${result.lesson.passage.source}`);
    console.log(`Tradition: ${result.lesson.passage.tradition.name}`);
    
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
    
    console.log('Sending new lesson via email...');
    const emailSent = await emailService.sendDailyLesson(result.lesson, [subscriber]);
    
    if (emailSent) {
      console.log('Email delivered successfully');
    } else {
      console.log('Email failed - SMTP authentication required');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

generateAndSendTodaysLesson();