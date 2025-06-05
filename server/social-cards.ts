import { generateArtworkForLesson } from "./artwork-generator";

export interface SocialCardRequest {
  lessonId: number;
  title: string;
  lifeLesson: string;
  source: string;
  tradition: string;
  artworkUrl: string;
  platform: string;
}

export async function generateSocialCard(cardRequest: SocialCardRequest): Promise<{ url: string; description: string }> {
  try {
    // Create a prompt for generating a social media card using OpenAI
    const prompt = `Create a beautiful social media card for ${cardRequest.platform} featuring this spiritual lesson:

Title: "${cardRequest.title}"
Source: ${cardRequest.source} (${cardRequest.tradition})
Life Lesson: "${cardRequest.lifeLesson}"

Design requirements:
- Social media card dimensions (1200x630 pixels for Facebook/Twitter, 1080x1080 for Instagram)
- Beautiful typography with the lesson title prominently displayed
- Include the source citation and tradition name
- Inspirational design with spiritual/religious aesthetic
- Include the life lesson as a quote
- Warm, spiritual color palette (earth tones, golds, sacred colors)
- Professional layout suitable for ${cardRequest.platform}
- Add subtle spiritual symbols or patterns appropriate to the tradition
- Ensure text is readable and well-positioned

Style: Modern spiritual design, clean typography, inspirational quote card, social media ready`;

    // Use OpenAI to generate the social media card
    const artwork = await generateArtworkForLesson(
      getSocialCardTraditionId(cardRequest.tradition),
      `${cardRequest.platform} Social Card: ${cardRequest.title}`,
      prompt
    );

    return {
      url: artwork.url,
      description: `${cardRequest.platform} social media card for "${cardRequest.title}"`
    };

  } catch (error) {
    console.error("Error generating social media card:", error);
    
    // Return fallback card URL
    return {
      url: generateFallbackCard(cardRequest),
      description: `Fallback ${cardRequest.platform} card for "${cardRequest.title}"`
    };
  }
}

function getSocialCardTraditionId(tradition: string): number {
  const traditionMap: { [key: string]: number } = {
    "Bible": 1,
    "Qur'an": 2,
    "Bhagavad Gita": 3,
    "Dhammapada": 4,
    "Tao Te Ching": 5,
    "Upanishads": 6,
    "Talmud": 7
  };
  
  return traditionMap[tradition] || 1;
}

function generateFallbackCard(cardRequest: SocialCardRequest): string {
  // Generate a simple SVG social media card
  const width = cardRequest.platform === "Instagram" ? 1080 : 1200;
  const height = cardRequest.platform === "Instagram" ? 1080 : 630;
  
  const shortTitle = cardRequest.title.length > 50 
    ? cardRequest.title.substring(0, 47) + "..." 
    : cardRequest.title;
    
  const shortLesson = cardRequest.lifeLesson.length > 120 
    ? cardRequest.lifeLesson.substring(0, 117) + "..." 
    : cardRequest.lifeLesson;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f9f7f4"/>
        <stop offset="100%" stop-color="#e8dcc6"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="rgba(0,0,0,0.15)"/>
      </filter>
    </defs>
    
    <!-- Background -->
    <rect width="${width}" height="${height}" fill="url(#bg)"/>
    
    <!-- Border -->
    <rect x="40" y="40" width="${width - 80}" height="${height - 80}" 
          fill="none" stroke="#8b7355" stroke-width="6" rx="12"/>
    
    <!-- Content Background -->
    <rect x="80" y="80" width="${width - 160}" height="${height - 160}" 
          fill="white" rx="8" filter="url(#shadow)"/>
    
    <!-- Title -->
    <text x="${width / 2}" y="180" text-anchor="middle" 
          font-family="Georgia, serif" font-size="48" font-weight="bold" 
          fill="#2c2c2c">${shortTitle}</text>
    
    <!-- Source -->
    <text x="${width / 2}" y="230" text-anchor="middle" 
          font-family="Georgia, serif" font-size="24" font-style="italic" 
          fill="#666">${cardRequest.source}</text>
    
    <!-- Tradition Badge -->
    <rect x="${width / 2 - 80}" y="260" width="160" height="40" 
          fill="#8b7355" rx="20"/>
    <text x="${width / 2}" y="285" text-anchor="middle" 
          font-family="Arial, sans-serif" font-size="18" font-weight="bold" 
          fill="white">${cardRequest.tradition}</text>
    
    <!-- Life Lesson -->
    <text x="${width / 2}" y="380" text-anchor="middle" 
          font-family="Georgia, serif" font-size="32" font-style="italic" 
          fill="#2c2c2c">"${shortLesson}"</text>
    
    <!-- Platform Badge -->
    <rect x="40" y="${height - 80}" width="200" height="40" 
          fill="#8b7355" rx="6"/>
    <text x="50" y="${height - 55}" 
          font-family="Arial, sans-serif" font-size="18" font-weight="bold" 
          fill="white">${cardRequest.platform}</text>
    
    <!-- Decorative Elements -->
    <circle cx="120" cy="120" r="8" fill="#d4af37" opacity="0.6"/>
    <circle cx="${width - 120}" cy="120" r="8" fill="#d4af37" opacity="0.6"/>
    <circle cx="120" cy="${height - 120}" r="8" fill="#d4af37" opacity="0.6"/>
    <circle cx="${width - 120}" cy="${height - 120}" r="8" fill="#d4af37" opacity="0.6"/>
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}