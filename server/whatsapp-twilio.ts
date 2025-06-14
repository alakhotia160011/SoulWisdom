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

  async sendMessage(message: string, mediaUrl?: string): Promise<{ success: boolean; messageId?: string; mediaMessageId?: string; error?: string }> {
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
      return { success: true, messageId: twilioMessage.sid };
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      return { success: false, error: error.message };
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

  async processIncomingMessage(messageBody: string, userNumber: string): Promise<string> {
    const command = messageBody.toLowerCase().trim();
    
    try {
      // Check if user is subscribed
      const subscriber = await storage.getWhatsAppSubscriberByPhone(userNumber);
      
      // Handle subscription commands first
      if (command === 'subscribe' || command === 'join') {
        await this.handleSubscription(userNumber);
        return 'sent';
      }
      
      if (command === 'unsubscribe' || command === 'stop') {
        await this.handleUnsubscription(userNumber);
        return 'sent';
      }
      
      // If not subscribed, prompt to subscribe for most commands
      if (!subscriber && !['help', 'subscribe', 'join'].includes(command)) {
        await this.sendResponseMessage(userNumber, this.getSubscriptionPrompt());
        return 'sent';
      }
      
      // Command routing with immediate responses
      switch (true) {
        case command === 'today':
          await this.sendResponseMessage(userNumber, await this.getTodaysLessonText());
          return 'sent';
          
        case command === 'yesterday':
          await this.sendResponseMessage(userNumber, await this.getYesterdaysLessonText());
          return 'sent';
          
        case command === 'help':
          await this.sendResponseMessage(userNumber, this.getHelpText(!!subscriber));
          return 'sent';
          
        case command === 'more':
          await this.sendResponseMessage(userNumber, await this.getFullStoryText());
          return 'sent';
          
        case command === 'inspire':
          await this.sendResponseMessage(userNumber, await this.getRandomInspiration());
          return 'sent';
          
        case command === 'traditions':
          await this.sendResponseMessage(userNumber, await this.getTraditionsList());
          return 'sent';
          
        case ['bible', 'quran', 'gita', 'dhammapada', 'tao', 'upanishads', 'talmud'].includes(command):
          await this.sendResponseMessage(userNumber, await this.getLessonByTraditionText(command));
          return 'sent';
          
        case command.includes('?') || command.startsWith('what') || command.startsWith('how') || command.startsWith('why'):
          await this.sendResponseMessage(userNumber, await this.handleQuestionText(messageBody));
          return 'sent';
          
        case command.length > 10: // Longer messages for spiritual guidance
          await this.sendResponseMessage(userNumber, await this.handleSpiritualGuidance(messageBody));
          return 'sent';
          
        default:
          await this.sendResponseMessage(userNumber, await this.handleGeneralMessageText(messageBody));
          return 'sent';
      }
    } catch (error) {
      console.error('Error processing message:', error);
      await this.sendResponseMessage(userNumber, 'I\'m having trouble right now. Please try again in a moment.');
      return 'error';
    }
  }

  private async handleSubscription(userNumber: string): Promise<void> {
    try {
      const existingSubscriber = await storage.getWhatsAppSubscriberByPhone(userNumber);
      
      if (existingSubscriber) {
        if (existingSubscriber.isActive) {
          await this.sendResponseMessage(userNumber, '🙏 You\'re already subscribed to daily spiritual lessons! Type "today" to get today\'s lesson or "help" for commands.');
        } else {
          // Reactivate subscription
          await storage.updateWhatsAppSubscriber(userNumber, { isActive: true });
          await this.sendResponseMessage(userNumber, '🌅 Welcome back! Your subscription has been reactivated. You\'ll receive daily lessons at 7 AM EST.');
          
          // Send today's lesson as welcome back
          const todaysLesson = await this.getTodaysLessonText();
          await this.sendResponseMessage(userNumber, todaysLesson);
        }
      } else {
        // New subscription
        await storage.createWhatsAppSubscriber({
          phoneNumber: userNumber,
          joinedVia: 'whatsapp'
        });
        
        await this.sendResponseMessage(userNumber, await this.getWelcomeMessage());
        
        // Send today's lesson as welcome gift
        const todaysLesson = await this.getTodaysLessonText();
        await this.sendResponseMessage(userNumber, todaysLesson);
      }
    } catch (error) {
      console.error('Error handling subscription:', error);
      await this.sendResponseMessage(userNumber, 'Sorry, there was an issue with your subscription. Please try again.');
    }
  }

  private async handleUnsubscription(userNumber: string): Promise<void> {
    try {
      await storage.deleteWhatsAppSubscriber(userNumber);
      await this.sendResponseMessage(userNumber, '😔 You\'ve been unsubscribed from daily spiritual lessons. We\'ll miss you! Reply "subscribe" anytime to rejoin our spiritual community.');
    } catch (error) {
      console.error('Error handling unsubscription:', error);
      await this.sendResponseMessage(userNumber, 'There was an issue processing your request. Please try again.');
    }
  }

  private getSubscriptionPrompt(): string {
    return `🙏 *Welcome to Spiritual Wisdom*

To receive daily spiritual lessons and interactive guidance, reply:

*"subscribe"* or *"join"*

You'll get:
• Daily lessons at 7 AM EST
• Stories with website links for full content
• Interactive Q&A with spiritual guidance
• Wisdom from 7 spiritual traditions

Reply "help" for commands.`;
  }

  private async getWelcomeMessage(): Promise<string> {
    const websiteUrl = process.env.REPL_SLUG ? `https://${process.env.REPL_ID}.replit.app` : 'https://soulwisdom.replit.app';
    
    return `🌅 *Welcome to Daily Spiritual Wisdom!*

Thank you for subscribing! You'll now receive:

📖 Daily spiritual lessons at 7 AM EST
🎨 Beautiful spiritual artwork 
💬 Interactive Q&A guidance
🌐 Full lessons on our website

*Available Commands:*
• "today" - Today's lesson
• "inspire" - Random inspiration
• "traditions" - Browse by tradition
• Ask any spiritual question!

🌐 *Website:* ${websiteUrl}

Your spiritual journey starts now...`;
  }

  private async sendResponseMessage(toNumber: string, message: string): Promise<void> {
    try {
      await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: toNumber
      });
      console.log(`Response sent to ${toNumber}`);
    } catch (error) {
      console.error('Error sending response:', error);
    }
  }

  private async getTodaysLessonText(): Promise<string> {
    const todaysLesson = await storage.getTodaysLesson();
    
    if (!todaysLesson) {
      return "No lesson found for today. The daily lesson will be generated at 7 AM EST.";
    }

    // Return text-only message for trial account compatibility
    return this.formatLessonForWhatsApp(todaysLesson);
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

    // Return text-only message for trial account compatibility
    return this.formatLessonForWhatsApp(yesterdaysLesson);
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
    
    let context = "You are a compassionate spiritual guide with deep knowledge of world religions. Answer questions about spirituality, religion, and life guidance drawing from universal wisdom traditions. Keep responses under 1500 characters for WhatsApp.";
    
    if (todaysLesson) {
      context += `\n\nToday's lesson context:\nTitle: ${todaysLesson.title}\nTradition: ${todaysLesson.passage.tradition.name}\nStory: ${todaysLesson.story}\nLife Lesson: ${todaysLesson.lifeLesson}`;
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
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

  private async handleSpiritualGuidance(message: string): Promise<string> {
    try {
      const todaysLesson = await storage.getTodaysLesson();
      const lessonContext = todaysLesson 
        ? `Today's lesson: "${todaysLesson.title}" from ${todaysLesson.passage.tradition.name}. Life lesson: ${todaysLesson.lifeLesson}.` 
        : "";

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          { 
            role: "system", 
            content: `You are a compassionate spiritual guide with deep knowledge of world religions and wisdom traditions. ${lessonContext} Provide thoughtful, non-denominational spiritual guidance that draws from universal wisdom. Keep responses under 1500 characters for WhatsApp.`
          },
          { role: "user", content: message }
        ],
        max_tokens: 400
      });

      const guidance = response.choices[0].message.content || "Peace be with you on your spiritual journey.";
      return `🙏 *Spiritual Guidance*\n\n${guidance}`;
    } catch (error) {
      console.error('Error with OpenAI spiritual guidance:', error);
      return "I'm here to help with spiritual guidance. Please try asking your question again.";
    }
  }

  private async getRandomInspiration(): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          { 
            role: "system", 
            content: "Generate an inspiring spiritual quote or reflection drawing from world wisdom traditions. Include the source tradition (Bible, Quran, Buddhism, Hinduism, Taoism, Judaism, etc.). Keep under 1400 characters for WhatsApp."
          },
          { role: "user", content: "Give me spiritual inspiration for today" }
        ],
        max_tokens: 350
      });

      const inspiration = response.choices[0].message.content || "May you find peace and wisdom in each moment of your journey.";
      return `✨ *Daily Inspiration*\n\n${inspiration}`;
    } catch (error) {
      console.error('Error generating inspiration:', error);
      return "✨ *Daily Inspiration*\n\nMay you find peace, wisdom, and compassion in each moment of your spiritual journey today.";
    }
  }

  private async getTraditionsList(): Promise<string> {
    try {
      const traditions = await storage.getAllTraditions();
      let response = "📚 *Spiritual Traditions Available*\n\n";
      
      traditions.forEach(tradition => {
        response += `• ${tradition.name} - Type "${tradition.slug}"\n`;
      });
      
      response += "\n*Commands:*\n• \"today\" - Today's lesson\n• \"inspire\" - Random inspiration\n• Ask any spiritual question!";
      
      return response;
    } catch (error) {
      console.error('Error getting traditions:', error);
      return "📚 *Available Traditions*\n\n• Bible\n• Quran\n• Bhagavad Gita\n• Dhammapada\n• Tao Te Ching\n• Upanishads\n• Talmud\n\nType the tradition name or ask any spiritual question!";
    }
  }

  private getHelpText(isSubscribed: boolean = false): string {
    if (!isSubscribed) {
      return `🙏 *Spiritual Wisdom Bot*

*To get started:*
• Reply "subscribe" to join daily lessons

*Commands available after subscribing:*
• "today" - Today's lesson
• "inspire" - Random inspiration
• "traditions" - Browse spiritual paths
• Ask any spiritual question

Daily lessons sent at 7 AM EST ✨`;
    }

    return `🙏 *Spiritual Lessons Bot*

*Commands:*
• "today" - Today's lesson
• "yesterday" - Yesterday's lesson  
• "inspire" - Random inspiration
• "traditions" - Browse all traditions
• "bible", "quran", "gita" - Latest from tradition

*Ask Questions:*
Just type naturally about spirituality or life guidance

*Examples:*
• "What does today's lesson mean?"
• "How can I practice patience?"
• "Help me find inner peace"

*Manage:*
• "unsubscribe" - Stop daily lessons

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
    const websiteUrl = process.env.REPL_SLUG ? `https://${process.env.REPL_ID}.replit.app` : 'https://soulwisdom.replit.app';
    
    // Build complete message without truncation
    const header = `🙏 *${lesson.title}*\n📖 _${lesson.passage.tradition.name}_ • ${date}\n📍 ${lesson.passage.source}\n\n`;
    const storySection = `*Today's Story:*\n${lesson.story}\n\n`;
    const lifeLessonSection = `*Life Lesson:*\n${lesson.lifeLesson}\n\n`;
    const websiteSection = `🌐 *Read on Website:* ${websiteUrl}\n\n`;
    const commandsSection = `💬 Ask me any spiritual questions!\n\nCommands: "inspire", "traditions", "help"`;
    
    const fullMessage = `${header}${storySection}${lifeLessonSection}${websiteSection}${commandsSection}`;
    
    // WhatsApp supports up to 4096 characters, so send full content
    return fullMessage;
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