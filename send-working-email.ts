// Send test email with proper artwork URL handling
import { storage } from "./server/storage";
import { emailService } from "./server/email-service";
import { generateArtworkForLesson } from "./server/artwork-generator";
import { db } from "./server/db";
import { lessons } from "@shared/schema";
import { eq } from "drizzle-orm";

async function sendWorkingEmail() {
  try {
    console.log('Generating fresh artwork for email test...');
    
    // Generate new artwork with proper OpenAI URLs
    const artwork = await generateArtworkForLesson(
      6, // Upanishads tradition ID
      "The Sacred Web of Universal Interconnection",
      "In the ancient wisdom of the Upanishads, we discover profound truths about the interconnected nature of all existence..."
    );
    
    console.log(`Generated fresh artwork:`);
    console.log(`- Local URL: ${artwork.url}`);
    console.log(`- Email URL: ${artwork.emailUrl}`);
    
    // Update today's lesson with real OpenAI email URL
    await db.update(lessons)
      .set({ emailArtworkUrl: artwork.emailUrl })
      .where(eq(lessons.id, 14));
    
    // Get updated lesson
    const updatedLesson = await storage.getLessonById(14);
    
    if (updatedLesson && updatedLesson.emailArtworkUrl?.startsWith('http')) {
      console.log('Sending test email with working OpenAI artwork...');
      
      const testSubscriber = { 
        id: 999, 
        email: 'ary.lakhotia@gmail.com', 
        createdAt: new Date(), 
        isActive: true 
      };
      
      const success = await emailService.sendDailyLesson(updatedLesson, [testSubscriber]);
      
      if (success) {
        console.log('✓ Test email sent with working OpenAI artwork');
        console.log(`Active email artwork URL: ${updatedLesson.emailArtworkUrl}`);
        console.log('The artwork should now display properly in your email');
      } else {
        console.log('✗ Failed to send test email');
      }
    } else {
      console.log('Error: Could not get valid email artwork URL');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

sendWorkingEmail();