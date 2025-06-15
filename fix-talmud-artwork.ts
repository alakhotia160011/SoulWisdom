import { storage } from './server/storage';
import { db } from './server/db';
import { lessons, passages, traditions } from './shared/schema';
import { eq } from 'drizzle-orm';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function fixTalmudArtwork() {
  try {
    console.log("Generating real artwork for Talmud lesson...");

    // Generate artwork using DALL-E 3
    const prompt = `Hebrew manuscript style illuminated artwork depicting moral courage and human dignity. Show ancient Hebrew calligraphy with warm golden and deep blue colors, ornate geometric borders typical of Jewish texts, and subtle imagery of a figure standing with dignity. The artwork should convey the wisdom of choosing compassion and justice even in moral darkness. Style: Traditional Hebrew illuminated manuscript with rich spiritual symbolism.`;

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
      throw new Error("No image URL received");
    }

    console.log("✓ Artwork generated");

    // Download and save the image
    const imageResponse = await fetch(imageUrl);
    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const filename = `lesson-7-${Date.now()}.png`;
    const filepath = path.join(process.cwd(), 'public', 'artwork', filename);
    
    const artworkDir = path.join(process.cwd(), 'public', 'artwork');
    if (!fs.existsSync(artworkDir)) {
      fs.mkdirSync(artworkDir, { recursive: true });
    }

    fs.writeFileSync(filepath, buffer);
    console.log("✓ Artwork saved");

    // Update lesson with real artwork
    await db.update(lessons)
      .set({
        artworkUrl: `/artwork/${filename}`,
        emailArtworkUrl: imageUrl,
        artworkDescription: 'Hebrew manuscript style artwork depicting moral courage and human dignity'
      })
      .where(eq(lessons.id, 27));

    console.log("✓ Lesson updated with real artwork");
    console.log("Local URL:", `/artwork/${filename}`);

  } catch (error) {
    console.error("Error:", error);
  }
}

fixTalmudArtwork();