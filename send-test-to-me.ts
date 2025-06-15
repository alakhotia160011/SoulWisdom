import { emailService } from './server/email-service';

async function sendTestToMe() {
  try {
    console.log('Sending test email with fixed format...');
    
    // Create a mock lesson with proper structure for testing
    const testLesson = {
      id: 27,
      passageId: 32,
      title: "Being Human Where None Are",
      story: "In Pirkei Avot 2:5, Hillel teaches us: \"In a place where there are no human beings, strive to be human.\" This profound teaching speaks to our responsibility to maintain our humanity even when—especially when—we find ourselves in environments that seem to have abandoned basic human decency and compassion.\n\nThe word \"human\" here (Hebrew: adam) doesn't simply mean biological humanity, but rather the ethical and moral qualities that define what it means to be truly human: compassion, justice, kindness, and integrity. Hillel is calling us to be moral leaders, to step up when others step back, to be the light when darkness prevails.\n\nThis teaching becomes especially relevant in challenging times—in workplaces where ethical corners are cut, in communities where prejudice runs deep, in political environments where truth becomes negotiable, or in social situations where cruelty is normalized. It's precisely in these moments that our humanity is most needed and most tested.\n\nThe wisdom lies not just in recognizing the absence of humanity around us, but in taking personal responsibility to fill that void. We cannot control others' choices, but we can control our own response. When we encounter indifference, we can choose compassion. When we see injustice, we can choose to act with fairness. When others abandon their principles, we can hold firmly to ours.\n\nThis teaching reminds us that being human is not a passive state but an active choice—one we must make again and again, especially when it's difficult, especially when we're alone in making it.",
      lifeLesson: "When you find yourself in situations where basic human decency seems absent, that's precisely when your humanity is most needed. Step up and be the compassion, integrity, and kindness that's missing.",
      artworkUrl: "/artwork/lesson-27-1750002007074.png",
      emailArtworkUrl: "/artwork/lesson-27-1750002007074.png",
      artworkDescription: "Ancient Hebrew manuscript style artwork depicting moral leadership",
      date: new Date(),
      isGenerated: true,
      passage: {
        id: 32,
        source: "Talmud, Avot 2:5",
        title: "Being Human",
        content: "In a place where there are no human beings, strive to be human.",
        tradition: {
          id: 7,
          name: "Talmud",
          slug: "talmud"
        }
      }
    };
    
    // Create test subscriber with your email
    const testSubscriber = {
      id: 999,
      email: process.env.EMAIL_USER || 'alakhotia@gmail.com',
      phoneNumber: null,
      whatsappActive: false,
      emailActive: true,
      isActive: true,
      createdAt: new Date()
    };
    
    console.log(`Sending to: ${testSubscriber.email}`);
    console.log(`Lesson: "${testLesson.title}"`);
    console.log(`Artwork: https://soulwisdom.replit.app${testLesson.artworkUrl}`);
    
    // Send the email
    const success = await emailService.sendDailyLesson(testLesson, [testSubscriber]);
    
    if (success) {
      console.log('✅ Test email sent successfully!');
      console.log('The email uses a table-based layout that should display properly with artwork.');
    } else {
      console.log('❌ Failed to send test email');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

sendTestToMe();