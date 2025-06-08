import { storage } from "./storage";
import { generateTodaysLesson } from "./lesson-generator";

// Simple in-memory scheduler for daily lesson generation
class DailyScheduler {
  private scheduledTime: { hour: number; minute: number };
  private isRunning: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;

  constructor(hour: number = 6, minute: number = 0) {
    this.scheduledTime = { hour, minute };
  }

  start() {
    if (this.isRunning) {
      console.log("Scheduler is already running");
      return;
    }

    this.isRunning = true;
    console.log(`Daily lesson scheduler started - will generate lessons at ${this.scheduledTime.hour}:${this.scheduledTime.minute.toString().padStart(2, '0')}`);

    // Check every minute if it's time to generate a lesson
    this.intervalId = setInterval(() => {
      this.checkAndGenerateLesson();
    }, 60000); // Check every minute
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log("Daily lesson scheduler stopped");
  }

  private async checkAndGenerateLesson() {
    const now = new Date();
    const isScheduledTime = now.getHours() === this.scheduledTime.hour && 
                           now.getMinutes() === this.scheduledTime.minute;

    if (isScheduledTime) {
      await this.generateLessonIfNeeded();
    }
  }

  private async generateLessonIfNeeded() {
    try {
      console.log("Checking if today's lesson exists...");
      const existingLesson = await storage.getTodaysLesson();
      
      if (!existingLesson) {
        console.log("Generating today's spiritual lesson...");
        const newLesson = await generateTodaysLesson(storage);
        
        if (newLesson) {
          console.log(`✓ Generated lesson: "${newLesson.title}"`);
          
          // Generate email template for subscribers
          await this.generateEmailTemplate(newLesson);
        } else {
          console.error("Failed to generate today's lesson");
        }
      } else {
        console.log(`Today's lesson already exists: "${existingLesson.title}"`);
      }
    } catch (error) {
      console.error("Error in daily lesson generation:", error);
    }
  }

  private async generateEmailTemplate(lesson: any) {
    try {
      const subscribers = await storage.getActiveSubscriptions();
      console.log(`Preparing email template for ${subscribers.length} subscribers`);

      // Create email template that can be copied to Gmail
      const emailTemplate = this.createEmailTemplate(lesson);
      
      // Log template generation success
      console.log(`✓ Email template generated for ${subscribers.length} subscribers`);
      console.log("📧 Template available at /email-admin for Gmail sending");
      
    } catch (error) {
      console.error("Error generating email template:", error);
    }
  }

  private createEmailTemplate(lesson: any): string {
    const today = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily Spiritual Lesson - ${today}</title>
    <style>
        body {
            font-family: 'Georgia', serif;
            line-height: 1.6;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f7f4;
            color: #2c2c2c;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #8b7355;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #8b7355;
            font-size: 2.2em;
            margin: 0;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }
        .date {
            color: #666;
            font-style: italic;
            margin-top: 10px;
        }
        .lesson-container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            margin-bottom: 25px;
        }
        .lesson-title {
            color: #8b7355;
            font-size: 1.8em;
            margin-bottom: 20px;
            text-align: center;
            border-bottom: 1px solid #eee;
            padding-bottom: 15px;
        }
        .source {
            font-style: italic;
            color: #666;
            text-align: center;
            margin-bottom: 25px;
            font-size: 1.1em;
        }
        .artwork {
            text-align: center;
            margin: 25px 0;
        }
        .artwork img {
            max-width: 100%;
            height: auto;
            border-radius: 6px;
            box-shadow: 0 3px 8px rgba(0,0,0,0.15);
        }
        .story {
            font-size: 1.1em;
            line-height: 1.8;
            margin-bottom: 25px;
            text-align: justify;
        }
        .life-lesson {
            background: #f8f6f3;
            padding: 20px;
            border-left: 4px solid #8b7355;
            font-style: italic;
            font-size: 1.15em;
            margin: 25px 0;
            border-radius: 0 6px 6px 0;
        }
        .footer {
            text-align: center;
            padding: 20px 0;
            border-top: 2px solid #eee;
            margin-top: 30px;
            font-size: 0.9em;
            color: #666;
        }
        .tradition-badge {
            display: inline-block;
            background: #8b7355;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.85em;
            margin-bottom: 15px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Daily Spiritual Lesson</h1>
        <div class="date">${today}</div>
    </div>

    <div class="lesson-container">
        <div class="tradition-badge">${lesson.passage?.tradition?.name || 'Sacred Teaching'}</div>
        <h2 class="lesson-title">${lesson.title}</h2>
        <div class="source">${lesson.passage?.source || 'Ancient Wisdom'}</div>
        
        <div class="artwork">
            <img src="${lesson.artworkUrl}" alt="${lesson.artworkDescription}" />
            <div style="font-size: 0.85em; color: #666; margin-top: 8px; font-style: italic;">
                ${lesson.artworkDescription}
            </div>
        </div>

        <div class="story">
            ${lesson.story.split('\n').map((paragraph: string) => 
                paragraph.trim() ? `<p>${paragraph}</p>` : ''
            ).join('')}
        </div>

        <div class="life-lesson">
            <strong>Today's Reflection:</strong><br>
            ${lesson.lifeLesson}
        </div>
    </div>

    <div class="footer">
        <p>May this wisdom bring peace and guidance to your day.</p>
        <p><em>Daily Spiritual Lessons - Connecting ancient wisdom with modern life</em></p>
    </div>
</body>
</html>`;
  }

  // Method to get current subscribers for manual Gmail sending
  async getSubscriberEmails(): Promise<string[]> {
    try {
      const subscribers = await storage.getActiveSubscriptions();
      return subscribers.map(sub => sub.email);
    } catch (error) {
      console.error("Error fetching subscriber emails:", error);
      return [];
    }
  }
}

// Export singleton instance
export const dailyScheduler = new DailyScheduler(6, 0); // 6:00 AM

// Export function to get email template for manual sending
export async function getTodaysEmailTemplate(): Promise<string | null> {
  try {
    const lesson = await storage.getTodaysLesson();
    if (!lesson) {
      return null;
    }

    const scheduler = new DailyScheduler();
    return (scheduler as any).createEmailTemplate(lesson);
  } catch (error) {
    console.error("Error creating email template:", error);
    return null;
  }
}

export async function getSubscriberEmailList(): Promise<string[]> {
  try {
    const subscribers = await storage.getActiveSubscriptions();
    return subscribers.map(sub => sub.email);
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    return [];
  }
}