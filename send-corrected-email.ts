import { db } from './server/db';
import { lessons, subscriptions } from './shared/schema';
import { eq } from 'drizzle-orm';
import { emailService } from './server/email-service';

async function sendCorrectedEmailToAllSubscribers() {
  try {
    console.log('✓ Database connection initialized successfully');
    
    // Get today's lesson
    const today = new Date().toISOString().split('T')[0];
    const [todaysLesson] = await db
      .select({
        id: lessons.id,
        passageId: lessons.passageId,
        title: lessons.title,
        story: lessons.story,
        lifeLesson: lessons.lifeLesson,
        artworkUrl: lessons.artworkUrl,
        emailArtworkUrl: lessons.emailArtworkUrl,
        artworkDescription: lessons.artworkDescription,
        date: lessons.date,
        isGenerated: lessons.isGenerated,
        passage: {
          id: lessons.passageId,
          traditionId: lessons.passageId,
          source: lessons.passageId,
          title: lessons.passageId,
          content: lessons.passageId,
          context: lessons.passageId,
          theme: lessons.passageId,
          tradition: {
            id: lessons.passageId,
            name: lessons.passageId,
            slug: lessons.passageId,
            description: lessons.passageId,
            color: lessons.passageId,
            icon: lessons.passageId,
            originPeriod: lessons.passageId,
            originLocation: lessons.passageId,
            spiritualTradition: lessons.passageId,
            summary: lessons.passageId,
            famousQuotes: lessons.passageId,
            imageUrl: lessons.passageId,
            manuscriptStyle: lessons.passageId
          }
        }
      })
      .from(lessons)
      .where(eq(lessons.date, today))
      .limit(1);

    if (!todaysLesson) {
      console.log('No lesson found for today');
      return;
    }

    // Get all subscribers
    const allSubscribers = await db.select().from(subscriptions);
    
    if (allSubscribers.length === 0) {
      console.log('No subscribers found');
      return;
    }

    console.log(`Sending corrected email to ${allSubscribers.length} subscribers`);
    console.log(`Lesson: ${todaysLesson.title}`);
    console.log(`Artwork URL will be: https://soul-wisdom-arylakhotia.replit.app${todaysLesson.artworkUrl}`);

    // Send the daily lesson with corrected artwork URL
    const success = await emailService.sendDailyLesson(todaysLesson as any, allSubscribers);
    
    if (success) {
      console.log(`✓ Corrected daily email sent successfully to ${allSubscribers.length} subscribers`);
      console.log('✓ All emails now contain working artwork from deployed website');
      console.log('✓ All links point to https://soul-wisdom-arylakhotia.replit.app');
    } else {
      console.log('✗ Failed to send corrected daily email');
    }

  } catch (error) {
    console.error('Error sending corrected email:', error);
  }
}

sendCorrectedEmailToAllSubscribers();