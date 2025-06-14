import { db } from './server/db';
import { lessons, subscriptions } from './shared/schema';
import { eq } from 'drizzle-orm';
import { emailService } from './server/email-service';
import fs from 'fs';
import path from 'path';

async function embedArtworkInEmail() {
  try {
    console.log('Converting artwork to embedded format...');
    
    // Get today's lesson
    const today = new Date().toISOString().split('T')[0];
    const [todaysLesson] = await db
      .select()
      .from(lessons)
      .where(eq(lessons.date, today))
      .limit(1);

    if (!todaysLesson) {
      console.log('No lesson found for today');
      return;
    }

    console.log(`Lesson: ${todaysLesson.title}`);
    console.log(`Artwork URL: ${todaysLesson.artworkUrl}`);

    // Convert artwork to data URI
    if (todaysLesson.artworkUrl && todaysLesson.artworkUrl.startsWith('/artwork/')) {
      const artworkPath = path.join(process.cwd(), 'public', todaysLesson.artworkUrl);
      
      if (fs.existsSync(artworkPath)) {
        const imageBuffer = fs.readFileSync(artworkPath);
        const base64Image = imageBuffer.toString('base64');
        const dataUri = `data:image/png;base64,${base64Image}`;
        
        console.log(`Converted to data URI (${Math.round(base64Image.length / 1024)}KB)`);
        
        // Update lesson with embedded artwork
        await db
          .update(lessons)
          .set({ emailArtworkUrl: dataUri })
          .where(eq(lessons.id, todaysLesson.id));
        
        console.log('Updated lesson with embedded artwork');
      }
    }

    // Get all subscribers
    const allSubscribers = await db.select().from(subscriptions);
    console.log(`Sending to ${allSubscribers.length} subscribers`);

    // Get updated lesson with embedded artwork
    const [updatedLesson] = await db
      .select()
      .from(lessons)
      .where(eq(lessons.date, today))
      .limit(1);

    // Send email with embedded artwork
    const success = await emailService.sendDailyLesson(updatedLesson as any, allSubscribers);
    
    if (success) {
      console.log(`✓ Email sent with embedded artwork to ${allSubscribers.length} subscribers`);
    } else {
      console.log('✗ Failed to send email');
    }

  } catch (error) {
    console.error('Error embedding artwork:', error);
  }
}

embedArtworkInEmail();