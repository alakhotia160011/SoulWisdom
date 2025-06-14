import OpenAI from 'openai';
import { storage } from './storage';
import { LessonWithDetails } from '../shared/schema';

export class WhatsAppManualService {
  private openai: OpenAI;
  private adminNumber: string;

  constructor(adminNumber: string, openaiApiKey: string) {
    this.adminNumber = adminNumber;
    this.openai = new OpenAI({ apiKey: openaiApiKey });
  }

  async processCommand(command: string): Promise<string> {
    const messageText = command.toLowerCase().trim();
    
    try {
      if (messageText === 'today') {
        return await this.getTodaysLessonText();
      } else if (messageText === 'yesterday') {
        return await this.getYesterdaysLessonText();
      } else if (['bible', 'quran', 'gita', 'dhammapada', 'tao', 'upanishads', 'talmud'].includes(messageText)) {
        return await this.getLessonByTraditionText(messageText);
      } else if (messageText.includes('?') || messageText.startsWith('what') || messageText.startsWith('how') || messageText.startsWith('why')) {
        return await this.handleQuestionText(command);
      } else if (messageText === 'help') {
        return this.getHelpText();
      } else {
        return await this.handleGeneralMessageText(command);
      }
    } catch (error) {
      console.error('Error processing WhatsApp command:', error);
      return 'Sorry, I encountered an error. Please try again.';
    }
  }

  private async getTodaysLessonText(): Promise<string> {
    const todaysLesson = await storage.getTodaysLesson();
    
    if (!todaysLesson) {
      return "No lesson found for today. The daily lesson will be generated at 7 AM EST.";
    }

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

    return this.formatLessonForWhatsApp(yesterdaysLesson);
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

    return this.formatLessonForWhatsApp(lessons[0]);
  }

  private async handleQuestionText(question: string): Promise<string> {
    const todaysLesson = await storage.getTodaysLesson();
    
    let context = "You are a spiritual wisdom assistant. Answer questions about spirituality, religion, and life lessons.";
    
    if (todaysLesson) {
      context += `\n\nToday's lesson context:\nTitle: ${todaysLesson.title}\nTradition: ${todaysLesson.passage.tradition.name}\nStory: ${todaysLesson.story}\nLife Lesson: ${todaysLesson.lifeLesson}`;
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: context },
          { role: "user", content: question }
        ],
        max_tokens: 500
      });

      const answer = response.choices[0].message.content || "I couldn't generate an answer.";
      return `🤔 *Spiritual Guidance*\n\n${answer}`;
    } catch (error) {
      console.error('Error with OpenAI:', error);
      return "I'm having trouble accessing spiritual guidance right now. Please try again later.";
    }
  }

  private getHelpText(): string {
    return `🙏 *Spiritual Lessons Bot Commands*

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
  }

  private async handleGeneralMessageText(generalText: string): Promise<string> {
    try {
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
      return `🙏 ${reply}`;
    } catch (error) {
      console.error('Error with OpenAI:', error);
      return "Peace be with you. How can I help you with spiritual guidance today?";
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

  getDailyLessonMessage(lesson: LessonWithDetails): string {
    return `🌅 *Daily Spiritual Lesson*\n\n${this.formatLessonForWhatsApp(lesson)}`;
  }
}

let whatsappManualService: WhatsAppManualService | null = null;

export function initializeWhatsAppManual(adminNumber: string, openaiApiKey: string) {
  if (!whatsappManualService) {
    whatsappManualService = new WhatsAppManualService(adminNumber, openaiApiKey);
    console.log('✓ WhatsApp manual service initialized');
  }
  return whatsappManualService;
}

export function getWhatsAppManualService() {
  return whatsappManualService;
}