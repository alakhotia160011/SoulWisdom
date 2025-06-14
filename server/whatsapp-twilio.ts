import twilio from 'twilio';
import { storage } from './storage';
import { LessonWithDetails } from '../shared/schema';
import OpenAI from 'openai';
import { ReplitArtworkHosting } from './replit-hosting';

export class TwilioWhatsAppService {
  private client: twilio.Twilio;
  private fromNumber: string;
  private adminNumber: string;
  private openai: OpenAI;

  constructor(accountSid: string, authToken: string, fromNumber: string, adminNumber: string, openaiApiKey: string) {
    this.client = twilio(accountSid, authToken);
    this.fromNumber = fromNumber; // Twilio WhatsApp number (e.g., whatsapp:+14155238886)
    this.adminNumber = adminNumber; // Your WhatsApp number (e.g., whatsapp:+16176420146)
    this.openai = new OpenAI({ apiKey: openaiApiKey });
  }

  async sendMessage(message: string, mediaUrl?: string): Promise<boolean> {
    try {
      const messageOptions: any = {
        body: message,
        from: this.fromNumber,
        to: this.adminNumber
      };

      if (mediaUrl) {
        messageOptions.mediaUrl = [mediaUrl];
      }

      const twilioMessage = await this.client.messages.create(messageOptions);

      console.log(`WhatsApp message sent successfully: ${twilioMessage.sid}`);
      return true;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      return false;
    }
  }

  async sendDailyLesson(): Promise<boolean> {
    const todaysLesson = await storage.getTodaysLesson();
    if (!todaysLesson) {
      return false;
    }

    try {
      // Send lesson text first
      const message = this.formatLessonForWhatsApp(todaysLesson);
      const dailyMessage = `🌅 *Daily Spiritual Lesson*\n\n${message}`;
      
      const textSent = await this.sendMessage(dailyMessage);
      if (!textSent) {
        return false;
      }

      // Send artwork as separate image attachment
      const artworkUrl = await this.getGoogleDriveArtworkUrl(todaysLesson);
      if (artworkUrl && todaysLesson.artworkDescription) {
        const artworkCaption = `🎨 *Spiritual Artwork*\n\n"${todaysLesson.title}"\n\n${todaysLesson.artworkDescription}`;
        await this.sendMessage(artworkCaption, artworkUrl);
      }
      
      return true;
    } catch (error) {
      console.error('Error sending daily lesson:', error);
      // Fallback: send text-only lesson if media fails
      const message = this.formatLessonForWhatsApp(todaysLesson);
      const artworkUrl = await this.getGoogleDriveArtworkUrl(todaysLesson);
      
      let fallbackMessage = `🌅 *Daily Spiritual Lesson*\n\n${message}`;
      if (artworkUrl) {
        fallbackMessage += `\n\n🎨 *Artwork:* ${artworkUrl}\n(Note: Image delivery unavailable - trial account limit reached)`;
      }
      
      return await this.sendMessage(fallbackMessage);
    }
  }

  private async sendArtworkMessage(lesson: LessonWithDetails): Promise<boolean> {
    try {
      // Get cloud-hosted artwork URL
      const artworkUrl = await this.getGoogleDriveArtworkUrl(lesson);
      console.log(`Artwork URL for WhatsApp: ${artworkUrl}`);
      
      if (artworkUrl) {
        // Send artwork image with description
        const artworkMessage = `🎨 *Spiritual Artwork*\n\n"${lesson.title}"\n\n${lesson.artworkDescription}`;
        console.log(`Sending artwork message with URL: ${artworkUrl}`);
        return await this.sendMessage(artworkMessage, artworkUrl);
      } else {
        console.log('No artwork URL available, sending description only');
        // Fallback to description only
        const artworkMessage = `🎨 *Spiritual Artwork*\n\n"${lesson.title}"\n\n${lesson.artworkDescription}\n\nThis artwork was created to complement today's spiritual lesson and enhance your meditation and reflection.`;
        return await this.sendMessage(artworkMessage);
      }
    } catch (error) {
      console.error('Error sending artwork message:', error);
      return false;
    }
  }

  private async getGoogleDriveArtworkUrl(lesson: LessonWithDetails): Promise<string | null> {
    try {
      // Get the best available artwork URL using Replit hosting
      const artworkUrl = ReplitArtworkHosting.getBestArtworkUrl(lesson);
      
      if (artworkUrl) {
        // Test URL accessibility before returning
        const isAccessible = await ReplitArtworkHosting.testUrlAccessibility(artworkUrl);
        if (isAccessible) {
          return artworkUrl;
        }
      }

      console.log('No accessible artwork URL found');
      return null;
    } catch (error) {
      console.error('Error getting artwork URL:', error);
      return null;
    }
  }

  async processIncomingMessage(messageBody: string): Promise<string> {
    const command = messageBody.toLowerCase().trim();
    
    try {
      if (command === 'today') {
        return await this.getTodaysLessonText();
      } else if (command === 'yesterday') {
        return await this.getYesterdaysLessonText();
      } else if (['bible', 'quran', 'gita', 'dhammapada', 'tao', 'upanishads', 'talmud'].includes(command)) {
        return await this.getLessonByTraditionText(command);
      } else if (command.includes('?') || command.startsWith('what') || command.startsWith('how') || command.startsWith('why')) {
        return await this.handleQuestionText(messageBody);
      } else if (command === 'more') {
        return await this.getFullStoryText();
      } else if (command === 'help') {
        return this.getHelpText();
      } else {
        return await this.handleGeneralMessageText(messageBody);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      return 'Sorry, I encountered an error. Please try again.';
    }
  }

  private async getTodaysLessonText(): Promise<string> {
    const todaysLesson = await storage.getTodaysLesson();
    
    if (!todaysLesson) {
      return "No lesson found for today. The daily lesson will be generated at 7 AM EST.";
    }

    const message = this.formatLessonForWhatsApp(todaysLesson);
    const artworkUrl = this.getWhatsAppArtworkUrl(todaysLesson);
    
    // Send with artwork if available
    if (artworkUrl) {
      await this.sendMessage(message, artworkUrl);
      return "Today's lesson with artwork has been sent!";
    }

    return message;
  }

  private async getYesterdaysLessonText(): Promise<string> {
    const recentLessons = await storage.getRecentLessons(2, 0);
    const yesterdaysLesson = recentLessons.find(lesson => {
      const lessonDate = new Date(lesson.date);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return lessonDate.toDateString() === yesterday.toDateString();
    });

    if (!yesterdaysLesson) {
      return "No lesson found for yesterday.";
    }

    const message = this.formatLessonForWhatsApp(yesterdaysLesson);
    const artworkUrl = this.getWhatsAppArtworkUrl(yesterdaysLesson);
    
    // Send with artwork if available
    if (artworkUrl) {
      await this.sendMessage(message, artworkUrl);
      return "Yesterday's lesson with artwork has been sent!";
    }

    return message;
  }

  private async getFullStoryText(): Promise<string> {
    const todaysLesson = await storage.getTodaysLesson();
    
    if (!todaysLesson) {
      return "No lesson available. Type 'today' for the latest lesson.";
    }

    // Send the complete story in chunks if needed
    const fullStory = todaysLesson.story;
    const maxLength = 1500;
    
    if (fullStory.length <= maxLength) {
      return `📖 *Complete Story*\n\n${fullStory}\n\n_End of story. Type a question to explore deeper!_`;
    }
    
    // For very long stories, send first part and indicate more available
    const firstPart = fullStory.substring(0, maxLength - 100);
    return `📖 *Complete Story (Part 1)*\n\n${firstPart}...\n\n_Story continues. This is the full spiritual teaching from today's lesson._`;
  }

  private async getLessonByTraditionText(tradition: string): Promise<string> {
    const traditionMap: { [key: string]: string } = {
      'bible': 'bible',
      'quran': 'quran',
      'gita': 'bhagavad-gita',
      'dhammapada': 'dhammapada',
      'tao': 'tao-te-ching',
      'upanishads': 'upanishads',
      'talmud': 'talmud'
    };

    const traditionSlug = traditionMap[tradition];
    if (!traditionSlug) {
      return "Tradition not found. Available: bible, quran, gita, dhammapada, tao, upanishads, talmud";
    }

    const lessons = await storage.getLessonsByTradition(traditionSlug, 1, 0);
    if (lessons.length === 0) {
      return `No lessons found for ${tradition}`;
    }

    const message = this.formatLessonForWhatsApp(lessons[0]);
    const artworkUrl = this.getWhatsAppArtworkUrl(lessons[0]);
    
    // Send with artwork if available
    if (artworkUrl) {
      await this.sendMessage(message, artworkUrl);
      return `${tradition} lesson with artwork has been sent!`;
    }

    return message;
  }

  private async handleQuestionText(question: string): Promise<string> {
    const todaysLesson = await storage.getTodaysLesson();
    
    let context = "You are a spiritual wisdom assistant. Answer questions about spirituality, religion, and life lessons. Keep responses concise for WhatsApp (under 1600 characters).";
    
    if (todaysLesson) {
      context += `\n\nToday's lesson context:\nTitle: ${todaysLesson.title}\nTradition: ${todaysLesson.passage.tradition.name}\nStory: ${todaysLesson.story.substring(0, 200)}...\nLife Lesson: ${todaysLesson.lifeLesson}`;
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: context },
          { role: "user", content: question }
        ],
        max_tokens: 400
      });

      const answer = response.choices[0].message.content || "I couldn't generate an answer.";
      return `🤔 *Spiritual Guidance*\n\n${answer}`;
    } catch (error) {
      console.error('Error with OpenAI:', error);
      return "I'm having trouble accessing spiritual guidance right now. Please try again later.";
    }
  }

  private getHelpText(): string {
    return `🙏 *Spiritual Lessons Bot*

*Commands:*
• "today" - Today's lesson
• "yesterday" - Yesterday's lesson  
• "bible", "quran", "gita" - Latest from tradition

*Ask Questions:*
Just type naturally about spirituality or life guidance

*Examples:*
• "What does today's lesson mean?"
• "How can I practice patience?"

Daily lessons sent at 7 AM EST ✨`;
  }

  private async handleGeneralMessageText(generalText: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { 
            role: "system", 
            content: "You are a wise spiritual guide. Respond with spiritual wisdom and encouragement. Keep responses under 1600 characters for WhatsApp." 
          },
          { role: "user", content: generalText }
        ],
        max_tokens: 300
      });

      const reply = response.choices[0].message.content || "Peace be with you.";
      return `🙏 ${reply}`;
    } catch (error) {
      console.error('Error with OpenAI:', error);
      return "Peace be with you. How can I help you with spiritual guidance today?";
    }
  }

  private formatLessonForWhatsApp(lesson: LessonWithDetails): string {
    const date = new Date(lesson.date).toLocaleDateString();
    
    // Build the message components
    const header = `🙏 *${lesson.title}*\n📖 _${lesson.passage.tradition.name}_ • ${date}\n📍 ${lesson.passage.source}\n\n`;
    const storyHeader = `*Today's Story:*\n`;
    const lifeLessonSection = `\n\n*Life Lesson:*\n${lesson.lifeLesson}\n\nType "more" for full story or ask questions!`;
    
    // Calculate available space for story (1600 char limit with buffer)
    const fixedPartsLength = header.length + storyHeader.length + lifeLessonSection.length;
    const maxStoryLength = 1550 - fixedPartsLength; // Safe buffer
    
    let storyText = lesson.story;
    if (storyText.length > maxStoryLength) {
      storyText = lesson.story.substring(0, maxStoryLength - 30) + '...\n\n(Reply "more" for complete story)';
    }
    
    const finalMessage = `${header}${storyHeader}${storyText}${lifeLessonSection}`;
    
    // Final safety check
    if (finalMessage.length > 1600) {
      const safeStoryLength = 1550 - fixedPartsLength - 50; // Extra buffer
      const truncatedStory = lesson.story.substring(0, safeStoryLength) + '...\n\n(Reply "more")';
      return `${header}${storyHeader}${truncatedStory}${lifeLessonSection}`;
    }
    
    return finalMessage;
  }

  private formatLessonWithArtworkUrl(lesson: LessonWithDetails, artworkUrl: string | null): string {
    const date = new Date(lesson.date).toLocaleDateString();
    
    // Build message components
    const header = `🙏 *${lesson.title}*\n📖 _${lesson.passage.tradition.name}_ • ${date}\n📍 ${lesson.passage.source}\n\n`;
    const lifeLessonSection = `\n\n*Life Lesson:*\n${lesson.lifeLesson}\n\nType "more" for full story!`;
    
    let artworkSection = '';
    if (artworkUrl) {
      artworkSection = `\n\n🎨 *Spiritual Artwork:* ${artworkUrl}`;
    }
    
    // Calculate space for story
    const fixedLength = header.length + lifeLessonSection.length + artworkSection.length;
    const maxStoryLength = 1550 - fixedLength;
    
    let storyText = lesson.story;
    if (storyText.length > maxStoryLength) {
      storyText = lesson.story.substring(0, maxStoryLength - 30) + '...\n\n(Reply "more")';
    }
    
    return `${header}*Today's Story:*\n${storyText}${lifeLessonSection}${artworkSection}`;
  }

  private formatShortLessonForWhatsApp(lesson: LessonWithDetails): string {
    const date = new Date(lesson.date).toLocaleDateString();
    
    return `🙏 *${lesson.title}*
📖 _${lesson.passage.tradition.name}_ • ${date}

*Life Lesson:*
${lesson.lifeLesson}

Type "today" for full story or "more" for details!`;
  }

  private getWhatsAppArtworkUrl(lesson: LessonWithDetails): string | undefined {
    // Use Replit domain for local artwork files
    if (lesson.artworkUrl && process.env.REPLIT_DOMAIN) {
      return `https://${process.env.REPLIT_DOMAIN}${lesson.artworkUrl}`;
    }
    
    // Use local server URL as fallback
    if (lesson.artworkUrl) {
      return `http://localhost:5000${lesson.artworkUrl}`;
    }
    
    return undefined;
  }
}

let twilioWhatsAppService: TwilioWhatsAppService | null = null;

export function initializeTwilioWhatsApp(
  accountSid: string, 
  authToken: string, 
  fromNumber: string, 
  adminNumber: string, 
  openaiApiKey: string
) {
  if (!twilioWhatsAppService) {
    twilioWhatsAppService = new TwilioWhatsAppService(
      accountSid, 
      authToken, 
      fromNumber, 
      adminNumber, 
      openaiApiKey
    );
    console.log('✓ Twilio WhatsApp service initialized');
  }
  return twilioWhatsAppService;
}

export function getTwilioWhatsAppService() {
  return twilioWhatsAppService;
}