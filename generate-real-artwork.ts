// Generate real OpenAI artwork for today's lesson and send test email
import { storage } from "./server/storage";
import { emailService } from "./server/email-service";
import { generateArtworkForLesson } from "./server/artwork-generator";
import { db } from "./server/db";
import { lessons } from "@shared/schema";
import { eq } from "drizzle-orm";

async function generateRealArtworkAndSendEmail() {
  try {
    console.log('Getting today\'s lesson...');
    const todaysLesson = await storage.getTodaysLesson();
    
    if (!todaysLesson) {
      console.log('No lesson found for today');
      return;
    }
    
    console.log(`Working with lesson: "${todaysLesson.title}"`);
    
    // Generate real OpenAI artwork
    console.log('Generating real OpenAI artwork...');
    const artwork = await generateArtworkForLesson(
      todaysLesson.passage.tradition.id,
      todaysLesson.title,
      todaysLesson.story
    );
    
    console.log(`Generated artwork URLs:`);
    console.log(`- Website: ${artwork.url}`);
    console.log(`- Email: ${artwork.emailUrl}`);
    
    // Update the lesson in database with real email artwork URL
    await db.update(lessons)
      .set({ emailArtworkUrl: artwork.emailUrl })
      .where(eq(lessons.id, todaysLesson.id));
    
    console.log('Updated lesson with real email artwork URL');
    
    // Get the updated lesson
    const updatedLesson = await storage.getLessonById(todaysLesson.id);
    
    if (updatedLesson) {
      console.log('Sending test email with real OpenAI artwork...');
      
      const testSubscriber = { 
        id: 999, 
        email: 'ary.lakhotia@gmail.com', 
        createdAt: new Date(), 
        isActive: true 
      };
      
      const success = await emailService.sendDailyLesson(updatedLesson, [testSubscriber]);
      
      if (success) {
        console.log('✓ Test email sent with real OpenAI artwork');
        console.log(`Email artwork URL: ${updatedLesson.emailArtworkUrl}`);
        console.log('Check your email - the artwork should now display properly');
      } else {
        console.log('✗ Failed to send test email');
      }
    }
    
  } catch (error) {
    console.error('Error generating artwork:', error);
  }
}

generateRealArtworkAndSendEmail();