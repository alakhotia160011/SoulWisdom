import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function createIslamicArtwork() {
  try {
    console.log('Generating authentic Islamic geometric artwork...');
    
    const prompt = `Create an authentic Islamic geometric artwork for a Quranic lesson about divine compassion and the sacred gift of speech:

Quranic verse: "The Most Compassionate taught the Qur'an, created humanity, and taught them speech"
Theme: Divine mercy (Ar-Rahman), sacred communication, cosmic harmony

Visual elements:
- Traditional Islamic geometric patterns and star polygons
- Elegant Arabic calligraphy incorporating "Ar-Rahman" (The Most Compassionate)
- Eight-pointed stars, hexagons, and interlacing patterns
- Celestial motifs representing sun, moon, and stars mentioned in the verse
- Border decorations with flowing arabesque designs

Color palette:
- Deep emerald green (#228B22) - traditional Islamic color
- Pure gold (#FFD700) for calligraphy and highlights
- Sapphire blue (#003366) for depth
- Ivory cream (#FFF8DC) for background elements

Style: Classical Islamic manuscript illumination with geometric precision, similar to designs found in the Dome of the Rock or Alhambra palace. The artwork should be reverent, sophisticated, and authentically represent Islamic artistic traditions.`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      size: "1024x1024",
      quality: "hd",
      n: 1
    });

    if (!response.data[0]?.url) {
      throw new Error('No artwork generated');
    }

    // Download the image
    const imageResponse = await fetch(response.data[0].url);
    const buffer = await imageResponse.arrayBuffer();
    
    // Save to public/artwork directory
    const artworkDir = path.join(process.cwd(), 'public', 'artwork');
    const timestamp = Date.now();
    const filename = `quran-compassion-${timestamp}.png`;
    const localPath = `/artwork/${filename}`;
    const fullPath = path.join(artworkDir, filename);
    
    fs.writeFileSync(fullPath, Buffer.from(buffer));
    
    console.log(`Islamic artwork created: ${localPath}`);
    
    // Update today's lesson with authentic Islamic artwork
    const updateQuery = `
      UPDATE lessons 
      SET artwork_url = $1,
          email_artwork_url = $1,
          artwork_description = 'Authentic Islamic geometric artwork with Arabic calligraphy depicting divine compassion (Ar-Rahman)'
      WHERE id = 29
    `;
    
    // Use direct SQL to ensure update works
    const { Client } = await import('pg');
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    await client.query(updateQuery, [localPath]);
    await client.end();
    
    console.log('Lesson updated with authentic Islamic artwork');
    console.log(`Artwork URL: https://soulwisdom.replit.app${localPath}`);
    
    return localPath;
    
  } catch (error) {
    console.error('Artwork creation failed:', error);
    return null;
  }
}

createIslamicArtwork();