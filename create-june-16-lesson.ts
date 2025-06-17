import { generateLessonForToday } from './server/lesson-generator';
import { emailService } from './server/email-service';

async function createJune16Lesson() {
  try {
    console.log('Generating new lesson for June 16, 2025...');
    
    // Generate today's lesson using the existing system
    const result = await generateLessonForToday();
    
    if (!result.success || !result.lesson) {
      console.log('Failed to generate lesson:', result.error);
      return;
    }
    
    console.log(`Lesson created: "${result.lesson.title}"`);
    console.log(`Source: ${result.lesson.passage.source}`);
    console.log(`Artwork: ${result.lesson.artworkUrl}`);
    
    // Send email to you specifically
    const testSubscriber = {
      id: 999,
      email: 'ary.lakhotia@gmail.com',
      phoneNumber: null,
      whatsappActive: false,
      emailActive: true,
      isActive: true,
      createdAt: new Date()
    };
    
    console.log('Sending lesson via email...');
    const emailSuccess = await emailService.sendDailyLesson(result.lesson, [testSubscriber]);
    
    if (emailSuccess) {
      console.log('Email sent successfully to ary.lakhotia@gmail.com');
    } else {
      console.log('Email failed - check SMTP configuration');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

createJune16Lesson();