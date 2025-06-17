import { emailService } from './server/email-service';

async function sendTodaysNewLesson() {
  try {
    // Today's fresh lesson: "The Gift of Divine Communication" from Quran 55:1-4
    const todaysLesson = {
      id: 29,
      passageId: 15,
      title: "The Gift of Divine Communication",
      story: "In Quran 55:1-4, we encounter a profound meditation on divine compassion and the sacred gift of communication: \"The Most Compassionate taught the Qur'an, created humanity, and taught them speech. The sun and the moon follow their calculated courses; the stars and the trees bow down in worship.\"\n\nThis passage reveals the intimate connection between divine mercy (Ar-Rahman - The Most Compassionate) and the gift of language. Before anything else, Allah is identified by His compassion, suggesting that everything that follows - creation, revelation, and the capacity for speech - flows from this fundamental attribute of mercy.\n\nThe sequence is significant: first comes the teaching of the Qur'an (divine guidance), then the creation of humanity, then the gift of speech. This suggests that communication itself is a sacred trust, a divine endowment that carries with it tremendous responsibility. Our words have the power to heal or harm, to build bridges or create divisions, to spread truth or perpetuate falsehood.\n\nThe passage then expands to show the cosmic order - the sun and moon following precise courses, stars and trees in worship. This creates a beautiful parallel: just as the celestial bodies follow divine law in their movements, our speech should follow divine guidance in its expression. We are part of a harmonious creation where everything has its proper place and purpose.\n\nIn our age of instant communication, social media, and constant chatter, this teaching reminds us that speech is sacred. Every word we utter, every message we send, every conversation we engage in is an opportunity to reflect divine compassion or to fall short of our highest calling. The same divine mercy that taught us to speak calls us to use that gift wisely.",
      lifeLesson: "Recognize speech as a sacred gift from divine compassion. Use your words to reflect mercy, kindness, and truth, remembering that communication is both a divine endowment and a spiritual responsibility.",
      artworkUrl: "/artwork/lesson-15-compassion-1750002007074.png",
      emailArtworkUrl: "/artwork/lesson-15-compassion-1750002007074.png",
      artworkDescription: "Islamic geometric artwork with calligraphic elements depicting divine compassion",
      date: new Date(),
      isGenerated: true,
      passage: {
        id: 15,
        title: "The Compassionate",
        traditionId: 2,
        source: "Quran 55:1-4",
        content: "The Most Compassionate taught the Qur'an, created humanity, and taught them speech. The sun and the moon follow their calculated courses; the stars and the trees bow down in worship.",
        context: "Opening verses about divine compassion and creation",
        theme: "Divine mercy and the gift of communication",
        tradition: {
          id: 2,
          name: "Qur'an",
          slug: "quran",
          description: "Islamic guidance and reflection",
          color: "#228B22",
          icon: "🌙",
          textColor: "#FFFFFF",
          backgroundColor: "#228B22",
          borderColor: "#32CD32",
          accentColor: "#FFD700",
          fontFamily: "serif",
          culturalElements: [],
          artworkStyle: "Islamic geometric",
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

    console.log('Sending today\'s new lesson to ary.lakhotia@gmail.com');
    console.log(`Title: "${todaysLesson.title}"`);
    console.log(`Source: ${todaysLesson.passage.source}`);
    console.log(`Theme: Divine compassion and sacred communication`);

    const success = await emailService.sendDailyLesson(todaysLesson, [subscriber]);

    if (success) {
      console.log('New lesson delivered successfully with table-based format');
    } else {
      console.log('Email authentication required - Gmail App Password needed');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

sendTodaysNewLesson();