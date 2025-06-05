import type { IStorage } from "../../server/storage";
import { spiritualPassages, lessonTemplates } from "./spiritual-data";
import { generateArtworkForLesson } from "./artwork-generator";

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

    // Generate lesson content with AI artwork
    const lessonContent = await generateLessonContent(passageData);
    
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
  // Generate a story that retells the actual narrative and explores its meaning
  
  const storyIntroductions = {
    1: "From the Hebrew Scriptures comes this timeless story:",
    2: "The Qur'an tells us this powerful narrative:",
    3: "In the sacred Bhagavad Gita, we find this profound story:",
    4: "Buddhist texts preserve this transformative tale:",
    5: "Taoist wisdom offers us this enlightening story:",
    6: "The ancient Upanishads share this deep teaching story:",
    7: "Jewish wisdom literature gives us this meaningful narrative:"
  };

  const meaningExplorations = {
    "Divine Purpose in Suffering": "This story reveals how apparent setbacks and injustices can serve a greater divine purpose. What seems like disaster may be preparation for unexpected blessing.",
    "Unconditional Love and Forgiveness": "The narrative demonstrates love that welcomes without conditions and forgiveness that doesn't wait for worthiness. True love celebrates return over perfection.",
    "Finding God in Stillness": "This account teaches that divine presence is often found not in dramatic displays of power, but in quiet moments of peace and inner stillness.",
    "Divine Wisdom Beyond Appearances": "The story illustrates how divine wisdom often contradicts surface appearances. What seems harmful may serve hidden purposes we cannot see.",
    "Divine Destiny Through Trials": "This narrative shows how difficult experiences can be the very path that leads to fulfilling our highest purpose and serving others.",
    "Duty vs. Compassion": "The story explores the tension between our obligations and our emotions, teaching us when duty must transcend personal feelings.",
    "Divine Transcendence and Grace": "This account reveals the overwhelming nature of divine reality while showing how grace makes the infinite accessible to finite beings.",
    "Selfless Leadership": "The narrative demonstrates that true leadership means serving others even at great personal cost, finding joy in their welfare over our own.",
    "Redemption and Transformation": "This story proves that no person is beyond redemption, and that compassion can transform even the most hardened heart.",
    "The Nature of Reality": "The tale questions the nature of existence itself, suggesting that what we consider 'real' may be far more fluid than we imagine.",
    "Emptiness and Learning": "This story teaches that true learning requires letting go of preconceptions and approaching wisdom with an open, empty mind.",
    "The Invisible Divine Presence": "The narrative reveals how the divine essence permeates all existence, though often invisible to our ordinary perception.",
    "Seeking Eternal Truth": "This account honors the spiritual seeker who values eternal wisdom over temporary pleasures and material gains.",
    "Planting for Future Generations": "The story emphasizes our responsibility to plant seeds whose fruits we may never see, working for those who come after us.",
    "The Measure of True Giving": "This narrative reveals that the value of a gift lies not in its size, but in the sacrifice and intention behind it."
  };

  const introduction = storyIntroductions[passageData.traditionId] || storyIntroductions[1];
  const meaningExploration = meaningExplorations[passageData.theme] || "This story offers profound wisdom for our spiritual journey.";

  const story = `${introduction}

${passageData.content}

${meaningExploration}

In our modern lives, this ancient story speaks to universal human experiences. Whether we face betrayal, loss, moral dilemmas, or spiritual seeking, these timeless narratives offer guidance that transcends culture and century.

The power of such stories lies not just in their historical significance, but in their ability to illuminate patterns of human experience that remain constant across time. They invite us to see our own lives within the larger tapestry of spiritual truth.`;

  return story;
}

function generateLifeLesson(passageData: any, template?: any): string {
  const lifeLessons = {
    "Divine Purpose in Suffering": "Even our darkest moments can serve purposes we cannot see—trust that your trials may be preparing you for unexpected blessings.",
    "Unconditional Love and Forgiveness": "True love doesn't wait for perfection before offering acceptance—it celebrates return over righteousness.",
    "Finding God in Stillness": "Divine presence is often found not in life's storms, but in the gentle whisper that follows—learn to listen in the quiet.",
    "Divine Wisdom Beyond Appearances": "What appears harmful today may serve tomorrow's good—trust that there is wisdom beyond what you can currently see.",
    "Divine Destiny Through Trials": "Your greatest struggles may be the very path leading to your highest purpose—embrace the journey even when you cannot see the destination.",
    "Duty vs. Compassion": "Sometimes love requires us to act beyond our feelings—true compassion may demand difficult choices that serve the greater good.",
    "Divine Transcendence and Grace": "The divine is both infinitely beyond us and intimately present with us—grace bridges what seems impossible to reach.",
    "Selfless Leadership": "Real leadership means carrying others' burdens, not being carried—find joy in lifting others up, even at personal cost.",
    "Redemption and Transformation": "No heart is too hardened for transformation—approach even the most difficult people with compassion, for they too can change.",
    "The Nature of Reality": "Question what you think you know about reality—the boundary between dreamer and dream may be more fluid than you imagine.",
    "Emptiness and Learning": "True wisdom begins when we empty ourselves of assumptions—approach each day as a student, not an expert.",
    "The Invisible Divine Presence": "The sacred permeates everything around you, though often invisible—train your heart to recognize the divine in ordinary moments.",
    "Seeking Eternal Truth": "Value wisdom over wealth, understanding over pleasure—the truths that matter most cannot be bought or consumed.",
    "Planting for Future Generations": "Work for harvests you may never see—your greatest legacy lies in what you plant for those who come after you.",
    "The Measure of True Giving": "The value of your gift lies not in its size but in your sacrifice—give from your heart, not your abundance."
  };

  return lifeLessons[passageData.theme as keyof typeof lifeLessons] || 
         "This ancient wisdom offers timeless guidance for navigating life's deeper questions with grace and understanding.";
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
