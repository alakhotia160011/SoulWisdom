import { generateArtworkForLesson } from './server/artwork-generator';
import { db } from './server/db';
import { lessons } from './shared/schema';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

async function createTalmudArtworkFinal() {
  try {
    console.log("Generating artwork for Talmud lesson using existing system...");

    // Generate artwork using the established system
    const artworkResult = await generateArtworkForLesson(
      7, // Talmud tradition ID
      "Being Human Where None Are",
      "In a place where there are no human beings, strive to be human. This profound teaching from the Talmud calls us to embody moral courage, compassion, justice and dignity especially when others have abandoned these values."
    );

    console.log("Artwork generated successfully");
    console.log("OpenAI URL:", artworkResult.emailUrl);

    // Download and save the artwork locally
    const imageResponse = await fetch(artworkResult.emailUrl);
    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const filename = `lesson-7-${Date.now()}.png`;
    const filepath = path.join(process.cwd(), 'public', 'artwork', filename);
    
    const artworkDir = path.join(process.cwd(), 'public', 'artwork');
    if (!fs.existsSync(artworkDir)) {
      fs.mkdirSync(artworkDir, { recursive: true });
    }

    fs.writeFileSync(filepath, buffer);
    console.log("Artwork saved locally:", `/artwork/${filename}`);

    // Update the lesson with real artwork URLs
    await db.update(lessons)
      .set({
        artworkUrl: `/artwork/${filename}`,
        emailArtworkUrl: artworkResult.emailUrl,
        artworkDescription: artworkResult.description
      })
      .where(eq(lessons.id, 27));

    console.log("✓ Lesson updated with real artwork URLs");
    
    return {
      localUrl: `/artwork/${filename}`,
      emailUrl: artworkResult.emailUrl,
      description: artworkResult.description
    };

  } catch (error) {
    console.error("Error generating Talmud artwork:", error);
    throw error;
  }
}

createTalmudArtworkFinal();