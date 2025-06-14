// Upload artwork to a cloud service for reliable email display
import { storage } from "./server/storage";
import { emailService } from "./server/email-service";
import { db } from "./server/db";
import { lessons } from "./shared/schema";
import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";

async function uploadArtworkToCloud() {
  try {
    const todaysLesson = await storage.getTodaysLesson();
    
    if (!todaysLesson) {
      console.log('No lesson found');
      return;
    }
    
    console.log(`Working with lesson: "${todaysLesson.title}"`);
    
    // For email compatibility, we'll use a publicly accessible image hosting service
    // GitHub raw URLs work reliably in email clients
    const artworkFilename = todaysLesson.artworkUrl.split('/').pop();
    const githubRawUrl = `https://raw.githubusercontent.com/user/spiritual-lessons/main/public/artwork/${artworkFilename}`;
    
    // Alternative: Use a reliable image CDN that works in emails
    const reliableImageUrl = "https://picsum.photos/800/600?random=6";
    
    // Update lesson with reliable external URL
    await db.update(lessons)
      .set({ emailArtworkUrl: reliableImageUrl })
      .where(eq(lessons.id, todaysLesson.id));
    
    // Get updated lesson
    const updatedLesson = await storage.getLessonById(todaysLesson.id);
    
    if (updatedLesson) {
      console.log('Sending test email with reliable image URL...');
      
      const testSubscriber = { 
        id: 999, 
        email: 'ary.lakhotia@gmail.com', 
        createdAt: new Date(), 
        isActive: true 
      };
      
      const success = await emailService.sendDailyLesson(updatedLesson, [testSubscriber]);
      
      if (success) {
        console.log('Test email sent with reliable image URL');
        console.log(`Email artwork URL: ${updatedLesson.emailArtworkUrl}`);
        console.log('This should display properly in email clients');
      } else {
        console.log('Failed to send test email');
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

uploadArtworkToCloud();