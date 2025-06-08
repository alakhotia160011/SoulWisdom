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
      secure: false, // true for 465, false for other ports
      auth: {
        user: EMAIL_CONFIG.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async sendDailyLesson(lesson: LessonWithDetails, subscribers: Subscription[]): Promise<boolean> {
    try {
      if (!process.env.EMAIL_PASSWORD) {
        console.error("EMAIL_PASSWORD not found in environment variables");
        return false;
      }

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

      // Get all subscriber emails
      const subscriberEmails = subscribers.map(sub => sub.email);

      const mailOptions = {
        from: {
          name: 'Daily Spiritual Lessons',
          address: EMAIL_CONFIG.EMAIL_ADDRESS
        },
        to: EMAIL_CONFIG.EMAIL_ADDRESS, // To field shows sender
        bcc: subscriberEmails, // BCC protects subscriber privacy
        subject: `Daily Spiritual Lesson: ${lesson.title} - ${today}`,
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
            margin: 0;
            font-size: 28px;
        }
        .date {
            color: #666;
            font-style: italic;
            margin-top: 10px;
        }
        .lesson-content {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }
        .lesson-title {
            color: #8b7355;
            font-size: 24px;
            margin-bottom: 15px;
            text-align: center;
        }
        .source {
            background: #f0ede6;
            padding: 10px 15px;
            border-left: 4px solid #8b7355;
            margin-bottom: 20px;
            font-style: italic;
        }
        .artwork {
            text-align: center;
            margin: 25px 0;
        }
        .artwork img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        .story {
            margin-bottom: 25px;
            text-align: justify;
        }
        .life-lesson {
            background: #e8f5e8;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #4a7c59;
            margin-bottom: 25px;
        }
        .life-lesson h3 {
            color: #4a7c59;
            margin-top: 0;
            margin-bottom: 10px;
        }
        .footer {
            text-align: center;
            border-top: 1px solid #ddd;
            padding-top: 20px;
            color: #666;
            font-size: 14px;
        }
        .unsubscribe {
            margin-top: 15px;
            font-size: 12px;
        }
        .unsubscribe a {
            color: #8b7355;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Daily Spiritual Lesson</h1>
        <div class="date">${today}</div>
    </div>

    <div class="lesson-content">
        <h2 class="lesson-title">${lesson.title}</h2>
        
        <div class="source">
            <strong>Source:</strong> ${lesson.passage.source} (${lesson.passage.tradition.name})
        </div>

        ${lesson.artworkUrl ? `
        <div class="artwork">
            <img src="${lesson.artworkUrl}" alt="${lesson.artworkDescription}" />
            <div style="font-size: 12px; color: #666; margin-top: 8px; font-style: italic;">
                ${lesson.artworkDescription}
            </div>
        </div>
        ` : ''}

        <div class="story">
            ${lesson.story.split('\n').map(paragraph => paragraph.trim() ? `<p>${paragraph}</p>` : '').join('')}
        </div>

        <div class="life-lesson">
            <h3>Today's Life Lesson</h3>
            <p><strong>${lesson.lifeLesson}</strong></p>
        </div>
    </div>

    <div class="footer">
        <p>Thank you for joining our community of spiritual seekers.</p>
        <p>May today's wisdom bring you peace and guidance.</p>
        
        <div class="unsubscribe">
            <p>Daily Spiritual Lessons | Wisdom from Sacred Traditions</p>
            <p><a href="mailto:${EMAIL_CONFIG.EMAIL_ADDRESS}?subject=Unsubscribe">Unsubscribe</a></p>
        </div>
    </div>
</body>
</html>`;
  }

  private createLessonEmailText(lesson: LessonWithDetails, today: string): string {
    return `Daily Spiritual Lesson - ${today}

${lesson.title}

Source: ${lesson.passage.source} (${lesson.passage.tradition.name})

${lesson.story}

Today's Life Lesson:
${lesson.lifeLesson}

${lesson.artworkUrl ? `Artwork: ${lesson.artworkUrl}` : ''}

---
Thank you for joining our community of spiritual seekers.
May today's wisdom bring you peace and guidance.

Daily Spiritual Lessons | Wisdom from Sacred Traditions
To unsubscribe, reply to this email with "Unsubscribe" in the subject line.
`;
  }
}

export const emailService = new EmailService();