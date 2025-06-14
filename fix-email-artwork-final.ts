import { storage } from './server/storage';
import { emailService } from './server/email-service';
import fs from 'fs';
import path from 'path';

async function fixEmailArtworkFinal() {
  try {
    console.log('Getting today\'s lesson...');
    const todaysLesson = await storage.getTodaysLesson();
    
    if (!todaysLesson) {
      console.log('No lesson found for today');
      return;
    }

    console.log(`Lesson: ${todaysLesson.title}`);
    console.log(`Current artwork URL: ${todaysLesson.artworkUrl}`);

    // Check if artwork file exists locally
    if (todaysLesson.artworkUrl && todaysLesson.artworkUrl.startsWith('/artwork/')) {
      const artworkPath = path.join(process.cwd(), 'public', todaysLesson.artworkUrl);
      console.log(`Checking artwork file: ${artworkPath}`);
      
      if (fs.existsSync(artworkPath)) {
        console.log('✓ Artwork file exists locally');
        
        // Convert to base64 data URI for reliable email display
        const imageBuffer = fs.readFileSync(artworkPath);
        const base64Image = imageBuffer.toString('base64');
        const dataUri = `data:image/png;base64,${base64Image}`;
        
        console.log(`✓ Converted artwork to data URI (${Math.round(base64Image.length / 1024)}KB)`);
        
        // Update lesson with data URI for email compatibility
        await storage.updateLesson(todaysLesson.id, {
          emailArtworkUrl: dataUri
        });
        
        console.log('✓ Updated lesson with data URI for email compatibility');
      } else {
        console.log('✗ Artwork file not found at expected path');
      }
    }

    // Get all subscribers and send corrected email
    const allSubscribers = await storage.getSubscriptions();
    
    if (allSubscribers.length === 0) {
      console.log('No subscribers found');
      return;
    }

    console.log(`Sending corrected email to ${allSubscribers.length} subscribers`);
    
    // Get updated lesson with data URI
    const updatedLesson = await storage.getTodaysLesson();
    
    // Send the email with embedded artwork
    const success = await emailService.sendDailyLesson(updatedLesson, allSubscribers);
    
    if (success) {
      console.log(`✓ Email sent successfully with embedded artwork to ${allSubscribers.length} subscribers`);
      console.log('✓ Artwork is now embedded directly in emails for reliable display');
    } else {
      console.log('✗ Failed to send corrected email');
    }

  } catch (error) {
    console.error('Error fixing email artwork:', error);
  }
}

fixEmailArtworkFinal();