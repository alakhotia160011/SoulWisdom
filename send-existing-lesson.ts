import { emailService } from './server/email-service';

async function sendExistingLesson() {
  try {
    // Use the existing Talmud lesson with proper formatting
    const lesson = {
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
        title: "Being Human",
        traditionId: 7,
        source: "Talmud, Avot 2:5",
        content: "In a place where there are no human beings, strive to be human.",
        context: "Hillel's teaching on moral leadership",
        theme: "Ethical responsibility and human dignity",
        tradition: {
          id: 7,
          name: "Talmud",
          slug: "talmud",
          description: "Jewish wisdom and ethics",
          color: "#8B4513",
          icon: "📜",
          textColor: "#FFFFFF",
          backgroundColor: "#8B4513", 
          borderColor: "#A0522D",
          accentColor: "#D2691E",
          fontFamily: "serif",
          culturalElements: [],
          artworkStyle: "Hebrew manuscript",
          originPeriod: null,
          originLocation: null,
          spiritualTradition: null,
          summary: null,
          famousQuotes: null,
          imageUrl: null,
          manuscriptStyle: null
        }
      }
    };
    
    const subscriber = {
      id: 999,
      email: 'ary.lakhotia@gmail.com',
      phoneNumber: null,
      whatsappActive: false,
      emailActive: true,
      isActive: true,
      createdAt: new Date()
    };
    
    console.log('Sending lesson to ary.lakhotia@gmail.com');
    console.log(`Title: "${lesson.title}"`);
    console.log(`Source: ${lesson.passage.source}`);
    console.log(`Artwork: https://soulwisdom.replit.app${lesson.artworkUrl}`);
    
    const success = await emailService.sendDailyLesson(lesson, [subscriber]);
    
    if (success) {
      console.log('Lesson sent successfully with table-based email format');
    } else {
      console.log('Email authentication failed - Gmail App Password required');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

sendExistingLesson();