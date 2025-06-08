import nodemailer from 'nodemailer';
import type { LessonWithDetails, Subscription } from '@shared/schema';

const EMAIL_CONFIG = {
  EMAIL_HOST: "smtp.gmail.com",
  EMAIL_PORT: 587,
  EMAIL_ADDRESS: "ary.lakhotia@gmail.com",
  ADMIN_EMAILS: ["ary.lakhotia@gmail.com", "dhwanilfs@gmail.com"]
};

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: EMAIL_CONFIG.EMAIL_HOST,
      port: EMAIL_CONFIG.EMAIL_PORT,
      secure: false,
      auth: {
        user: EMAIL_CONFIG.EMAIL_ADDRESS,
        pass: 'mfqmmhuegicitzos'
      }
    });
  }

  async sendDailyLesson(lesson: LessonWithDetails, subscribers: Subscription[]): Promise<boolean> {
    try {
      if (subscribers.length === 0) {
        console.log("No subscribers to send emails to");
        return true;
      }

      const today = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

      const emailHtml = this.createLessonEmailTemplate(lesson, today);
      const emailText = this.createLessonEmailText(lesson, today);
      const subscriberEmails = subscribers.map(sub => sub.email);

      const mailOptions = {
        from: {
          name: 'Daily Spiritual Lessons',
          address: EMAIL_CONFIG.EMAIL_ADDRESS
        },
        to: EMAIL_CONFIG.EMAIL_ADDRESS,
        bcc: subscriberEmails,
        subject: `Daily Spiritual Lesson - ${lesson.title}`,
        text: emailText,
        html: emailHtml
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✓ Daily lesson email sent to ${subscriberEmails.length} subscribers`);
      console.log(`Message ID: ${info.messageId}`);
      
      return true;
    } catch (error) {
      console.error("Error sending daily lesson email:", error);
      return false;
    }
  }

  async sendWelcomeEmail(subscriberEmail: string, todaysLesson?: LessonWithDetails): Promise<boolean> {
    try {
      const welcomeHtml = this.createWelcomeEmailTemplate(subscriberEmail, todaysLesson);
      const welcomeText = this.createWelcomeEmailText(subscriberEmail, todaysLesson);

      const mailOptions = {
        from: {
          name: 'Daily Spiritual Lessons',
          address: EMAIL_CONFIG.EMAIL_ADDRESS
        },
        to: subscriberEmail,
        subject: 'Welcome to Daily Spiritual Lessons - Your Journey Begins',
        text: welcomeText,
        html: welcomeHtml
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✓ Welcome email sent to ${subscriberEmail}`);
      console.log(`Message ID: ${info.messageId}`);
      
      return true;
    } catch (error) {
      console.error("Error sending welcome email:", error);
      return false;
    }
  }

  async sendTestEmail(): Promise<boolean> {
    try {
      const mailOptions = {
        from: {
          name: 'Daily Spiritual Lessons',
          address: EMAIL_CONFIG.EMAIL_ADDRESS
        },
        to: EMAIL_CONFIG.ADMIN_EMAILS,
        subject: 'Daily Spiritual Lessons - Email System Test',
        text: 'This is a test email to verify the email system is working correctly.',
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #8b7355; text-align: center;">Email System Test</h1>
            <p>This is a test email to verify the Daily Spiritual Lessons email system is working correctly.</p>
            <p>If you received this email, the automated email sending is functioning properly.</p>
            <hr style="border: 1px solid #8b7355; margin: 20px 0;">
            <p style="text-align: center; color: #666; font-size: 14px;">
              Daily Spiritual Lessons Platform<br>
              Automated Email System
            </p>
          </div>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✓ Test email sent successfully`);
      console.log(`Message ID: ${info.messageId}`);
      
      return true;
    } catch (error) {
      console.error("Error sending test email:", error);
      return false;
    }
  }

  private createLessonEmailTemplate(lesson: LessonWithDetails, today: string): string {
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
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #8b7355;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .tradition-badge {
            background-color: #8b7355;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 14px;
            display: inline-block;
            margin-bottom: 10px;
        }
        .lesson-title {
            color: #8b7355;
            font-size: 28px;
            margin: 10px 0;
        }
        .source {
            color: #666;
            font-style: italic;
            margin-bottom: 20px;
        }
        .artwork {
            text-align: center;
            margin: 20px 0;
        }
        .artwork img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .story {
            background-color: #f8f8f8;
            padding: 20px;
            border-left: 4px solid #8b7355;
            margin: 20px 0;
            border-radius: 5px;
        }
        .life-lesson {
            background-color: #e8f4f8;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #b3d9e8;
            margin: 20px 0;
        }
        .life-lesson h3 {
            color: #2c5282;
            margin-top: 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 14px;
        }
        .unsubscribe {
            color: #999;
            font-size: 12px;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="tradition-badge">${lesson.passage.tradition.name}</div>
            <h1 class="lesson-title">${lesson.title}</h1>
            <p class="source">${lesson.passage.source}</p>
            <p style="color: #666; font-size: 16px;">${today}</p>
        </div>

        <div class="artwork">
            <img src="${lesson.artworkUrl}" alt="${lesson.artworkDescription}" />
            <p style="font-style: italic; color: #666; font-size: 14px; margin-top: 10px;">
                ${lesson.artworkDescription}
            </p>
        </div>

        <div class="story">
            <h3 style="color: #8b7355; margin-top: 0;">Today's Story</h3>
            <p>${lesson.story}</p>
        </div>

        <div class="life-lesson">
            <h3>Life Lesson</h3>
            <p><strong>${lesson.lifeLesson}</strong></p>
        </div>

        <div class="footer">
            <p><strong>Daily Spiritual Lessons</strong></p>
            <p>Wisdom from ${lesson.passage.tradition.name} and other sacred traditions</p>
            <p class="unsubscribe">
                You're receiving this because you subscribed to Daily Spiritual Lessons.<br>
                To unsubscribe, reply with "unsubscribe" in the subject line.
            </p>
        </div>
    </div>
</body>
</html>`;
  }

  private createLessonEmailText(lesson: LessonWithDetails, today: string): string {
    return `
DAILY SPIRITUAL LESSON - ${today}

${lesson.passage.tradition.name}: ${lesson.title}
Source: ${lesson.passage.source}

TODAY'S STORY
${lesson.story}

LIFE LESSON
${lesson.lifeLesson}

ARTWORK
${lesson.artworkDescription}
View artwork: ${lesson.artworkUrl}

---
Daily Spiritual Lessons
Wisdom from ${lesson.passage.tradition.name} and other sacred traditions

To unsubscribe, reply with "unsubscribe" in the subject line.
    `.trim();
  }

  private createWelcomeEmailTemplate(subscriberEmail: string, todaysLesson?: LessonWithDetails): string {
    const baseUrl = process.env.NODE_ENV === 'production' ? 'https://your-domain.replit.app' : 'http://localhost:5000';
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Daily Spiritual Lessons</title>
    <style>
        body {
            font-family: 'Georgia', serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #8b7355;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .welcome-title {
            color: #8b7355;
            font-size: 32px;
            margin: 10px 0;
        }
        .welcome-message {
            background-color: #f8f8f8;
            padding: 20px;
            border-left: 4px solid #8b7355;
            margin: 20px 0;
            border-radius: 5px;
        }
        .lesson-preview {
            background-color: #e8f4f8;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #b3d9e8;
            margin: 20px 0;
            text-align: center;
        }
        .cta-button {
            display: inline-block;
            background-color: #8b7355;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            margin: 20px 0;
        }
        .traditions-list {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin: 20px 0;
        }
        .tradition-item {
            background-color: #f5f5f5;
            padding: 10px;
            border-radius: 5px;
            text-align: center;
            font-size: 14px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="welcome-title">Welcome to Your Spiritual Journey</h1>
            <p style="color: #666; font-size: 18px;">Daily Spiritual Lessons</p>
        </div>

        <div class="welcome-message">
            <h3 style="color: #8b7355; margin-top: 0;">Hello and Welcome!</h3>
            <p>Thank you for subscribing to Daily Spiritual Lessons. You've just taken a meaningful step toward daily spiritual growth and wisdom.</p>
            <p>Every morning at 6:00 AM, you'll receive a carefully curated lesson featuring authentic stories, teachings, and insights from seven major spiritual traditions.</p>
        </div>

        <div class="traditions-list">
            <div class="tradition-item">📖 Bible</div>
            <div class="tradition-item">🌙 Qur'an</div>
            <div class="tradition-item">🕉️ Bhagavad Gita</div>
            <div class="tradition-item">☸️ Dhammapada</div>
            <div class="tradition-item">☯️ Tao Te Ching</div>
            <div class="tradition-item">🔥 Upanishads</div>
            <div class="tradition-item">✡️ Talmud & Midrash</div>
        </div>

        ${todaysLesson ? `
        <div class="lesson-preview">
            <h3 style="color: #2c5282; margin-top: 0;">Today's Featured Lesson</h3>
            <h4 style="color: #8b7355;">${todaysLesson.title}</h4>
            <p style="font-style: italic; color: #666;">From ${todaysLesson.passage.tradition.name} - ${todaysLesson.passage.source}</p>
            <a href="${baseUrl}" class="cta-button">Read Today's Lesson</a>
        </div>
        ` : `
        <div class="lesson-preview">
            <h3 style="color: #2c5282; margin-top: 0;">Your Daily Lessons Await</h3>
            <p>Visit our platform to explore the latest spiritual insights and begin your journey of daily wisdom.</p>
            <a href="${baseUrl}" class="cta-button">Visit Daily Spiritual Lessons</a>
        </div>
        `}

        <div style="background-color: #f0f8f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="color: #2d5016; margin-top: 0;">What to Expect:</h4>
            <ul style="margin: 0; padding-left: 20px;">
                <li>Daily lessons at 6:00 AM in your timezone</li>
                <li>Beautiful AI-generated artwork in traditional styles</li>
                <li>Authentic stories from sacred texts</li>
                <li>Practical life applications and wisdom</li>
                <li>Insights from diverse spiritual traditions</li>
            </ul>
        </div>

        <div class="footer">
            <p><strong>Daily Spiritual Lessons</strong></p>
            <p>Wisdom from sacred traditions delivered to your inbox</p>
            <p style="font-size: 12px; color: #999;">
                You're receiving this welcome email because you subscribed to Daily Spiritual Lessons.<br>
                To unsubscribe, reply with "unsubscribe" in the subject line.
            </p>
        </div>
    </div>
</body>
</html>`;
  }

  private createWelcomeEmailText(subscriberEmail: string, todaysLesson?: LessonWithDetails): string {
    const baseUrl = process.env.NODE_ENV === 'production' ? 'https://your-domain.replit.app' : 'http://localhost:5000';
    
    return `
WELCOME TO DAILY SPIRITUAL LESSONS

Hello and Welcome!

Thank you for subscribing to Daily Spiritual Lessons. You've just taken a meaningful step toward daily spiritual growth and wisdom.

Every morning at 6:00 AM, you'll receive a carefully curated lesson featuring authentic stories, teachings, and insights from seven major spiritual traditions:

• Bible
• Qur'an  
• Bhagavad Gita
• Dhammapada
• Tao Te Ching
• Upanishads
• Talmud & Midrash

${todaysLesson ? `
TODAY'S FEATURED LESSON
${todaysLesson.title}
From ${todaysLesson.passage.tradition.name} - ${todaysLesson.passage.source}

Read today's lesson: ${baseUrl}
` : `
YOUR DAILY LESSONS AWAIT
Visit our platform to explore the latest spiritual insights: ${baseUrl}
`}

WHAT TO EXPECT:
• Daily lessons at 6:00 AM in your timezone
• Beautiful AI-generated artwork in traditional styles  
• Authentic stories from sacred texts
• Practical life applications and wisdom
• Insights from diverse spiritual traditions

---
Daily Spiritual Lessons
Wisdom from sacred traditions delivered to your inbox

To unsubscribe, reply with "unsubscribe" in the subject line.
    `.trim();
  }
}

export const emailService = new EmailService();