import type { IStorage } from "./storage";
import { generateArtworkForLesson } from "./artwork-generator";

interface GeneratedLessonContent {
  title: string;
  story: string;
  lifeLesson: string;
  artworkUrl: string;
  emailArtworkUrl: string;
  artworkDescription: string;
}

export const spiritualPassages = [
  {
    traditionId: 1,
    source: "Matthew 18:12-14",
    title: "The Lost Sheep",
    content: "What do you think? If a man owns a hundred sheep, and one of them wanders away, will he not leave the ninety-nine on the hills and go to look for the one that wandered off? And if he finds it, truly I tell you, he is happier about that one sheep than about the ninety-nine that did not wander off. In the same way your Father in heaven is not willing that any of these little ones should perish.",
    context: "Jesus teaches about God's love for each individual soul",
    theme: "Divine Love and Forgiveness"
  },
  {
    traditionId: 2,
    source: "Quran 18:65-82",
    title: "Moses and Al-Khidr",
    content: "So they found one of Our servants, on whom We had bestowed Mercy from Ourselves and whom We had taught knowledge from Our own Presence. Moses said to him: 'May I follow you, on the footing that you teach me something of the (higher) Truth which you have been taught?' The other said: 'Verily you will not be able to have patience with me!'",
    context: "The story of Moses learning from the mysterious servant Al-Khidr about divine wisdom",
    theme: "Divine Wisdom Beyond Appearances"
  },
  {
    traditionId: 3,
    source: "Bhagavad Gita 2:47",
    title: "Action Without Attachment",
    content: "You have a right to perform your prescribed duty, but do not become attached to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty.",
    context: "Krishna's teaching to Arjuna about performing duty without attachment to results",
    theme: "Selfless Service"
  },
  {
    traditionId: 4,
    source: "Dhammapada 1:1-2",
    title: "Mind as the Forerunner",
    content: "Mind is the forerunner of all actions. Mind is chief; mind-made are they. If one speaks or acts with a serene mind, happiness follows, as surely as one's shadow. Mind is the forerunner of all actions. Mind is chief; mind-made are they. If one speaks or acts with an impure mind, suffering follows, as surely as the wheel follows the hoof of the ox.",
    context: "Buddha's teaching on the power of mind and intention",
    theme: "Mindfulness and Right Intention"
  },
  {
    traditionId: 5,
    source: "Tao Te Ching 17",
    title: "The Invisible Leader",
    content: "The best leaders are those the people hardly know exist. The next best is a leader who is loved and praised. Next comes the one who is feared. The worst one is the leader that is despised. If you don't trust the people, they will become untrustworthy. The best leaders value their words, and use them sparingly. When they have accomplished their task, the people say, 'Amazing! We did it, all by ourselves!'",
    context: "Lao Tzu's teaching on wu wei - effortless action and humble leadership",
    theme: "Humility and Natural Action"
  },
  {
    traditionId: 6,
    source: "Isha Upanishad 1",
    title: "The Divine in All",
    content: "The universe is the creation of the Supreme Power meant for the benefit of all creation. Each individual life form must learn to enjoy its benefits by forming a part of the system in close relation with other species. Let not any one species encroach upon others' rights.",
    context: "Ancient Vedic wisdom about interconnectedness and cosmic harmony",
    theme: "Unity and Interconnectedness"
  },
  {
    traditionId: 7,
    source: "Talmud, Sanhedrin 37a",
    title: "The Value of One Life",
    content: "Therefore, man was created alone, to teach you that whoever destroys a single soul, Scripture considers it as if he destroyed an entire world. And whoever saves a single soul, Scripture considers it as if he saved an entire world.",
    context: "Rabbinic teaching on the infinite value of every human life",
    theme: "The Sacred Value of Life"
  }
];

const lessonTemplates = {
  "Divine Love and Forgiveness": "In our journey through life, we sometimes lose our way, much like the sheep that wandered from the flock. Yet divine love seeks us out, rejoicing more in our return than in those who never strayed.",
  "Divine Wisdom Beyond Appearances": "True wisdom often lies hidden beneath the surface of events. What appears as hardship or confusion may contain profound lessons that reveal themselves only in time.",
  "Selfless Service": "The highest action comes from duty performed without attachment to personal gain. When we serve without expectation, we align ourselves with the divine flow of existence.",
  "Mindfulness and Right Intention": "Every thought and action creates ripples in the fabric of reality. By cultivating pure intention and mindful awareness, we plant seeds of happiness and peace.",
  "Humility and Natural Action": "The most powerful leadership comes from those who lead by example, without force or ego. Like water flowing around obstacles, gentle persistence accomplishes what force cannot.",
  "Unity and Interconnectedness": "All existence is woven together in an intricate tapestry of connection. When we recognize our place in this cosmic harmony, we find peace and purpose.",
  "The Sacred Value of Life": "Each soul contains infinite potential and divine spark. To honor and protect life - all life - is to participate in the sacred act of creation itself."
};

export async function generateTodaysLesson(storage: IStorage): Promise<any> {
  const existingLesson = await storage.getTodaysLesson();
  if (existingLesson) {
    return existingLesson;
  }

  // Get all existing lessons to check for used passages
  const allLessons = await storage.getRecentLessons(1000); // Get all lessons
  const usedSources = new Set(allLessons.map(lesson => lesson.passage.source));

  // Find passages that haven't been used at all
  const availablePassages = spiritualPassages.filter(passage => {
    return !usedSources.has(passage.source);
  });

  if (availablePassages.length === 0) {
    console.log("All hardcoded passages have been used, checking database for unused passages");
    return await generateFromUnusedDatabasePassage(storage);
  }

  const randomIndex = Math.floor(Math.random() * availablePassages.length);
  const selectedPassage = availablePassages[randomIndex];
  console.log(`Selected unused passage: ${selectedPassage.source} - ${selectedPassage.title}`);

  return await createLessonFromPassage(storage, selectedPassage);
}

async function generateFromUnusedDatabasePassage(storage: IStorage): Promise<any> {
  // Get all lessons and passages from database
  const allTraditions = await storage.getTraditions();
  const allLessons = await storage.getRecentLessons(1000);
  let unusedPassage = null;

  for (const tradition of allTraditions) {
    const passagesInTradition = await storage.getPassagesByTradition(tradition.id);
    const usedPassageIds = new Set(allLessons.map(lesson => lesson.passageId));

    const availablePassagesInTradition = passagesInTradition.filter(passage => 
      !usedPassageIds.has(passage.id)
    );

    if (availablePassagesInTradition.length > 0) {
      const randomIndex = Math.floor(Math.random() * availablePassagesInTradition.length);
      unusedPassage = availablePassagesInTradition[randomIndex];
      break;
    }
  }

  if (!unusedPassage) {
    console.log("All passages have been used, selecting randomly from oldest");
    const oldestLesson = allLessons[allLessons.length - 1];
    if (oldestLesson) {
      unusedPassage = oldestLesson.passage;
    } else {
      // Fallback - use first hardcoded passage
      const randomIndex = Math.floor(Math.random() * spiritualPassages.length);
      return await createLessonFromPassage(storage, spiritualPassages[randomIndex]);
    }
  }

  console.log(`Selected unused database passage: ${unusedPassage.source} - ${unusedPassage.title}`);
  
  // Convert database passage to format expected by createLessonFromPassage
  const passageData = {
    traditionId: unusedPassage.traditionId,
    source: unusedPassage.source,
    title: unusedPassage.title,
    content: unusedPassage.content,
    context: unusedPassage.context,
    theme: unusedPassage.theme
  };

  return await createLessonFromPassage(storage, passageData);
}

export async function generateDemoLessons(storage: IStorage) {
  const lessons = [];
  const traditions = [1, 2, 3, 4, 5, 6, 7]; // All 7 tradition IDs
  
  for (const traditionId of traditions) {
    // Find a passage from this tradition
    const passagesFromTradition = spiritualPassages.filter(p => p.traditionId === traditionId);
    if (passagesFromTradition.length > 0) {
      const randomIndex = Math.floor(Math.random() * passagesFromTradition.length);
      const selectedPassage = passagesFromTradition[randomIndex];
      
      try {
        console.log(`Generating lesson for tradition ${traditionId}:`, selectedPassage.title);
        const lesson = await createLessonFromPassage(storage, selectedPassage);
        if (lesson) {
          const lessonWithDetails = await storage.getLessonById(lesson.id);
          if (lessonWithDetails) {
            lessons.push(lessonWithDetails);
          }
        }
      } catch (error) {
        console.error(`Error creating lesson for tradition ${traditionId}:`, error);
      }
    }
  }
  
  return lessons;
}

export async function createLessonFromPassage(storage: IStorage, passageData: any): Promise<any> {
  try {
    // Check if this passage has already been used for a lesson
    const allLessons = await storage.getRecentLessons(1000);
    const duplicateLesson = allLessons.find(lesson => 
      lesson.passage.source === passageData.source
    );

    if (duplicateLesson) {
      console.log(`Passage ${passageData.source} already used in lesson: ${duplicateLesson.title}`);
      console.log("Finding alternative unused passage...");
      
      // Find a different unused passage instead of recursion
      const usedSources = new Set(allLessons.map(lesson => lesson.passage.source));
      const availablePassages = spiritualPassages.filter(passage => {
        return !usedSources.has(passage.source) && passage.source !== passageData.source;
      });

      if (availablePassages.length > 0) {
        const randomIndex = Math.floor(Math.random() * availablePassages.length);
        const alternativePassage = availablePassages[randomIndex];
        console.log(`Using alternative passage: ${alternativePassage.source}`);
        passageData = alternativePassage;
      } else {
        console.log("No unused passages available, proceeding with original");
      }
    }

    // First, ensure the passage exists in storage
    let passage = await storage.getPassagesByTradition(passageData.traditionId);
    let targetPassage = passage.find(p => p.source === passageData.source);
    
    if (!targetPassage) {
      // Create the passage if it doesn't exist
      targetPassage = await storage.createPassage({
        traditionId: passageData.traditionId,
        source: passageData.source,
        title: passageData.title,
        content: passageData.content,
        context: passageData.context,
        theme: passageData.theme
      });
    }

    // Generate lesson content with AI artwork
    const lessonContent = await generateLessonContent(passageData);
    
    // Create the lesson using EST timezone
    const estDate = new Date(new Date().toLocaleString("en-US", {timeZone: "America/New_York"}));
    const lesson = await storage.createLesson({
      passageId: targetPassage.id,
      title: lessonContent.title,
      story: lessonContent.story,
      lifeLesson: lessonContent.lifeLesson,
      artworkUrl: lessonContent.artworkUrl,
      artworkDescription: lessonContent.artworkDescription,
      date: estDate,
      isGenerated: true
    });

    console.log(`✓ Created new lesson: ${lesson.title} from ${passageData.source}`);
    return lesson;
  } catch (error) {
    console.error("Error creating lesson from passage:", error);
    return null;
  }
}

async function generateLessonContent(passageData: any): Promise<GeneratedLessonContent> {
  const theme = passageData.theme;
  const template = lessonTemplates[theme as keyof typeof lessonTemplates];
  
  // Generate title
  const title = generateTitle(passageData, template);
  
  // Generate story
  const story = generateStory(passageData);
  
  // Generate life lesson
  const lifeLesson = generateLifeLesson(passageData, template);
  
  // Generate artwork using OpenAI
  let artworkUrl = "";
  let artworkDescription = "";
  
  try {
    const artwork = await generateArtworkForLesson(
      passageData.traditionId, 
      title, 
      story
    );
    artworkUrl = artwork.url;
    artworkDescription = artwork.description;
  } catch (error) {
    console.error("Error generating artwork, using fallback:", error);
    // Use a simple fallback
    artworkUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f4f1e8'/%3E%3Ctext x='200' y='150' text-anchor='middle' font-family='serif' font-size='14' fill='%23654321'%3ESpiritual Artwork%3C/text%3E%3C/svg%3E";
    artworkDescription = "Traditional spiritual artwork";
  }

  return {
    title,
    story,
    lifeLesson,
    artworkUrl,
    artworkDescription
  };
}

function generateTitle(passageData: any, template?: any): string {
  const titles = {
    1: "Finding Divine Love in Life's Journey",
    2: "Wisdom Beyond Understanding", 
    3: "The Path of Selfless Action",
    4: "Cultivating Inner Peace",
    5: "The Way of Natural Harmony",
    6: "Discovering Unity in Diversity", 
    7: "Honoring the Sacred in Every Soul"
  };
  
  return titles[passageData.traditionId as keyof typeof titles] || passageData.title;
}

function generateStory(passageData: any): string {
  const storyTemplates = {
    "Divine Love and Forgiveness": `In ${passageData.source}, we encounter the beautiful parable of ${passageData.title.toLowerCase()}. ${passageData.content}\n\nThis story reveals the boundless nature of divine love - a love that seeks out each wandering soul with infinite patience and joy. The shepherd's dedication to finding the one lost sheep mirrors the divine concern for every individual, no matter how far they may have strayed from the path of righteousness.\n\nThe joy expressed upon finding the lost sheep is not just relief, but celebration - for every return to the divine embrace is a victory worth celebrating. This teaches us that no soul is ever truly lost, and that the divine love actively seeks us out in our moments of confusion and separation.`,
    
    "Divine Wisdom Beyond Appearances": `The story of ${passageData.title} from ${passageData.source} presents us with a profound teaching about the nature of divine wisdom. ${passageData.content}\n\nIn this mysterious encounter, Moses - himself a great prophet - meets a servant of God whose actions initially seem incomprehensible, even wrong. Yet beneath each seemingly harsh or puzzling action lies a deeper wisdom that serves a greater good.\n\nThis story teaches us humility before the mystery of divine wisdom, which often works in ways that confound our limited understanding. What appears as hardship or injustice may be part of a larger tapestry of divine mercy and guidance that we cannot perceive from our earthly perspective.`,
    
    "Selfless Service": `In the sacred text of ${passageData.source}, Krishna imparts timeless wisdom: ${passageData.content}\n\nThis teaching from the ${passageData.title} addresses the fundamental question of how to live and act in the world while maintaining spiritual purity. The key lies not in abandoning action, but in transforming our relationship to it.\n\nWhen we perform our duties - whether as parents, professionals, or community members - without attachment to personal gain or recognition, our actions become offerings to the divine. This transforms even the most mundane tasks into spiritual practice, allowing us to find meaning and purpose in service to something greater than ourselves.`,
    
    "Mindfulness and Right Intention": `The opening verses of the Dhammapada, found in ${passageData.source}, present us with fundamental truth: ${passageData.content}\n\nThese profound words reveal that our external circumstances are largely shaped by our internal state. The mind, like a master craftsman, creates our reality through the quality of our thoughts and intentions.\n\nWhen we approach life with mindfulness and pure intention, we naturally create conditions for happiness and peace. Conversely, when our minds are clouded by negativity or selfishness, we inevitably create suffering for ourselves and others. This teaching empowers us to take responsibility for our own happiness by cultivating wholesome mental states.`,
    
    "Humility and Natural Action": `From ${passageData.source}, Lao Tzu shares profound wisdom about leadership and influence: ${passageData.content}\n\nThis teaching reveals the power of wu wei - action that is so natural and unforced that it appears effortless. The best leaders do not dominate or control, but rather create conditions where others can flourish and discover their own capabilities.\n\nLike water that nourishes all life without competing, true influence comes from serving others' highest good rather than promoting oneself. When we lead by example rather than force, people are inspired to grow and achieve, feeling that their success comes from their own efforts rather than external pressure.`,
    
    "Unity and Interconnectedness": `The opening verse of the Isha Upanishad, ${passageData.source}, offers profound wisdom: ${passageData.content}\n\nThis ancient teaching reveals that all existence is interconnected and sacred. Every being, from the smallest insect to the largest whale, has a role to play in the cosmic harmony. Human beings, with their capacity for consciousness and choice, have a special responsibility to live in harmony with this universal order.\n\nWhen we recognize that we are part of a larger whole, our actions naturally become more thoughtful and compassionate. We begin to see that harming others ultimately harms ourselves, while serving others serves our own highest good as well.`,
    
    "The Sacred Value of Life": `From ${passageData.source}, the Talmudic sages teach us: ${passageData.content}\n\nThis profound teaching elevates the value of each individual life to cosmic significance. Every person contains within them infinite potential, unique perspectives, and the divine spark that connects them to the Creator.\n\nWhen we truly understand that each soul is a universe unto itself, our approach to relationships, justice, and compassion is transformed. We can no longer dismiss anyone as unimportant or expendable, for in doing so we would be destroying something of infinite worth. This teaching calls us to see the divine image in every face we encounter.`
  };
  
  return storyTemplates[passageData.theme as keyof typeof storyTemplates] || `This profound teaching from ${passageData.source} offers timeless wisdom for spiritual growth and understanding.`;
}

function generateLifeLesson(passageData: any, template?: any): string {
  const lifeLessons = {
    "Divine Love and Forgiveness": "No matter how far we wander, divine love seeks us out with infinite patience and celebrates our return home.",
    "Divine Wisdom Beyond Appearances": "Trust in divine wisdom, even when circumstances seem confusing - a greater purpose often lies hidden beneath the surface.",
    "Selfless Service": "Transform your daily actions into spiritual practice by performing them with dedication but without attachment to personal gain.",
    "Mindfulness and Right Intention": "Cultivate peace and happiness by maintaining mindful awareness and pure intentions in all your thoughts and actions.",
    "Humility and Natural Action": "Lead by example and serve others' growth - true influence comes from humility, not force or ego.",
    "Unity and Interconnectedness": "Recognize your connection to all life and let this awareness guide you toward greater compassion and harmony.",
    "The Sacred Value of Life": "Honor the infinite worth of every soul you encounter, for each person carries the divine spark within them."
  };
  
  return lifeLessons[passageData.theme as keyof typeof lifeLessons] || "Seek wisdom in the teachings of the ancients and apply their timeless truths to your daily life.";
}