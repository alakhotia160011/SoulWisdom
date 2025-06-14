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
        .website-button {
            background-color: #8b7355;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
        }
        .website-button:hover {
            background-color: #6d5a44;
        }
        .button-container {
            text-align: center;
            margin: 30px 0;
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
            <img src="${this.getImageSrcForEmail(lesson)}" alt="${lesson.artworkDescription}" />
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

        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
            <tr>
                <td align="center">
                    <a href="${this.getWebsiteUrl()}/lesson/${lesson.id}" 
                       style="background-color: #8b7355; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                        Read Today's Lesson Online
                    </a>
                </td>
            </tr>
        </table>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <tr>
                <td align="center" style="color: #666; font-size: 14px;">
                    <p><strong>Daily Spiritual Lessons</strong></p>
                    <p>Wisdom from ${lesson.passage.tradition.name} and other sacred traditions</p>
                    <p style="color: #999; font-size: 12px; margin-top: 10px;">
                        You're receiving this because you subscribed to Daily Spiritual Lessons.<br>
                        To unsubscribe, reply with "unsubscribe" in the subject line.
                    </p>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>`;
  }

  private createLessonEmailText(lesson: LessonWithDetails, today: string): string {
    const baseUrl = process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : 'http://localhost:5000';
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
View artwork: ${baseUrl}${lesson.artworkUrl}

READ TODAY'S LESSON ONLINE
${this.getWebsiteUrl()}/lesson/${lesson.id}

---
Daily Spiritual Lessons
Wisdom from ${lesson.passage.tradition.name} and other sacred traditions

To unsubscribe, reply with "unsubscribe" in the subject line.
    `.trim();
  }

  private createWelcomeEmailTemplate(subscriberEmail: string, todaysLesson?: LessonWithDetails): string {
    // Use deployment URL if available, otherwise local
    const baseUrl = this.getWebsiteUrl();
    
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
            background-color: #f4f4f4;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #8b7355;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .title {
            color: #8b7355;
            font-size: 28px;
            margin: 0;
        }
        .subtitle {
            color: #666;
            font-size: 16px;
            margin: 5px 0 0 0;
        }
        .welcome-text {
            font-size: 16px;
            margin: 20px 0;
        }
        .lesson-preview {
            background-color: #f8f8f8;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #8b7355;
            margin: 25px 0;
        }
        .lesson-preview h3 {
            color: #8b7355;
            margin-top: 0;
            font-size: 20px;
        }
        .cta-button {
            display: inline-block;
            background-color: #8b7355;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 15px 0;
        }
        .traditions-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin: 20px 0;
        }
        .tradition-item {
            background-color: #f0f0f0;
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
            <h1 class="title">Daily Spiritual Lessons</h1>
            <p class="subtitle">Welcome to Your Journey</p>
        </div>

        <div class="welcome-text">
            <p>Hello <strong>${subscriberEmail}</strong>,</p>
            <p>Thank you for subscribing to Daily Spiritual Lessons. You'll receive meaningful insights from seven sacred traditions every day at 6:00 AM.</p>
        </div>

        <div class="traditions-grid">
            <div class="tradition-item">† Bible</div>
            <div class="tradition-item">☪ Qur'an</div>
            <div class="tradition-item">ॐ Bhagavad Gita</div>
            <div class="tradition-item">❋ Dhammapada</div>
            <div class="tradition-item">☯ Tao Te Ching</div>
            <div class="tradition-item">◉ Upanishads</div>
            <div class="tradition-item">✡ Talmud & Midrash</div>
        </div>

        ${todaysLesson ? `
        <div class="lesson-preview">
            <h3>Today's Lesson Preview</h3>
            <p><strong>${todaysLesson.title}</strong></p>
            <p style="font-style: italic; color: #666;">From ${todaysLesson.passage.tradition.name} - ${todaysLesson.passage.source}</p>
            <p style="text-align: center;">
                <a href="${baseUrl}/lesson/${todaysLesson.id}" class="cta-button">Read Today's Lesson</a>
            </p>
        </div>
        ` : `
        <div class="lesson-preview">
            <h3>Start Exploring</h3>
            <p>Visit our platform to discover daily spiritual wisdom and begin your journey.</p>
            <p style="text-align: center;">
                <a href="${baseUrl}" class="cta-button">Visit Daily Spiritual Lessons</a>
            </p>
        </div>
        `}

        <div class="footer">
            <p>Daily Spiritual Lessons<br>
            Wisdom from sacred traditions around the world</p>
            <p style="font-size: 12px; margin-top: 15px;">
                You're receiving this because you subscribed to Daily Spiritual Lessons.<br>
                To unsubscribe, reply with "unsubscribe" in the subject line.
            </p>
        </div>
    </div>
</body>
</html>`;
  }

  private createWelcomeEmailText(subscriberEmail: string, todaysLesson?: LessonWithDetails): string {
    const baseUrl = this.getWebsiteUrl();
    
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

Read today's lesson: ${baseUrl}/lesson/${todaysLesson.id}
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

  private getImageSrcForEmail(lesson: LessonWithDetails): string {
    // Use the email artwork URL if available (OpenAI generated image)
    if (lesson.emailArtworkUrl && lesson.emailArtworkUrl.startsWith('http')) {
      return lesson.emailArtworkUrl;
    }
    
    // If no email artwork URL, check if main artwork URL is external (OpenAI URL)
    if (lesson.artworkUrl && lesson.artworkUrl.startsWith('http')) {
      return lesson.artworkUrl;
    }

    // For data URIs, use them directly
    if (lesson.artworkUrl && lesson.artworkUrl.startsWith('data:')) {
      return lesson.artworkUrl;
    }
    
    // For local files, we need to serve them through the web server
    if (lesson.artworkUrl && lesson.artworkUrl.startsWith('/artwork/')) {
      const baseUrl = process.env.REPLIT_DOMAINS ? 
        `https://${process.env.REPLIT_DOMAINS.split(',')[0]}` : 
        'http://localhost:5000';
      return `${baseUrl}${lesson.artworkUrl}`;
    }
    
    // Final fallback to a simple SVG
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f4f1e8'/%3E%3Ctext x='200' y='150' text-anchor='middle' font-family='serif' font-size='14' fill='%23654321'%3ESpiritual Artwork%3C/text%3E%3C/svg%3E";
  }

  async sendNewSubscriberNotification(subscriberEmail: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: {
          name: 'Daily Spiritual Lessons',
          address: EMAIL_CONFIG.EMAIL_ADDRESS
        },
        to: "ary.lakhotia@gmail.com",
        subject: "New Subscriber - Daily Spiritual Lessons",
        text: `A new subscriber has joined Daily Spiritual Lessons: ${subscriberEmail}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #8b7355; text-align: center; margin-bottom: 30px;">New Subscriber Alert</h1>
            <div style="background-color: #f8f6f3; padding: 20px; border-radius: 8px; border-left: 4px solid #8b7355; margin-bottom: 20px;">
              <h2 style="color: #333; margin-top: 0;">Subscriber Details</h2>
              <p style="margin: 10px 0; font-size: 16px; color: #333;">
                <strong>Email:</strong> ${subscriberEmail}
              </p>
              <p style="margin: 10px 0; color: #666; font-size: 14px;">
                <strong>Subscribed on:</strong> ${new Date().toLocaleString('en-US', { 
                  timeZone: 'America/New_York',
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZoneName: 'short'
                })}
              </p>
            </div>
            <p style="color: #666; font-size: 14px; text-align: center; border-top: 1px solid #ddd; padding-top: 15px; margin-top: 30px;">
              Daily Spiritual Lessons - Admin Notification System
            </p>
          </div>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✓ New subscriber notification sent to admin`);
      console.log(`Message ID: ${info.messageId}`);
      
      return true;
    } catch (error) {
      console.error("Failed to send new subscriber notification:", error);
      return false;
    }
  }

  private getWebsiteUrl(): string {
    // Use the deployed website URL
    return 'https://soul-wisdom-arylakhotia.replit.app';
  }
}

export const emailService = new EmailService();