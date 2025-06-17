import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateArtworkForTodaysLesson() {
  try {
    console.log('Generating Islamic geometric artwork for today\'s lesson...');
    
    const artworkPrompt = `Create a beautiful Islamic geometric artwork for a spiritual lesson about divine compassion and communication:

Title: "The Gift of Divine Communication"
Theme: Divine compassion (Ar-Rahman), the sacred gift of speech, cosmic harmony
Quranic verse: "The Most Compassionate taught the Qur'an, created humanity, and taught them speech"

Style: Traditional Islamic geometric patterns with elegant calligraphic elements
Colors: Deep emerald green, gold, sapphire blue, and ivory
Elements: Geometric mandalas, flowing Arabic calligraphy, celestial motifs (sun, moon, stars)

Create a reverent, beautiful artwork that captures the essence of divine mercy and the sacred nature of communication. The design should be sophisticated, spiritually uplifting, and respectful of Islamic artistic traditions.`;

    const artworkResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: artworkPrompt,
      size: "1024x1024",
      quality: "standard",
      n: 1
    });

    const imageUrl = artworkResponse.data[0]?.url;
    if (!imageUrl) {
      throw new Error('Failed to generate artwork');
    }

    console.log('Downloading and saving artwork...');
    
    // Download the image
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    
    // Save to public/artwork directory
    const artworkDir = path.join(process.cwd(), 'public', 'artwork');
    if (!fs.existsSync(artworkDir)) {
      fs.mkdirSync(artworkDir, { recursive: true });
    }
    
    const filename = `lesson-29-divine-communication-${Date.now()}.png`;
    const localPath = `/artwork/${filename}`;
    const fullPath = path.join(artworkDir, filename);
    
    fs.writeFileSync(fullPath, Buffer.from(buffer));
    
    console.log(`Artwork saved: ${localPath}`);
    
    // Update the lesson in database with the correct artwork path
    const { storage } = await import('./server/storage');
    
    await storage.db.update(storage.schema.lessons)
      .set({ 
        artworkUrl: localPath,
        emailArtworkUrl: localPath,
        artworkDescription: 'Islamic geometric artwork with calligraphic elements depicting divine compassion and communication'
      })
      .where(storage.db.eq(storage.schema.lessons.id, 29));
    
    console.log('Database updated with artwork path');
    console.log(`View artwork at: https://soulwisdom.replit.app${localPath}`);
    
  } catch (error) {
    console.error('Error generating artwork:', error);
  }
}

generateArtworkForTodaysLesson();