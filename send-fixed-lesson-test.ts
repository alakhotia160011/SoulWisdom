import { storage } from './server/storage';
import { emailService } from './server/email-service';

async function sendFixedLessonTest() {
  try {
    console.log('Getting latest lesson...');
    
    // Get the most recent lesson directly from database
    const result = await storage.db.select().from(storage.schema.lessons)
      .innerJoin(storage.schema.passages, storage.db.eq(storage.schema.lessons.passageId, storage.schema.passages.id))
      .innerJoin(storage.schema.traditions, storage.db.eq(storage.schema.passages.traditionId, storage.schema.traditions.id))
      .orderBy(storage.db.desc(storage.schema.lessons.date))
      .limit(1);
    
    if (!result.length) {
      console.log('No lessons found');
      return;
    }
    
    const lessonData = result[0];
    const lessonWithDetails = {
      id: lessonData.lessons.id,
      title: lessonData.lessons.title,
      story: lessonData.lessons.story,
      lifeLesson: lessonData.lessons.lifeLesson,
      artworkUrl: lessonData.lessons.artworkUrl,
      emailArtworkUrl: lessonData.lessons.emailArtworkUrl,
      artworkDescription: lessonData.lessons.artworkDescription,
      date: lessonData.lessons.date,
      passage: {
        id: lessonData.passages.id,
        source: lessonData.passages.source,
        title: lessonData.passages.title,
        content: lessonData.passages.content,
        tradition: {
          id: lessonData.traditions.id,
          name: lessonData.traditions.name,
          slug: lessonData.traditions.slug
        }
      }
    };
    
    console.log(`Found lesson: "${lessonWithDetails.title}"`);
    console.log(`Artwork URL: ${lessonWithDetails.artworkUrl}`);
    
    // Create a test subscriber with your email
    const testSubscriber = {
      id: 999,
      email: process.env.EMAIL_USER || 'test@example.com',
      phoneNumber: null,
      whatsappActive: false,
      emailActive: true,
      isActive: true,
      createdAt: new Date()
    };
    
    console.log(`Sending test email to: ${testSubscriber.email}`);
    console.log(`Lesson: "${lessonWithDetails.title}"`);
    console.log(`Artwork URL: ${lessonWithDetails.artworkUrl}`);
    
    // Send the email
    const success = await emailService.sendDailyLesson(lessonWithDetails, [testSubscriber]);
    
    if (success) {
      console.log('✅ Test email sent successfully!');
      console.log('Check your inbox for the formatted lesson with artwork.');
    } else {
      console.log('❌ Failed to send test email');
    }
    
  } catch (error) {
    console.error('Error sending test email:', error);
  }
}

sendFixedLessonTest();