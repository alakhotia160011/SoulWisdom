import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { emailService } from './server/email-service';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function createTodaysLesson() {
  try {
    // Use the authentic Quranic passage
    const passage = {
      id: 15,
      source: "Quran 55:1-4",
      title: "The Compassionate",
      content: "The Most Compassionate taught the Qur'an, created humanity, and taught them speech. The sun and the moon follow their calculated courses; the stars and the trees bow down in worship."
    };

    console.log(`Creating lesson from ${passage.source}`);

    // Generate lesson content
    const lessonPrompt = `Create a spiritual lesson based on this authentic passage from ${passage.source}:

"${passage.content}"

Generate:
1. A meaningful title (different from "${passage.title}")
2. A rich story that connects this ancient wisdom to modern life
3. A practical life lesson for daily application

Focus on the themes of divine compassion, the gift of communication, and the harmony of creation. Make it relevant to contemporary challenges while honoring the sacred text.

Format as JSON:
{
  "title": "...",
  "story": "...",
  "lifeLesson": "..."
}`;

    const lessonResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: lessonPrompt }],
      temperature: 0.7
    });

    const lesson = JSON.parse(lessonResponse.choices[0].message.content || '{}');

    // Generate artwork
    console.log('Creating Islamic geometric artwork...');
    
    const artworkPrompt = `Create a beautiful Islamic geometric artwork for this spiritual lesson:

Title: "${lesson.title}"
Theme: Divine compassion, creation's harmony, the gift of speech
Style: Traditional Islamic geometric patterns with calligraphic elements

The artwork should be reverent, beautiful, and capture the essence of divine compassion and the ordered harmony of creation. Use geometric patterns, arabesque designs, and flowing calligraphy in gold, deep blue, and emerald tones.`;

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

    // Download and save artwork
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    
    const artworkDir = path.join(process.cwd(), 'public', 'artwork');
    if (!fs.existsSync(artworkDir)) {
      fs.mkdirSync(artworkDir, { recursive: true });
    }
    
    const filename = `lesson-today-${Date.now()}.png`;
    const localPath = `/artwork/${filename}`;
    const fullPath = path.join(artworkDir, filename);
    
    fs.writeFileSync(fullPath, Buffer.from(buffer));
    console.log(`Artwork saved: ${localPath}`);

    // Create complete lesson object
    const completeLesson = {
      id: 999,
      passageId: 15,
      title: lesson.title,
      story: lesson.story,
      lifeLesson: lesson.lifeLesson,
      artworkUrl: localPath,
      emailArtworkUrl: localPath,
      artworkDescription: "Islamic geometric artwork with calligraphic elements",
      date: new Date(),
      isGenerated: true,
      passage: {
        id: 15,
        title: "The Compassionate",
        traditionId: 2,
        source: "Quran 55:1-4",
        content: "The Most Compassionate taught the Qur'an, created humanity, and taught them speech. The sun and the moon follow their calculated courses; the stars and the trees bow down in worship.",
        context: "Opening verses about divine compassion",
        theme: "Divine mercy and creation's harmony",
        tradition: {
          id: 2,
          name: "Qur'an",
          slug: "quran",
          description: "Islamic guidance and reflection",
          color: "#228B22",
          icon: "🌙",
          textColor: "#FFFFFF",
          backgroundColor: "#228B22",
          borderColor: "#32CD32",
          accentColor: "#FFD700",
          fontFamily: "serif",
          culturalElements: [],
          artworkStyle: "Islamic geometric",
          originPeriod: null,
          originLocation: null,
          spiritualTradition: null,
          summary: null,
          famousQuotes: null,
          imageUrl: null,
          manuscriptStyle: null
        }
      }
    };

    // Send to your email
    const subscriber = {
      id: 999,
      email: 'ary.lakhotia@gmail.com',
      phoneNumber: null,
      whatsappActive: false,
      emailActive: true,
      isActive: true,
      createdAt: new Date()
    };

    console.log(`Sending "${completeLesson.title}" to your email...`);
    console.log(`Artwork: https://soulwisdom.replit.app${localPath}`);

    const emailSent = await emailService.sendDailyLesson(completeLesson, [subscriber]);

    if (emailSent) {
      console.log('Fresh lesson delivered successfully!');
    } else {
      console.log('Email delivery requires Gmail App Password setup');
    }

    return completeLesson;

  } catch (error) {
    console.error('Error creating lesson:', error);
  }
}

createTodaysLesson();