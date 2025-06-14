import twilio from 'twilio';
import { storage } from './server/storage';

async function sendWhatsAppLessonNow() {
  try {
    console.log('Sending today\'s lesson via WhatsApp...');
    
    // Initialize Twilio client
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!
    );
    
    // Get today's lesson
    const todaysLesson = await storage.getTodaysLesson();
    if (!todaysLesson) {
      console.error('No lesson available for today');
      return;
    }
    
    // Format lesson for WhatsApp
    const lessonMessage = `🌅 *Daily Spiritual Lesson*

🙏 *${todaysLesson.title}*
📖 _${todaysLesson.passage.tradition.name}_ • ${new Date(todaysLesson.date).toLocaleDateString()}
📍 ${todaysLesson.passage.source}

*Story:* ${todaysLesson.story}

*Life Lesson:* ${todaysLesson.lifeLesson}

🌐 Visit our website for the full experience with beautiful artwork!

💬 Reply "more" for deeper insights or ask any spiritual questions!`;

    // Send to admin WhatsApp number
    const message = await client.messages.create({
      body: lessonMessage,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: process.env.WHATSAPP_ADMIN_NUMBER!
    });

    console.log(`✓ WhatsApp lesson sent successfully!`);
    console.log(`Message ID: ${message.sid}`);
    console.log(`Lesson: "${todaysLesson.title}"`);
    console.log(`Length: ${lessonMessage.length} characters`);
    
  } catch (error) {
    console.error('Error sending WhatsApp lesson:', error);
  }
}

sendWhatsAppLessonNow();