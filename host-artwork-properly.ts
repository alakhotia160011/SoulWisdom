// Upload actual artwork to imgur for reliable email display
import { storage } from "./server/storage";
import { emailService } from "./server/email-service";
import { db } from "./server/db";
import { lessons } from "./shared/schema";
import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";

async function uploadToImgur(imagePath: string): Promise<string | null> {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    
    const response = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        'Authorization': 'Client-ID 546c25a59c58ad7',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image: base64Image,
        type: 'base64'
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.data.link;
    } else {
      console.error('Imgur upload failed:', data);
      return null;
    }
  } catch (error) {
    console.error('Error uploading to Imgur:', error);
    return null;
  }
}

async function hostArtworkProperly() {
  try {
    const todaysLesson = await storage.getTodaysLesson();
    
    if (!todaysLesson) {
      console.log('No lesson found');
      return;
    }
    
    console.log(`Uploading artwork for: "${todaysLesson.title}"`);
    
    // Get the actual artwork file
    const artworkPath = path.join(process.cwd(), 'public', todaysLesson.artworkUrl);
    
    if (fs.existsSync(artworkPath)) {
      console.log('Uploading artwork to cloud hosting...');
      
      const hostedUrl = await uploadToImgur(artworkPath);
      
      if (hostedUrl) {
        console.log(`Artwork uploaded successfully: ${hostedUrl}`);
        
        // Update lesson with hosted URL
        await db.update(lessons)
          .set({ emailArtworkUrl: hostedUrl })
          .where(eq(lessons.id, todaysLesson.id));
        
        // Get updated lesson
        const updatedLesson = await storage.getLessonById(todaysLesson.id);
        
        if (updatedLesson) {
          console.log('Sending test email with hosted artwork...');
          
          const testSubscriber = { 
            id: 999, 
            email: 'ary.lakhotia@gmail.com', 
            createdAt: new Date(), 
            isActive: true 
          };
          
          const success = await emailService.sendDailyLesson(updatedLesson, [testSubscriber]);
          
          if (success) {
            console.log('Test email sent with hosted artwork');
            console.log('The email should now display the actual spiritual artwork');
          } else {
            console.log('Failed to send test email');
          }
        }
      } else {
        console.log('Failed to upload artwork to cloud hosting');
      }
    } else {
      console.log(`Artwork file not found: ${artworkPath}`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

hostArtworkProperly();