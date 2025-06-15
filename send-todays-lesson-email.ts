import { storage } from './server/storage';
import { emailService } from './server/email-service';

async function sendTodaysLessonEmail() {
  try {
    console.log("Sending today's Talmud lesson to all subscribers...");

    // Get today's lesson
    const lesson = await storage.getTodaysLesson();
    if (!lesson) {
      console.error("No lesson found for today");
      return;
    }

    console.log("Found lesson:", lesson.title);
    console.log("Source:", lesson.passage.source);

    // Get all active subscribers
    const subscribers = await storage.getActiveSubscriptions();
    console.log(`Found ${subscribers.length} subscribers`);

    if (subscribers.length === 0) {
      console.log("No subscribers to send emails to");
      return;
    }

    // Send the lesson via email
    const success = await emailService.sendDailyLesson(lesson, subscribers);
    
    if (success) {
      console.log("✓ Successfully sent today's lesson to all subscribers");
      console.log(`Email sent to ${subscribers.length} subscribers`);
      console.log("Lesson:", lesson.title);
      console.log("Tradition:", lesson.passage.tradition.name);
    } else {
      console.error("Failed to send email");
    }

  } catch (error) {
    console.error("Error sending lesson email:", error);
  }
}

sendTodaysLessonEmail();