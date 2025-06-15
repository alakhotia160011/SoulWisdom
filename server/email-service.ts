import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { LessonWithDetails, Subscription } from '../shared/schema';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  async sendDailyLesson(lesson: LessonWithDetails, subscribers: Subscription[]): Promise<boolean> {
    if (!lesson || !subscribers.length) {
      console.log('No lesson or subscribers to send to');
      return false;
    }

    const today = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    try {
      console.log(`Sending daily lesson "${lesson.title}" to ${subscribers.length} subscribers`);
      
      const htmlContent = this.createLessonEmailTemplate(lesson, today);
      const textContent = this.createLessonEmailText(lesson, today);

      const emailPromises = subscribers.map(async (subscriber) => {
        try {
          await this.transporter.sendMail({
            from: `"SoulWisdom" <${process.env.EMAIL_USER}>`,
            to: subscriber.email,
            subject: `Daily Wisdom: ${lesson.title}`,
            html: htmlContent,
            text: textContent
          });
          return true;
        } catch (error) {
          console.error(`Failed to send email to ${subscriber.email}:`, error);
          return false;
        }
      });

      const results = await Promise.all(emailPromises);
      const successCount = results.filter(Boolean).length;
      
      console.log(`Successfully sent ${successCount}/${subscribers.length} emails`);
      return successCount > 0;
    } catch (error) {
      console.error('Error in sendDailyLesson:', error);
      return false;
    }
  }

  async sendWelcomeEmail(subscriberEmail: string, todaysLesson?: LessonWithDetails): Promise<boolean> {
    try {
      const htmlContent = this.createWelcomeEmailTemplate(subscriberEmail, todaysLesson);
      const textContent = this.createWelcomeEmailText(subscriberEmail, todaysLesson);

      await this.transporter.sendMail({
        from: `"SoulWisdom" <${process.env.EMAIL_USER}>`,
        to: subscriberEmail,
        subject: 'Welcome to SoulWisdom - Your Journey of Daily Spiritual Wisdom Begins',
        html: htmlContent,
        text: textContent
      });

      console.log(`Welcome email sent to ${subscriberEmail}`);
      return true;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return false;
    }
  }

  async sendTestEmail(): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: `"SoulWisdom Test" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: 'SoulWisdom Email Test',
        html: '<h1>Test Email</h1><p>Email service is working correctly!</p>',
        text: 'Test Email - Email service is working correctly!'
      });
      
      console.log('Test email sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending test email:', error);
      return false;
    }
  }

  private createLessonEmailTemplate(lesson: LessonWithDetails, today: string): string {
    const artworkUrl = `https://soulwisdom.replit.app${lesson.artworkUrl}`;
    
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily Wisdom - ${lesson.title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Georgia, serif; background-color: #f9f7f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f7f4;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; max-width: 600px;">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #8b7355 0%, #a0956b 100%); padding: 30px 20px; text-align: center; color: white;">
                            <h1 style="margin: 0 0 10px 0; font-size: 28px; font-weight: bold;">SoulWisdom</h1>
                            <p style="margin: 0; font-size: 14px; opacity: 0.9;">Daily Wisdom from Sacred Traditions</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 30px 20px;">
                            <h2 style="color: #8b7355; font-size: 24px; text-align: center; margin: 0 0 10px 0;">${lesson.title}</h2>
                            <p style="text-align: center; font-style: italic; color: #666; margin: 0 0 20px 0;">${lesson.passage.source}</p>
                            
                            <!-- Artwork -->
                            <div style="text-align: center; margin: 20px 0;">
                                <img src="${artworkUrl}" alt="Spiritual artwork" style="max-width: 100%; height: auto; border-radius: 8px;" />
                            </div>
                            
                            <!-- Sacred Text -->
                            <div style="background-color: #f9f7f4; padding: 20px; border-left: 4px solid #8b7355; margin: 20px 0; font-style: italic; text-align: center; font-size: 16px;">
                                "${lesson.passage.content}"
                            </div>
                            
                            <!-- Story -->
                            <div style="margin: 25px 0; text-align: justify; line-height: 1.6;">
                                ${lesson.story.split('\n\n').map(paragraph => `<p style="margin: 0 0 15px 0;">${paragraph}</p>`).join('')}
                            </div>
                            
                            <!-- Life Lesson -->
                            <div style="background-color: #e8e4df; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #a0956b;">
                                <h3 style="color: #8b7355; margin: 0 0 10px 0;">Today's Wisdom</h3>
                                <p style="margin: 0; line-height: 1.6;">${lesson.lifeLesson}</p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
                            <p style="margin: 0 0 10px 0;">Thank you for joining us on this journey of spiritual wisdom.</p>
                            <p style="margin: 0;">
                                <a href="${this.getWebsiteUrl()}/unsubscribe" style="color: #8b7355; text-decoration: none;">Unsubscribe</a> | 
                                <a href="${this.getWebsiteUrl()}" style="color: #8b7355; text-decoration: none;">Visit SoulWisdom</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
  }

  private createLessonEmailText(lesson: LessonWithDetails, today: string): string {
    return `
SOULWISDOM - Daily Wisdom from Sacred Traditions

${lesson.title}
${lesson.passage.source}

"${lesson.passage.content}"

${lesson.story}

TODAY'S WISDOM:
${lesson.lifeLesson}

---
Thank you for joining us on this journey of spiritual wisdom.
Visit: ${this.getWebsiteUrl()}
Unsubscribe: ${this.getWebsiteUrl()}/unsubscribe
`;
  }

  private createWelcomeEmailTemplate(subscriberEmail: string, todaysLesson?: LessonWithDetails): string {
    const websiteUrl = this.getWebsiteUrl();
    
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to SoulWisdom</title>
</head>
<body style="margin: 0; padding: 0; font-family: Georgia, serif; background-color: #f9f7f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f7f4;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; max-width: 600px;">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #8b7355 0%, #a0956b 100%); padding: 30px 20px; text-align: center; color: white;">
                            <h1 style="margin: 0 0 10px 0; font-size: 28px; font-weight: bold;">Welcome to SoulWisdom</h1>
                            <p style="margin: 0; font-size: 16px;">Your journey of daily spiritual wisdom begins today</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 30px 20px;">
                            <h2 style="color: #8b7355; margin: 0 0 20px 0;">Thank you for subscribing!</h2>
                            <p style="margin: 0 0 15px 0; line-height: 1.6;">You'll now receive daily wisdom from the world's greatest spiritual traditions:</p>
                            
                            <ul style="margin: 20px 0; padding-left: 20px; line-height: 1.8;">
                                <li>Bible - Timeless Christian wisdom</li>
                                <li>Qur'an - Islamic guidance and reflection</li>
                                <li>Bhagavad Gita - Hindu philosophy and duty</li>
                                <li>Dhammapada - Buddhist mindfulness and compassion</li>
                                <li>Tao Te Ching - Taoist harmony and balance</li>
                                <li>Upanishads - Vedantic spiritual insights</li>
                                <li>Talmud - Jewish wisdom and ethics</li>
                            </ul>
                            
                            <p style="margin: 20px 0 0 0; line-height: 1.6;">Each lesson includes beautiful AI-generated artwork, authentic sacred passages, and practical wisdom for modern life.</p>
                            
                            ${todaysLesson ? `
                            <div style="background-color: #f9f7f4; padding: 20px; border-left: 4px solid #8b7355; margin: 20px 0;">
                                <h3 style="color: #8b7355; margin: 0 0 10px 0;">Today's Lesson</h3>
                                <p style="margin: 0; font-weight: bold;">${todaysLesson.title}</p>
                                <p style="margin: 5px 0 0 0; font-style: italic; color: #666;">${todaysLesson.passage.source}</p>
                            </div>
                            ` : ''}
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
                            <p style="margin: 0 0 10px 0;">Welcome to your daily spiritual journey.</p>
                            <p style="margin: 0;">
                                <a href="${websiteUrl}/unsubscribe" style="color: #8b7355; text-decoration: none;">Unsubscribe</a> | 
                                <a href="${websiteUrl}" style="color: #8b7355; text-decoration: none;">Visit SoulWisdom</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
  }

  private createWelcomeEmailText(subscriberEmail: string, todaysLesson?: LessonWithDetails): string {
    return `
WELCOME TO SOULWISDOM

Thank you for subscribing to daily spiritual wisdom!

You'll now receive daily lessons from the world's greatest spiritual traditions:
- Bible - Timeless Christian wisdom
- Qur'an - Islamic guidance and reflection
- Bhagavad Gita - Hindu philosophy and duty
- Dhammapada - Buddhist mindfulness and compassion
- Tao Te Ching - Taoist harmony and balance
- Upanishads - Vedantic spiritual insights
- Talmud - Jewish wisdom and ethics

Each lesson includes beautiful artwork, authentic sacred passages, and practical wisdom for modern life.

${todaysLesson ? `
TODAY'S LESSON: ${todaysLesson.title}
From: ${todaysLesson.passage.source}
` : ''}

---
Welcome to your daily spiritual journey.
Visit: ${this.getWebsiteUrl()}
Unsubscribe: ${this.getWebsiteUrl()}/unsubscribe
`;
  }

  async sendNewSubscriberNotification(subscriberEmail: string): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: `"SoulWisdom" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: 'New SoulWisdom Subscriber',
        text: `New subscriber: ${subscriberEmail}`,
        html: `<h2>New Subscriber</h2><p>Email: ${subscriberEmail}</p>`
      });
      
      console.log(`New subscriber notification sent for: ${subscriberEmail}`);
      return true;
    } catch (error) {
      console.error('Error sending new subscriber notification:', error);
      return false;
    }
  }

  private getWebsiteUrl(): string {
    return process.env.REPL_SLUG ? 
      `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co` : 
      'https://soulwisdom.replit.app';
  }

  public getCurrentWebsiteUrl(): string {
    return this.getWebsiteUrl();
  }
}

export const emailService = new EmailService();