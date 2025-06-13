// Convert the actual lesson artwork to email-compatible format
import { storage } from "./server/storage";
import { emailService } from "./server/email-service";
import { db } from "./server/db";
import { lessons } from "./shared/schema";
import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";

async function convertArtworkToEmail() {
  try {
    const todaysLesson = await storage.getTodaysLesson();
    
    if (!todaysLesson) {
      console.log('No lesson found');
      return;
    }
    
    console.log(`Converting artwork for: "${todaysLesson.title}"`);
    
    // Read the actual artwork file and convert to base64 data URL
    const artworkPath = path.join(process.cwd(), 'public', todaysLesson.artworkUrl);
    
    if (fs.existsSync(artworkPath)) {
      const imageBuffer = fs.readFileSync(artworkPath);
      const base64Image = imageBuffer.toString('base64');
      const dataUrl = `data:image/png;base64,${base64Image}`;
      
      console.log('Converted artwork to base64 data URL for email compatibility');
      
      // Update lesson with the data URL for email
      await db.update(lessons)
        .set({ emailArtworkUrl: dataUrl })
        .where(eq(lessons.id, todaysLesson.id));
      
      // Get updated lesson
      const updatedLesson = await storage.getLessonById(todaysLesson.id);
      
      if (updatedLesson) {
        console.log('Sending test email with the actual lesson artwork...');
        
        const testSubscriber = { 
          id: 999, 
          email: 'ary.lakhotia@gmail.com', 
          createdAt: new Date(), 
          isActive: true 
        };
        
        const success = await emailService.sendDailyLesson(updatedLesson, [testSubscriber]);
        
        if (success) {
          console.log('✓ Test email sent with the actual Sanskrit manuscript artwork');
          console.log('The email now shows the same beautiful artwork as the website');
        } else {
          console.log('✗ Failed to send test email');
        }
      }
    } else {
      console.log(`Artwork file not found: ${artworkPath}`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

convertArtworkToEmail();