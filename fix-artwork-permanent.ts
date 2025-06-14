import { db } from './server/db';
import { lessons } from './shared/schema';
import { eq } from 'drizzle-orm';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generatePermanentArtwork() {
  try {
    console.log('✓ Database connection initialized successfully');
    
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

    console.log(`Generating new artwork for: ${todaysLesson.title}`);
    
    // Generate new artwork with OpenAI
    const artworkPrompt = `Create an illuminated Hebrew manuscript style artwork depicting "${todaysLesson.title}". The image should be beautiful, spiritual, and appropriate for email display. Use warm earth tones, gold accents, and traditional manuscript illumination techniques. The artwork should be 400x300 pixels and convey the sacred nature of the teaching.`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: artworkPrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const newArtworkUrl = response.data[0].url;
    console.log('New artwork generated:', newArtworkUrl);

    // Update the lesson with new artwork URL
    await db
      .update(lessons)
      .set({
        emailArtworkUrl: newArtworkUrl,
        artworkDescription: `Illuminated Hebrew manuscript style artwork depicting ${todaysLesson.title}`
      })
      .where(eq(lessons.id, todaysLesson.id));

    console.log('✓ Lesson updated with new permanent artwork URL');
    console.log('✓ Email artwork is now available for display');

  } catch (error) {
    console.error('Error generating permanent artwork:', error);
  }
}

generatePermanentArtwork();