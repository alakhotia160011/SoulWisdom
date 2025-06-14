// @ts-ignore
import qrcode from 'qrcode-terminal';
import OpenAI from 'openai';
import { storage } from './storage';
import { LessonWithDetails } from '../shared/schema';

const whatsappWeb = require('whatsapp-web.js');
const { Client, LocalAuth } = whatsappWeb;

interface WhatsAppConfig {
  adminNumber: string; // Your WhatsApp number
  openaiApiKey: string;
}

export class WhatsAppService {
  private client: any;
  private openai: OpenAI;
  private adminNumber: string;
  private isReady: boolean = false;

  constructor(config: WhatsAppConfig) {
    this.adminNumber = config.adminNumber;
    this.openai = new OpenAI({ apiKey: config.openaiApiKey });
    
    this.client = new Client({
      authStrategy: new LocalAuth({
        clientId: "spiritual-lessons-bot"
      }),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.client.on('qr', (qr) => {
      console.log('Scan this QR code with your WhatsApp:');
      qrcode.generate(qr, { small: true });
    });

    this.client.on('ready', () => {
      console.log('✓ WhatsApp client is ready!');
      this.isReady = true;
      this.sendWelcomeMessage();
    });

    this.client.on('message', async (message) => {
      await this.handleMessage(message);
    });

    this.client.on('disconnected', (reason) => {
      console.log('WhatsApp client disconnected:', reason);
      this.isReady = false;
    });
  }

  async initialize() {
    try {
      console.log('Starting WhatsApp client...');
      await this.client.initialize();
    } catch (error) {
      console.error('Failed to initialize WhatsApp client:', error);
    }
  }

  private async sendWelcomeMessage() {
    const welcomeText = `🙏 *Spiritual Lessons WhatsApp Bot*

Welcome! I can help you with:
• Get today's lesson: "today"
• Get yesterday's lesson: "yesterday" 
• Ask questions about lessons: Just ask naturally
• Get lesson by tradition: "bible", "quran", "gita", etc.

Ready to explore spiritual wisdom together!`;

    await this.sendToAdmin(welcomeText);
  }

  private async handleMessage(message: Message) {
    // Only respond to the admin number
    const contact = await message.getContact();
    const phoneNumber = contact.number;
    
    if (phoneNumber !== this.adminNumber.replace(/\D/g, '')) {
      return;
    }

    const messageText = message.body.toLowerCase().trim();
    
    try {
      if (messageText === 'today') {
        await this.sendTodaysLesson(message);
      } else if (messageText === 'yesterday') {
        await this.sendYesterdaysLesson(message);
      } else if (['bible', 'quran', 'gita', 'dhammapada', 'tao', 'upanishads', 'talmud'].includes(messageText)) {
        await this.sendLessonByTradition(message, messageText);
      } else if (messageText.includes('?') || messageText.startsWith('what') || messageText.startsWith('how') || messageText.startsWith('why')) {
        await this.handleQuestion(message);
      } else if (messageText === 'help') {
        await this.sendHelpMessage(message);
      } else {
        await this.handleGeneralMessage(message);
      }
    } catch (error) {
      console.error('Error handling WhatsApp message:', error);
      await message.reply('Sorry, I encountered an error. Please try again.');
    }
  }

  private async sendTodaysLesson(message: Message) {
    const todaysLesson = await storage.getTodaysLesson();
    
    if (!todaysLesson) {
      await message.reply("No lesson found for today. The daily lesson will be generated at 7 AM EST.");
      return;
    }

    const lessonText = this.formatLessonForWhatsApp(todaysLesson);
    await message.reply(lessonText);
  }

  private async sendYesterdaysLesson(message: Message) {
    const recentLessons = await storage.getRecentLessons(2, 0);
    const yesterdaysLesson = recentLessons.find(lesson => {
      const lessonDate = new Date(lesson.date);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return lessonDate.toDateString() === yesterday.toDateString();
    });

    if (!yesterdaysLesson) {
      await message.reply("No lesson found for yesterday.");
      return;
    }

    const lessonText = this.formatLessonForWhatsApp(yesterdaysLesson);
    await message.reply(lessonText);
  }

  private async sendLessonByTradition(message: Message, tradition: string) {
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
      await message.reply("Tradition not found. Available: bible, quran, gita, dhammapada, tao, upanishads, talmud");
      return;
    }

    const lessons = await storage.getLessonsByTradition(traditionSlug, 1, 0);
    if (lessons.length === 0) {
      await message.reply(`No lessons found for ${tradition}`);
      return;
    }

    const lessonText = this.formatLessonForWhatsApp(lessons[0]);
    await message.reply(lessonText);
  }

  private async handleQuestion(message: Message) {
    const question = message.body;
    
    // Get today's lesson for context
    const todaysLesson = await storage.getTodaysLesson();
    
    let context = "You are a spiritual wisdom assistant. Answer questions about spirituality, religion, and life lessons.";
    
    if (todaysLesson) {
      context += `\n\nToday's lesson context:\nTitle: ${todaysLesson.title}\nTradition: ${todaysLesson.passage.tradition.name}\nStory: ${todaysLesson.story}\nLife Lesson: ${todaysLesson.lifeLesson}`;
    }

    try {
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: context },
          { role: "user", content: question }
        ],
        max_tokens: 500
      });

      const answer = response.choices[0].message.content || "I couldn't generate an answer.";
      await message.reply(`🤔 *Spiritual Guidance*\n\n${answer}`);
    } catch (error) {
      console.error('Error with OpenAI:', error);
      await message.reply("I'm having trouble accessing spiritual guidance right now. Please try again later.");
    }
  }

  private async sendHelpMessage(message: Message) {
    const helpText = `🙏 *Spiritual Lessons Bot Commands*

*Get Lessons:*
• "today" - Today's lesson
• "yesterday" - Yesterday's lesson
• "bible", "quran", "gita" - Latest from tradition

*Ask Questions:*
Just ask naturally about spirituality, lessons, or life guidance

*Examples:*
• "What does today's lesson mean?"
• "How can I practice patience?"
• "What does the Bible say about forgiveness?"

Type anything to get started! 🌟`;

    await message.reply(helpText);
  }

  private async handleGeneralMessage(message: Message) {
    const generalText = message.body;
    
    try {
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { 
            role: "system", 
            content: "You are a wise spiritual guide. Respond to messages with spiritual wisdom, encouragement, and practical guidance. Keep responses concise and meaningful." 
          },
          { role: "user", content: generalText }
        ],
        max_tokens: 300
      });

      const reply = response.choices[0].message.content || "Peace be with you.";
      await message.reply(`🙏 ${reply}`);
    } catch (error) {
      console.error('Error with OpenAI:', error);
      await message.reply("Peace be with you. How can I help you with spiritual guidance today?");
    }
  }

  private formatLessonForWhatsApp(lesson: LessonWithDetails): string {
    const date = new Date(lesson.date).toLocaleDateString();
    
    return `🙏 *${lesson.title}*
📖 _${lesson.passage.tradition.name}_ • ${date}
📍 ${lesson.passage.source}

*Today's Story:*
${lesson.story}

*Life Lesson:*
${lesson.lifeLesson}

🖼️ _Spiritual artwork created for this lesson_

Type a question to explore this lesson deeper!`;
  }

  async sendDailyLessonToAdmin(lesson: LessonWithDetails) {
    if (!this.isReady) {
      console.log('WhatsApp not ready, skipping daily lesson send');
      return;
    }

    const lessonText = `🌅 *Daily Spiritual Lesson*\n\n${this.formatLessonForWhatsApp(lesson)}`;
    await this.sendToAdmin(lessonText);
  }

  private async sendToAdmin(text: string) {
    try {
      const chatId = this.adminNumber + '@c.us';
      await this.client.sendMessage(chatId, text);
      console.log('✓ Message sent to admin via WhatsApp');
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
    }
  }

  async destroy() {
    await this.client.destroy();
  }
}

// Export singleton instance
let whatsappService: WhatsAppService | null = null;

export function initializeWhatsApp(adminNumber: string, openaiApiKey: string) {
  if (!whatsappService) {
    whatsappService = new WhatsAppService({
      adminNumber,
      openaiApiKey
    });
    whatsappService.initialize();
  }
  return whatsappService;
}

export function getWhatsAppService() {
  return whatsappService;
}