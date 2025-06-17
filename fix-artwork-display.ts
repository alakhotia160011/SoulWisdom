import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function fixArtworkDisplay() {
  try {
    console.log('Creating Islamic geometric artwork for divine communication lesson...');
    
    const artworkPrompt = `Create a beautiful Islamic geometric artwork representing divine compassion and the sacred gift of speech:

Theme: Divine mercy (Ar-Rahman), communication as sacred gift, cosmic harmony
Visual elements: Traditional Islamic geometric patterns, golden calligraphy, celestial motifs
Colors: Deep emerald green (#228B22), gold (#FFD700), sapphire blue, ivory
Style: Reverent Islamic manuscript art with geometric mandalas and flowing arabesque

The artwork should be sophisticated, spiritually uplifting, and capture the essence of divine compassion teaching humanity the gift of speech.`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: artworkPrompt,
      size: "1024x1024",
      quality: "standard",
      n: 1
    });

    const imageUrl = response.data[0]?.url;
    if (!imageUrl) {
      throw new Error('No image URL received');
    }

    // Download the image
    const imageResponse = await fetch(imageUrl);
    const buffer = await imageResponse.arrayBuffer();
    
    // Save to artwork directory
    const artworkDir = path.join(process.cwd(), 'public', 'artwork');
    const filename = `divine-communication-${Date.now()}.png`;
    const localPath = `/artwork/${filename}`;
    const fullPath = path.join(artworkDir, filename);
    
    fs.writeFileSync(fullPath, Buffer.from(buffer));
    
    console.log(`New artwork saved: ${localPath}`);
    
    // Update lesson 29 with new artwork
    const { storage } = await import('./server/storage');
    
    await storage.db.update(storage.schema.lessons)
      .set({ 
        artworkUrl: localPath,
        emailArtworkUrl: localPath,
        artworkDescription: 'Islamic geometric artwork depicting divine compassion and sacred communication'
      })
      .where(storage.db.eq(storage.schema.lessons.id, 29));
    
    console.log('Lesson updated with new artwork');
    console.log(`Access at: https://soulwisdom.replit.app${localPath}`);
    
    return localPath;
    
  } catch (error) {
    console.error('Artwork generation failed:', error);
    
    // Fallback: use an existing working artwork
    const fallbackPath = '/artwork/lesson-1-1750001927393.png';
    console.log(`Using fallback artwork: ${fallbackPath}`);
    
    const { storage } = await import('./server/storage');
    
    await storage.db.update(storage.schema.lessons)
      .set({ 
        artworkUrl: fallbackPath,
        emailArtworkUrl: fallbackPath,
        artworkDescription: 'Traditional spiritual artwork'
      })
      .where(storage.db.eq(storage.schema.lessons.id, 29));
    
    return fallbackPath;
  }
}

fixArtworkDisplay();