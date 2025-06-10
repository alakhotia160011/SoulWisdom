import OpenAI from "openai";
import fs from "fs";
import path from "path";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Ensure artwork directory exists
const artworkDir = path.join(process.cwd(), 'public', 'artwork');
if (!fs.existsSync(artworkDir)) {
  fs.mkdirSync(artworkDir, { recursive: true });
}

interface ArtworkPrompts {
  [key: string]: {
    style: string;
    description: string;
  };
}

const traditionArtworkPrompts: ArtworkPrompts = {
  "1": { // Bible
    style: "Byzantine illuminated manuscript style",
    description: "ornate gold leaf borders, religious iconography, medieval Christian manuscript art, parchment background, sacred geometry, crosses and halos, rich blues and golds"
  },
  "2": { // Qur'an
    style: "Islamic geometric manuscript style",
    description: "intricate geometric patterns, Arabic calligraphy, Persian miniature art, Islamic arabesque designs, gold and emerald colors, sacred geometry, no figurative imagery"
  },
  "3": { // Bhagavad Gita
    style: "Mughal miniature painting style",
    description: "traditional Hindu manuscript art, lotus motifs, dharma wheel, Sanskrit calligraphy, saffron and vermillion colors, paisley patterns, divine symbols"
  },
  "4": { // Dhammapada (Buddhist)
    style: "Tibetan Buddhist manuscript style",
    description: "Buddhist thangka art style, lotus flowers, dharma wheel, prayer flags, Buddhist symbols, serene imagery, gold leaf details, manuscript illumination"
  },
  "5": { // Tao Te Ching
    style: "Chinese scroll painting style",
    description: "traditional Chinese ink painting, flowing water, mountains, yin-yang symbols, bamboo, minimalist composition, ancient Chinese manuscript style"
  },
  "6": { // Upanishads
    style: "Ancient Sanskrit manuscript style",
    description: "Vedic manuscript art, Sanskrit text, sacred fire imagery, cosmic symbols, traditional Indian palm leaf manuscript style, spiritual geometry"
  },
  "7": { // Talmud
    style: "Illuminated Hebrew manuscript style",
    description: "Hebrew calligraphy, Star of David, menorah imagery, medieval Jewish manuscript art, parchment with ornate borders, rabbinic text layout"
  }
};

export async function generateArtworkForLesson(
  traditionId: number, 
  storyTitle: string, 
  storyContent: string
): Promise<{ url: string; description: string }> {
  try {
    const tradition = traditionArtworkPrompts[traditionId.toString()];
    if (!tradition) {
      throw new Error(`No artwork style defined for tradition ${traditionId}`);
    }

    // Create a detailed prompt that combines the tradition's artistic style with the specific story
    const prompt = `Create an authentic ${tradition.style} artwork depicting the spiritual story: "${storyTitle}". 

Visual elements to include: ${tradition.description}

Story context: ${storyContent.slice(0, 200)}...

Style requirements: Traditional manuscript illumination, aged parchment or silk background, culturally authentic details, historical accuracy, evocative spiritual imagery that captures the essence of this sacred narrative. The artwork should feel like it could be from an ancient religious manuscript or sacred text.

Avoid: Modern elements, contemporary style, photorealistic people, inappropriate cultural mixing.`;

    console.log(`Generating artwork for ${tradition.style}: ${storyTitle}`);

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    if (!response.data?.[0]?.url) {
      throw new Error("No image URL returned from OpenAI");
    }

    // Save image locally for backup and return permanent OpenAI URL for emails
    const imageUrl = response.data[0].url;
    const filename = `lesson-${traditionId}-${Date.now()}.png`;
    const localPath = path.join(artworkDir, filename);
    
    try {
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.arrayBuffer();
      fs.writeFileSync(localPath, Buffer.from(imageBuffer));
      
      console.log(`Artwork saved to: ${localPath}`);
      console.log(`Using permanent OpenAI URL for emails: ${imageUrl}`);
      
      // Return local URL for website (OpenAI URLs expire)
      return {
        url: `/artwork/${filename}`,
        description: `${tradition.style} artwork depicting ${storyTitle}`
      };
    } catch (downloadError) {
      console.error("Error downloading/saving image:", downloadError);
      // Return original URL if download fails
      return {
        url: imageUrl,
        description: `${tradition.style} artwork depicting ${storyTitle}`
      };
    }

  } catch (error) {
    console.error("Error generating artwork:", error);
    
    // Fallback to tradition-specific SVG if AI generation fails
    const fallbackArtwork = getFallbackArtwork(traditionId);
    return {
      url: fallbackArtwork.url,
      description: fallbackArtwork.description + " (fallback artwork)"
    };
  }
}

function getFallbackArtwork(traditionId: number): { url: string; description: string } {
  const traditionNames = ["", "bible", "quran", "bhagavad-gita", "dhammapada", "tao-te-ching", "upanishads", "talmud"];
  const traditionName = traditionNames[traditionId] || "bible";
  
  // Simple SVG artwork as fallback
  const traditionalArtwork = {
    bible: [
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='parchment' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23f4f1e8'/%3E%3Cstop offset='100%25' stop-color='%23e8dcc6'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='url(%23parchment)'/%3E%3Ctext x='400' y='300' text-anchor='middle' font-family='serif' font-size='18' fill='%23654321'%3EByzantine Manuscript Art%3C/text%3E%3C/svg%3E"
    ],
    quran: [
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='paper' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23fdfbf7'/%3E%3Cstop offset='100%25' stop-color='%23f5f1e8'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='url(%23paper)'/%3E%3Ctext x='400' y='300' text-anchor='middle' font-family='serif' font-size='18' fill='%232c5f3f'%3EIslamic Geometric Art%3C/text%3E%3C/svg%3E"
    ]
  };

  const artworkUrls = traditionalArtwork[traditionName as keyof typeof traditionalArtwork] || traditionalArtwork.bible;
  const randomUrl = artworkUrls[Math.floor(Math.random() * artworkUrls.length)];
  
  const descriptions = {
    bible: "Byzantine illuminated manuscript artwork",
    quran: "Islamic geometric and calligraphic artwork",
    "bhagavad-gita": "Mughal miniature style artwork",
    dhammapada: "Buddhist manuscript artwork",
    "tao-te-ching": "Chinese scroll painting style artwork",
    upanishads: "Sanskrit manuscript artwork",
    talmud: "Hebrew illuminated manuscript artwork"
  };

  return {
    url: randomUrl,
    description: descriptions[traditionName as keyof typeof descriptions] || "Traditional spiritual artwork"
  };
}