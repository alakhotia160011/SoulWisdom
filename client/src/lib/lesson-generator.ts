import type { IStorage } from "../../server/storage";
import { spiritualPassages, traditionalArtwork, lessonTemplates } from "./spiritual-data";

interface GeneratedLessonContent {
  title: string;
  story: string;
  lifeLesson: string;
  artworkUrl: string;
  artworkDescription: string;
}

// Simple lesson generation algorithm
export async function generateTodaysLesson(storage: IStorage) {
  try {
    // Get a random passage that hasn't been used recently
    const recentLessons = await storage.getRecentLessons(10);
    const usedPassageIds = recentLessons.map(lesson => lesson.passageId);
    
    // Find available passages
    const availablePassages = spiritualPassages.filter(passage => {
      // For now, we'll use passage source as ID since we don't have actual IDs
      return !usedPassageIds.some(id => id.toString() === passage.source);
    });

    if (availablePassages.length === 0) {
      console.log("No unused passages available, reusing existing passages");
      // If all passages have been used recently, pick randomly
      const randomPassage = spiritualPassages[Math.floor(Math.random() * spiritualPassages.length)];
      return await createLessonFromPassage(storage, randomPassage);
    }

    // Select a random available passage
    const selectedPassage = availablePassages[Math.floor(Math.random() * availablePassages.length)];
    return await createLessonFromPassage(storage, selectedPassage);

  } catch (error) {
    console.error("Error generating today's lesson:", error);
    return null;
  }
}

async function createLessonFromPassage(storage: IStorage, passageData: any) {
  try {
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

    // Generate lesson content
    const lessonContent = generateLessonContent(passageData);
    
    // Create the lesson
    const lesson = await storage.createLesson({
      passageId: targetPassage.id,
      title: lessonContent.title,
      story: lessonContent.story,
      lifeLesson: lessonContent.lifeLesson,
      artworkUrl: lessonContent.artworkUrl,
      artworkDescription: lessonContent.artworkDescription,
      date: new Date(),
      isGenerated: true
    });

    return lesson;
  } catch (error) {
    console.error("Error creating lesson from passage:", error);
    return null;
  }
}

function generateLessonContent(passageData: any): GeneratedLessonContent {
  const theme = passageData.theme;
  const template = lessonTemplates[theme as keyof typeof lessonTemplates];
  
  // Generate title
  const title = generateTitle(passageData, template);
  
  // Generate story
  const story = generateStory(passageData);
  
  // Generate life lesson
  const lifeLesson = generateLifeLesson(passageData, template);
  
  // Select artwork
  const artwork = selectArtwork(passageData.traditionId);
  
  return {
    title,
    story,
    lifeLesson,
    artworkUrl: artwork.url,
    artworkDescription: artwork.description
  };
}

function generateTitle(passageData: any, template?: any): string {
  // Simple title generation based on theme and content
  const themes = {
    "Trust and Comfort": ["Finding Peace in", "Trust When", "Comfort in"],
    "Detachment and Duty": ["Acting Without", "The Freedom of", "Duty Beyond"],
    "Mindfulness and Thought": ["The Mind's", "Cultivating", "The Power of"],
    "Resilience and Hope": ["Hope in", "Rising From", "Strength Through"],
    "Divine Mercy and Human Capacity": ["Divine Grace in", "Mercy Beyond", "Strength in"],
    "Self-Mastery": ["Mastering", "The Inner", "Self as"],
    "Compassion and Transformation": ["Transforming", "Love Conquers", "The Heart's"],
    "Gentleness and Persistence": ["The Power of", "Gentle", "Water's"],
    "Self-Knowledge and Wisdom": ["Knowing", "The Wisdom of", "Inner"],
    "Unity and Divine Nature": ["The Sacred", "Divine", "Unity in"],
    "Divine Presence and Contentment": ["Finding God in", "Sacred", "Divine"],
    "Human Dignity and Compassion": ["The Sacred", "Every Life", "Compassion for"],
    "Balance and Action": ["Finding Balance", "The Time for", "Wisdom in"]
  };

  const prefixes = themes[passageData.theme as keyof typeof themes] || ["Wisdom in", "The Path of", "Finding"];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  
  // Extract key concept from passage title or content
  const keyConcepts = passageData.title.split(' ').slice(-2).join(' ');
  
  return `${prefix} ${keyConcepts}`;
}

function generateStory(passageData: any): string {
  // This is a simplified story generator
  // In a real implementation, you'd have more sophisticated templates
  
  const storyTemplates = {
    "bible": {
      introduction: "In the ancient world, where life was often harsh and uncertain,",
      context: "the people of Israel looked to their scriptures for guidance.",
      wisdom: "Through these words, we learn that",
      application: "This timeless wisdom reminds us that"
    },
    "quran": {
      introduction: "In the revelation that came to guide humanity,",
      context: "believers were taught profound truths about life's challenges.",
      wisdom: "The Qur'an teaches us that",
      application: "This divine guidance shows us that"
    },
    "bhagavad-gita": {
      introduction: "On the battlefield of Kurukshetra, facing an impossible choice,",
      context: "Arjuna received teachings that would guide seekers for millennia.",
      wisdom: "Krishna's eternal wisdom reveals that",
      application: "This sacred teaching reminds us that"
    },
    "dhammapada": {
      introduction: "Under the Bodhi tree, having achieved enlightenment,",
      context: "the Buddha shared insights that could free all beings from suffering.",
      wisdom: "The Buddha's compassionate teaching shows us that",
      application: "This mindful awareness teaches us that"
    },
    "tao-te-ching": {
      introduction: "In the ancient wisdom of the Tao,",
      context: "Lao Tzu revealed the secret of living in harmony with nature.",
      wisdom: "The Tao teaches us that",
      application: "This natural wisdom shows us that"
    },
    "upanishads": {
      introduction: "In the sacred forests where sages contemplated ultimate reality,",
      context: "the ancient Upanishads revealed the deepest truths of existence.",
      wisdom: "These sacred texts teach us that",
      application: "This eternal wisdom reminds us that"
    },
    "talmud": {
      introduction: "In the study halls where rabbis debated and learned,",
      context: "Jewish wisdom was preserved and expanded for future generations.",
      wisdom: "The sages teach us that",
      application: "This rabbinic wisdom shows us that"
    }
  };

  // Map tradition ID to tradition name
  const traditionNames = ["", "bible", "quran", "bhagavad-gita", "dhammapada", "tao-te-ching", "upanishads", "talmud"];
  const traditionName = traditionNames[passageData.traditionId] || "bible";
  const template = storyTemplates[traditionName as keyof typeof storyTemplates];

  const story = `${template.introduction} ${template.context}

${passageData.context}

The teaching "${passageData.content}" carries profound meaning for our lives today. ${template.wisdom} even in our modern world, we face similar challenges and can find guidance in this ancient wisdom.

${template.application} we don't have to face life's difficulties alone. Whether we're dealing with uncertainty, making difficult decisions, or seeking purpose, this timeless teaching offers us a path forward.

The beauty of this wisdom lies not just in its age, but in its continued relevance to the human experience.`;

  return story;
}

function generateLifeLesson(passageData: any, template?: any): string {
  const lifeLessons = {
    "Trust and Comfort": "Trust deepens when we surrender control and find peace in divine guidance.",
    "Detachment and Duty": "Freedom comes when we act with full commitment but release attachment to outcomes.",
    "Mindfulness and Thought": "What we think, we become—choose your thoughts like you choose your friends.",
    "Resilience and Hope": "Like a tree that grows stronger after being cut, we too can find new life in our difficulties.",
    "Divine Mercy and Human Capacity": "We are given only what we can handle, and with that comes the strength to bear it.",
    "Self-Mastery": "The greatest victory is not over others, but over the chaos within our own minds.",
    "Compassion and Transformation": "Love and kindness have the power to transform even the deepest anger and pain.",
    "Gentleness and Persistence": "Like water wearing away stone, gentle persistence overcomes the hardest obstacles.",
    "Self-Knowledge and Wisdom": "True power comes not from controlling others, but from understanding and mastering ourselves.",
    "Unity and Divine Nature": "When we see the sacred in everything, we discover our own divine nature.",
    "Divine Presence and Contentment": "Finding the sacred in ordinary moments brings a contentment that no external achievement can match.",
    "Human Dignity and Compassion": "Every person carries infinite worth—treating others with dignity reflects our own humanity.",
    "Balance and Action": "Care for yourself so you can care for others, and act with wisdom when the moment calls for it."
  };

  return lifeLessons[passageData.theme as keyof typeof lifeLessons] || 
         "Ancient wisdom continues to guide us through life's challenges with timeless insight.";
}

function selectArtwork(traditionId: number): { url: string; description: string } {
  const traditionNames = ["", "bible", "quran", "bhagavad-gita", "dhammapada", "tao-te-ching", "upanishads", "talmud"];
  const traditionName = traditionNames[traditionId] || "bible";
  
  const artworkUrls = traditionalArtwork[traditionName as keyof typeof traditionalArtwork] || traditionalArtwork.bible;
  const randomUrl = artworkUrls[Math.floor(Math.random() * artworkUrls.length)];
  
  const descriptions = {
    bible: "Traditional Christian illuminated manuscript artwork",
    quran: "Traditional Islamic calligraphy and geometric patterns",
    "bhagavad-gita": "Traditional Hindu artwork depicting Krishna's teachings",
    dhammapada: "Traditional Buddhist manuscript with serene imagery",
    "tao-te-ching": "Traditional Chinese landscape painting reflecting Taoist principles",
    upanishads: "Traditional Sanskrit manuscript with Vedantic symbols",
    talmud: "Traditional Hebrew manuscript with rabbinic commentaries"
  };

  return {
    url: randomUrl,
    description: descriptions[traditionName as keyof typeof descriptions] || "Traditional spiritual artwork"
  };
}
