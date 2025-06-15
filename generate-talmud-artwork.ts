import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { storage } from './server/storage';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateTalmudArtwork() {
  try {
    console.log("Generating artwork for Talmud lesson: Being Human Where None Are");

    const prompt = `Create a Hebrew manuscript style artwork depicting the concept of moral courage and human dignity. The image should show:
    - Ancient Hebrew manuscript with elegant calligraphy
    - Warm golden and deep blue colors typical of Jewish illuminated texts
    - Subtle imagery of a single figure standing with dignity amid darkness
    - Traditional Jewish artistic elements like geometric patterns
    - The essence of being a beacon of humanity in difficult times
    
    Style: Traditional Hebrew illuminated manuscript with rich colors, ornate borders, and spiritual symbolism. The artwork should convey the profound wisdom of choosing to act with compassion and justice even when surrounded by moral darkness.`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "natural"
    });

    const imageUrl = response.data[0].url;
    if (!imageUrl) {
      throw new Error("No image URL received from OpenAI");
    }

    console.log("✓ Artwork generated successfully");
    console.log("OpenAI URL:", imageUrl);

    // Download and save the image
    const imageResponse = await fetch(imageUrl);
    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save to public/artwork directory
    const filename = `lesson-7-${Date.now()}.png`;
    const filepath = path.join(process.cwd(), 'public', 'artwork', filename);
    
    // Ensure artwork directory exists
    const artworkDir = path.join(process.cwd(), 'public', 'artwork');
    if (!fs.existsSync(artworkDir)) {
      fs.mkdirSync(artworkDir, { recursive: true });
    }

    fs.writeFileSync(filepath, buffer);
    console.log("✓ Artwork saved to:", filepath);

    // Update the lesson with the real artwork URLs
    const artworkUrl = `/artwork/${filename}`;
    await storage.db.execute(`
      UPDATE lessons 
      SET artwork_url = '${artworkUrl}', 
          email_artwork_url = '${imageUrl}',
          artwork_description = 'Hebrew manuscript style artwork depicting moral courage and human dignity from the Talmud teaching'
      WHERE id = 27
    `);

    console.log("✓ Lesson updated with real artwork");
    console.log("Local artwork URL:", artworkUrl);
    console.log("Email artwork URL:", imageUrl);

  } catch (error) {
    console.error("Error generating Talmud artwork:", error);
  }
}

generateTalmudArtwork();