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
  // Bible - Christianity & Judaism
  {
    traditionId: 1,
    source: "Matthew 18:12-14",
    title: "The Lost Sheep",
    content: "What do you think? If a man owns a hundred sheep, and one of them wanders away, will he not leave the ninety-nine on the hills and go to look for the one that wandered off? And if he finds it, truly I tell you, he is happier about that one sheep than about the ninety-nine that did not wander off. In the same way your Father in heaven is not willing that any of these little ones should perish.",
    context: "Jesus teaches about God's love for each individual soul",
    theme: "Divine Love and Forgiveness"
  },
  {
    traditionId: 1,
    source: "Luke 15:11-32",
    title: "The Prodigal Son",
    content: "A man had two sons. The younger one said to his father, 'Father, give me my share of the estate.' So he divided his property between them. Not long after that, the younger son got together all he had, set off for a distant country and there squandered his wealth in wild living. But while he was still a long way off, his father saw him and was filled with compassion for him; he ran to his son, threw his arms around him and kissed him.",
    context: "Jesus' parable about unconditional love and forgiveness",
    theme: "Unconditional Love and Forgiveness"
  },
  {
    traditionId: 1,
    source: "Psalm 23:1-4",
    title: "The Lord is My Shepherd",
    content: "The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul. He guides me along the right paths for his name's sake. Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.",
    context: "David's psalm of trust and divine protection",
    theme: "Trust and Divine Protection"
  },
  {
    traditionId: 1,
    source: "1 Corinthians 13:4-7",
    title: "The Nature of Love",
    content: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs. Love does not delight in evil but rejoices with the truth. It always protects, always trusts, always hopes, always perseveres.",
    context: "Paul's teaching on the essential nature of divine love",
    theme: "Divine Love and Compassion"
  },
  {
    traditionId: 1,
    source: "Matthew 5:3-4",
    title: "The Beatitudes",
    content: "Blessed are the poor in spirit, for theirs is the kingdom of heaven. Blessed are those who mourn, for they will be comforted. Blessed are the meek, for they will inherit the earth. Blessed are those who hunger and thirst for righteousness, for they will be filled.",
    context: "Jesus' teachings on spiritual blessedness and character",
    theme: "Spiritual Blessedness"
  },

  // Qur'an - Islam
  {
    traditionId: 2,
    source: "Quran 18:65-82",
    title: "Moses and Al-Khidr",
    content: "So they found one of Our servants, on whom We had bestowed Mercy from Ourselves and whom We had taught knowledge from Our own Presence. Moses said to him: 'May I follow you, on the footing that you teach me something of the (higher) Truth which you have been taught?' The other said: 'Verily you will not be able to have patience with me!'",
    context: "The story of Moses learning from the mysterious servant Al-Khidr about divine wisdom",
    theme: "Divine Wisdom Beyond Appearances"
  },
  {
    traditionId: 2,
    source: "Quran 2:255",
    title: "Ayat al-Kursi (Throne Verse)",
    content: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills.",
    context: "The most celebrated verse in the Qur'an about Allah's eternal nature",
    theme: "Divine Majesty and Omniscience"
  },
  {
    traditionId: 2,
    source: "Quran 24:35",
    title: "The Light Verse",
    content: "Allah is the light of the heavens and the earth. The example of His light is like a niche within which is a lamp, the lamp is within glass, the glass as if it were a brilliant star lit from a blessed olive tree, neither of the east nor of the west, whose oil would almost glow even if untouched by fire. Light upon light. Allah guides to His light whom He wills.",
    context: "The famous verse describing Allah as the divine light illuminating all existence",
    theme: "Divine Light and Guidance"
  },
  {
    traditionId: 2,
    source: "Quran 55:1-4",
    title: "The Compassionate",
    content: "The Most Compassionate taught the Qur'an, created humanity, and taught them speech. The sun and the moon follow their calculated courses; the stars and the trees bow down in worship.",
    context: "Opening of Surah Ar-Rahman highlighting Allah's mercy and creation",
    theme: "Divine Compassion and Creation"
  },
  {
    traditionId: 2,
    source: "Quran 94:5-6",
    title: "After Hardship Comes Ease",
    content: "For indeed, with hardship comes ease. Indeed, with hardship comes ease.",
    context: "Allah's promise that relief follows every difficulty",
    theme: "Hope and Perseverance"
  },

  // Bhagavad Gita - Hinduism
  {
    traditionId: 3,
    source: "Bhagavad Gita 2:47",
    title: "Action Without Attachment",
    content: "You have a right to perform your prescribed duty, but do not become attached to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty.",
    context: "Krishna's teaching to Arjuna about performing duty without attachment to results",
    theme: "Selfless Service"
  },
  {
    traditionId: 3,
    source: "Bhagavad Gita 4:7-8",
    title: "Divine Incarnation",
    content: "Whenever there is a decline in righteousness and an increase in unrighteousness, O Arjuna, at that time I manifest myself on earth. To deliver the pious and to annihilate the miscreants, as well as to reestablish the principles of dharma, I appear in every age.",
    context: "Krishna explains why the divine incarnates in the world",
    theme: "Divine Justice and Righteousness"
  },
  {
    traditionId: 3,
    source: "Bhagavad Gita 6:5",
    title: "Self as Friend or Enemy",
    content: "One must deliver himself with the help of his mind, and not degrade himself. The mind is the friend of the conditioned soul, and his enemy as well. For him who has conquered the mind, the mind is the best of friends; but for one who has failed to do so, his mind will remain the greatest enemy.",
    context: "Krishna's teaching on mastering the mind for spiritual progress",
    theme: "Self-Mastery and Mental Discipline"
  },
  {
    traditionId: 3,
    source: "Bhagavad Gita 9:22",
    title: "Divine Providence",
    content: "But those who always worship Me with exclusive devotion, meditating on My transcendental form—to them I carry what they lack, and I preserve what they have.",
    context: "Krishna's promise to provide for his devoted followers",
    theme: "Divine Protection and Devotion"
  },
  {
    traditionId: 3,
    source: "Bhagavad Gita 18:66",
    title: "Surrender to the Divine",
    content: "Abandon all forms of dharma and simply surrender unto Me alone. I shall liberate you from all sinful reactions; do not fear.",
    context: "Krishna's final instruction to Arjuna about complete surrender",
    theme: "Divine Grace and Surrender"
  },

  // Dhammapada - Buddhism
  {
    traditionId: 4,
    source: "Dhammapada 1:1-2",
    title: "Mind as the Forerunner",
    content: "Mind is the forerunner of all actions. Mind is chief; mind-made are they. If one speaks or acts with a serene mind, happiness follows, as surely as one's shadow. Mind is the forerunner of all actions. Mind is chief; mind-made are they. If one speaks or acts with an impure mind, suffering follows, as surely as the wheel follows the hoof of the ox.",
    context: "Buddha's teaching on the power of mind and intention",
    theme: "Mindfulness and Right Intention"
  },
  {
    traditionId: 4,
    source: "Dhammapada 5:1",
    title: "Hatred and Love",
    content: "Hatred does not cease by hatred, but only by love; this is the eternal rule.",
    context: "Buddha's teaching on overcoming hatred through compassion",
    theme: "Compassion and Non-Violence"
  },
  {
    traditionId: 4,
    source: "Dhammapada 183",
    title: "The Teaching of All Buddhas",
    content: "Not to do any evil, to cultivate good, to purify one's mind—this is the teaching of all Buddhas.",
    context: "The core ethical teaching shared by all Buddhas",
    theme: "Ethical Conduct and Purification"
  },
  {
    traditionId: 4,
    source: "Dhammapada 160",
    title: "Self-Reliance",
    content: "Self is the master of self. Who else could be the master? With self well-subdued, one obtains the master that is hard to obtain.",
    context: "Buddha's teaching on personal responsibility and self-mastery",
    theme: "Self-Reliance and Inner Strength"
  },
  {
    traditionId: 4,
    source: "Dhammapada 279",
    title: "The Path of Awakening",
    content: "All formations are impermanent. When one sees this with wisdom, one turns away from suffering. This is the path of purification.",
    context: "Buddha's teaching on impermanence and the path to liberation",
    theme: "Impermanence and Liberation"
  },

  // Tao Te Ching - Taoism
  {
    traditionId: 5,
    source: "Tao Te Ching 17",
    title: "The Invisible Leader",
    content: "The best leaders are those the people hardly know exist. The next best is a leader who is loved and praised. Next comes the one who is feared. The worst one is the leader that is despised. If you don't trust the people, they will become untrustworthy. The best leaders value their words, and use them sparingly. When they have accomplished their task, the people say, 'Amazing! We did it, all by ourselves!'",
    context: "Lao Tzu's teaching on wu wei - effortless action and humble leadership",
    theme: "Humility and Natural Action"
  },
  {
    traditionId: 5,
    source: "Tao Te Ching 1",
    title: "The Mystery of the Tao",
    content: "The Tao that can be spoken is not the eternal Tao. The name that can be named is not the eternal name. The nameless is the beginning of heaven and earth. The named is the mother of ten thousand things. Ever desireless, one can see the mystery. Ever desiring, one can see the manifestations.",
    context: "The opening verse describing the ineffable nature of the Tao",
    theme: "The Ineffable Divine"
  },
  {
    traditionId: 5,
    source: "Tao Te Ching 8",
    title: "The Virtue of Water",
    content: "The highest goodness is like water. Water benefits all things and does not compete. It dwells in places that all disdain. This is why it is so near to the Tao. In dwelling, be close to the land. In meditation, go deep in the heart. In dealing with others, be gentle and kind.",
    context: "Lao Tzu uses water as a metaphor for the Tao's way of being",
    theme: "Humility and Gentle Strength"
  },
  {
    traditionId: 5,
    source: "Tao Te Ching 33",
    title: "True Strength",
    content: "Knowing others is intelligence; knowing yourself is true wisdom. Mastering others is strength; mastering yourself is true power. If you realize that you have enough, you are truly rich.",
    context: "Lao Tzu's teaching on the difference between external and internal power",
    theme: "Self-Knowledge and Contentment"
  },
  {
    traditionId: 5,
    source: "Tao Te Ching 81",
    title: "The Sage's Way",
    content: "True words are not beautiful; beautiful words are not true. Those who are good do not argue; those who argue are not good. Those who know are not learned; the learned do not know. The sage does not attempt anything very big, and thus achieves greatness.",
    context: "The final chapter summarizing the sage's approach to life",
    theme: "Wisdom and Simplicity"
  },

  // Upanishads - Vedanta Hinduism
  {
    traditionId: 6,
    source: "Isha Upanishad 1",
    title: "The Divine in All",
    content: "The universe is the creation of the Supreme Power meant for the benefit of all creation. Each individual life form must learn to enjoy its benefits by forming a part of the system in close relation with other species. Let not any one species encroach upon others' rights.",
    context: "Ancient Vedic wisdom about interconnectedness and cosmic harmony",
    theme: "Unity and Interconnectedness"
  },
  {
    traditionId: 6,
    source: "Chandogya Upanishad 6.8.7",
    title: "Tat Tvam Asi",
    content: "That which is the subtle essence—this whole world has that as its soul. That is Reality. That is Atman. That art thou.",
    context: "The great statement revealing the identity of individual soul with universal consciousness",
    theme: "Unity of Self and Divine"
  },
  {
    traditionId: 6,
    source: "Katha Upanishad 1.3.14",
    title: "Rise, Awake",
    content: "Arise, awake, and stop not until the goal is reached. The path is sharp as the edge of a razor, so say the wise—hard to tread and difficult to cross.",
    context: "A call to spiritual awakening and persistent effort on the path",
    theme: "Spiritual Awakening and Perseverance"
  },
  {
    traditionId: 6,
    source: "Brihadaranyaka Upanishad 1.3.28",
    title: "From Darkness to Light",
    content: "Lead me from the unreal to the real. Lead me from darkness to light. Lead me from death to immortality.",
    context: "The famous prayer for spiritual transformation and realization",
    theme: "Spiritual Transformation"
  },
  {
    traditionId: 6,
    source: "Mandukya Upanishad 7",
    title: "The Fourth State",
    content: "Turiya is not that which is conscious of the inner world, nor that which is conscious of the outer world, nor that which is conscious of both, nor that which is a mass of consciousness. It is not simple consciousness nor is it unconsciousness. It is unperceived, unrelated, inconceivable, uninferable, unthinkable, indescribable.",
    context: "Description of the fourth state of consciousness beyond waking, dreaming, and deep sleep",
    theme: "Transcendent Consciousness"
  },

  // Talmud & Midrash - Judaism
  {
    traditionId: 7,
    source: "Talmud, Sanhedrin 37a",
    title: "The Value of One Life",
    content: "Therefore, man was created alone, to teach you that whoever destroys a single soul, Scripture considers it as if he destroyed an entire world. And whoever saves a single soul, Scripture considers it as if he saved an entire world.",
    context: "Rabbinic teaching on the infinite value of every human life",
    theme: "The Sacred Value of Life"
  },
  {
    traditionId: 7,
    source: "Talmud, Avot 2:5",
    title: "Be Human",
    content: "In a place where there are no human beings, strive to be human.",
    context: "Hillel's teaching on moral leadership and human dignity",
    theme: "Moral Courage and Leadership"
  },
  {
    traditionId: 7,
    source: "Talmud, Avot 1:14",
    title: "If Not Now, When?",
    content: "If I am not for myself, who will be for me? If I am only for myself, what am I? And if not now, when?",
    context: "Hillel's famous questions about self-responsibility and action",
    theme: "Personal Responsibility and Action"
  },
  {
    traditionId: 7,
    source: "Talmud, Shabbat 31a",
    title: "The Golden Rule",
    content: "What is hateful to you, do not do to your fellow. This is the whole Torah; the rest is commentary. Go and learn it.",
    context: "Hillel's concise summary of ethical living",
    theme: "Ethical Treatment of Others"
  },
  {
    traditionId: 7,
    source: "Talmud, Avot 3:1",
    title: "Know Your Place",
    content: "Reflect on three things and you will not come to sin: Know from where you came, where you are going, and before whom you will give account and reckoning.",
    context: "Rabbi Akavya's teaching on maintaining spiritual perspective",
    theme: "Spiritual Accountability and Humility"
  }
];

const lessonTemplates = {
  "Divine Love and Forgiveness": "In our journey through life, we sometimes lose our way, much like the sheep that wandered from the flock. Yet divine love seeks us out, rejoicing more in our return than in those who never strayed.",
  "Unconditional Love and Forgiveness": "True love does not depend on worthiness or perfection. It welcomes us home regardless of how far we have wandered, celebrating our return with joy rather than judgment.",
  "Trust and Divine Protection": "Even in life's darkest valleys, we are never alone. Divine presence walks beside us, offering comfort and guidance when we need it most.",
  "Divine Love and Compassion": "Love is the fundamental force that binds all existence together. When we embody patience, kindness, and selflessness, we become vessels of divine love in the world.",
  "Spiritual Blessedness": "True blessedness comes not from external circumstances, but from the condition of our hearts. In humility, mercy, and righteousness, we find the kingdom of heaven within.",
  "Divine Wisdom Beyond Appearances": "True wisdom often lies hidden beneath the surface of events. What appears as hardship or confusion may contain profound lessons that reveal themselves only in time.",
  "Divine Majesty and Omniscience": "The divine consciousness encompasses all existence, transcending time and space. In recognizing this infinite presence, we find our proper place in the cosmic order.",
  "Divine Light and Guidance": "Divine light illuminates the path forward, dispelling darkness and confusion. This inner light guides us toward truth and understanding.",
  "Divine Compassion and Creation": "The source of all existence is pure compassion, creating and sustaining life with infinite mercy. We are called to reflect this compassion in our daily interactions.",
  "Hope and Perseverance": "Every difficulty carries within it the seeds of its own resolution. With patience and faith, we can endure any hardship knowing that relief will come.",
  "Selfless Service": "The highest action comes from duty performed without attachment to personal gain. When we serve without expectation, we align ourselves with the divine flow of existence.",
  "Divine Justice and Righteousness": "Divine justice manifests when righteousness is restored and balance is maintained. We are called to embody these principles in our own lives and communities.",
  "Self-Mastery and Mental Discipline": "The mind can be our greatest ally or our worst enemy. Through discipline and right understanding, we transform our thoughts into instruments of peace and wisdom.",
  "Divine Protection and Devotion": "Sincere devotion creates an unbreakable bond with the divine, ensuring that our needs are met and our spiritual progress is protected.",
  "Divine Grace and Surrender": "In complete surrender to divine will, we find perfect freedom. Grace dissolves all obstacles and reveals the path to liberation.",
  "Mindfulness and Right Intention": "Every thought and action creates ripples in the fabric of reality. By cultivating pure intention and mindful awareness, we plant seeds of happiness and peace.",
  "Compassion and Non-Violence": "Love is the only force powerful enough to transform hatred. Through compassion and understanding, we break cycles of violence and create peace.",
  "Ethical Conduct and Purification": "The foundation of spiritual life rests on ethical conduct. By purifying our actions, speech, and thoughts, we create conditions for inner peace and wisdom.",
  "Self-Reliance and Inner Strength": "True strength comes from within. By mastering ourselves, we become capable of facing any challenge with equanimity and wisdom.",
  "Impermanence and Liberation": "Understanding the transient nature of all phenomena frees us from attachment and suffering. In accepting impermanence, we find lasting peace.",
  "Humility and Natural Action": "The most powerful leadership comes from those who lead by example, without force or ego. Like water flowing around obstacles, gentle persistence accomplishes what force cannot.",
  "The Ineffable Divine": "The ultimate reality transcends all names and concepts. In embracing mystery and letting go of the need to understand everything, we touch the infinite.",
  "Humility and Gentle Strength": "True power lies in gentleness and humility. Like water that nourishes all life, we accomplish the most when we act without ego or force.",
  "Self-Knowledge and Contentment": "Knowing ourselves deeply is the beginning of true wisdom. When we master our inner world, we find contentment regardless of external circumstances.",
  "Wisdom and Simplicity": "The deepest truths are often the simplest ones. In embracing simplicity and letting go of complexity, we discover profound wisdom.",
  "Unity and Interconnectedness": "All existence is woven together in an intricate tapestry of connection. When we recognize our place in this cosmic harmony, we find peace and purpose.",
  "Unity of Self and Divine": "The boundary between individual consciousness and universal consciousness is an illusion. In realizing our true nature, we discover our unity with all existence.",
  "Spiritual Awakening and Perseverance": "The spiritual path requires courage and persistence. Though the way may be difficult, those who persevere will reach the goal of enlightenment.",
  "Spiritual Transformation": "True transformation involves moving from illusion to reality, from darkness to light, from mortality to immortality. This is the ultimate goal of human existence.",
  "Transcendent Consciousness": "Beyond ordinary states of awareness lies a transcendent consciousness that defies description. This is the goal of all spiritual seeking.",
  "The Sacred Value of Life": "Each soul contains infinite potential and divine spark. To honor and protect life - all life - is to participate in the sacred act of creation itself.",
  "Moral Courage and Leadership": "True leadership means standing up for what is right, especially when others fail to do so. In being fully human, we inspire others to discover their own humanity.",
  "Personal Responsibility and Action": "We must take responsibility for our own spiritual development while also serving others. The time for action is always now.",
  "Ethical Treatment of Others": "The foundation of all ethical behavior is treating others as we would wish to be treated. This simple principle contains the essence of all spiritual teaching.",
  "Spiritual Accountability and Humility": "Remembering our origins, destination, and ultimate accountability keeps us humble and focused on what truly matters in life."
};

export async function generateTodaysLesson(storage: IStorage): Promise<any> {
  // Check if there's a lesson for today's actual date
  const today = new Date();
  const todayDateString = today.toISOString().split('T')[0]; // YYYY-MM-DD
  
  const existingLesson = await storage.getTodaysLesson();
  
  // Only return existing lesson if it's actually from today
  if (existingLesson) {
    const lessonDate = new Date(existingLesson.date).toISOString().split('T')[0];
    if (lessonDate === todayDateString) {
      return existingLesson;
    } else {
      console.log(`Existing lesson is from ${lessonDate}, generating fresh lesson for ${todayDateString}`);
    }
  }

  // Get all passages from database
  const allPassages = await storage.getAllPassages();
  console.log(`Found ${allPassages.length} passages in database`);
  
  // Get all existing lessons to check for used passages
  const allLessons = await storage.getRecentLessons(1000); // Get all lessons
  const usedSources = new Set(allLessons.map(lesson => lesson.passage.source));
  
  // Check for recent usage (last 30 days) to avoid repeating lessons too soon
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recentUsedSources = new Set(
    allLessons
      .filter(lesson => new Date(lesson.date) > thirtyDaysAgo)
      .map(lesson => lesson.passage.source)
  );

  // Find passages that haven't been used recently (prefer completely unused, then older usage)
  const availablePassages = allPassages.filter(passage => {
    return !recentUsedSources.has(passage.source);
  });
  
  // If no passages available in last 30 days, use passages not used in last 7 days
  let passagesToChooseFrom = availablePassages;
  if (passagesToChooseFrom.length === 0) {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyUsedSources = new Set(
      allLessons
        .filter(lesson => new Date(lesson.date) > sevenDaysAgo)
        .map(lesson => lesson.passage.source)
    );
    
    passagesToChooseFrom = allPassages.filter(passage => {
      return !weeklyUsedSources.has(passage.source);
    });
    
    console.log(`Using passages not used in last 7 days: ${passagesToChooseFrom.length} available`);
  } else {
    console.log(`Using passages not used in last 30 days: ${passagesToChooseFrom.length} available`);
  }

  if (passagesToChooseFrom.length === 0) {
    console.log("All passages have been used recently, using least recently used passage");
    passagesToChooseFrom = allPassages; // Use all passages as fallback
  }

  const randomIndex = Math.floor(Math.random() * passagesToChooseFrom.length);
  const selectedPassage = passagesToChooseFrom[randomIndex];
  console.log(`Selected passage: ${selectedPassage.source} - ${selectedPassage.title}`);

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
    // The passage selection is handled in generateTodaysLesson, so we proceed with the given passage

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
      emailArtworkUrl: lessonContent.emailArtworkUrl,
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
  let emailArtworkUrl = "";
  let artworkDescription = "";
  
  try {
    const artwork = await generateArtworkForLesson(
      passageData.traditionId, 
      title, 
      story
    );
    artworkUrl = artwork.url;
    emailArtworkUrl = artwork.emailUrl;
    artworkDescription = artwork.description;
  } catch (error) {
    console.error("Error generating artwork, using fallback:", error);
    // Use a simple fallback
    const fallbackSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f4f1e8'/%3E%3Ctext x='200' y='150' text-anchor='middle' font-family='serif' font-size='14' fill='%23654321'%3ESpiritual Artwork%3C/text%3E%3C/svg%3E";
    artworkUrl = fallbackSvg;
    emailArtworkUrl = fallbackSvg;
    artworkDescription = "Traditional spiritual artwork";
  }

  return {
    title,
    story,
    lifeLesson,
    artworkUrl,
    emailArtworkUrl,
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
    
    "The Sacred Value of Life": `From ${passageData.source}, the Talmudic sages teach us: ${passageData.content}\n\nThis profound teaching elevates the value of each individual life to cosmic significance. Every person contains within them infinite potential, unique perspectives, and the divine spark that connects them to the Creator.\n\nWhen we truly understand that each soul is a universe unto itself, our approach to relationships, justice, and compassion is transformed. We can no longer dismiss anyone as unimportant or expendable, for in doing so we would be destroying something of infinite worth. This teaching calls us to see the divine image in every face we encounter.`,
    
    "Divine Majesty and Omniscience": `The sacred verse of ${passageData.source}, known as ${passageData.title}, stands as one of the most celebrated passages in Islamic scripture: ${passageData.content}\n\nThis magnificent verse unveils the absolute nature of divine consciousness - a reality that transcends all limitations of time, space, and human understanding. Unlike created beings who require rest and renewal, the Divine exists in a state of eternal awareness and perfect presence.\n\nThe verse reveals that divine knowledge encompasses all existence simultaneously - past, present, and future are held within infinite consciousness. This cosmic awareness is not distant or abstract, but intimately involved in sustaining every moment of existence. When we contemplate this infinite presence, we find both humility before the mystery and comfort in knowing that nothing escapes divine care and wisdom.`
  };
  
  return storyTemplates[passageData.theme as keyof typeof storyTemplates] || `This profound teaching from ${passageData.source} offers timeless wisdom for spiritual growth and understanding.`;
}

function generateLifeLesson(passageData: any, template?: any): string {
  const lifeLessons = {
    "Divine Love and Forgiveness": "No matter how far we wander, divine love seeks us out with infinite patience and celebrates our return home.",
    "Unconditional Love and Forgiveness": "True love doesn't wait for worthiness - it welcomes us back with celebration, not judgment. Practice welcoming others with this same grace.",
    "Trust and Divine Protection": "Even in your darkest valleys, you are not walking alone. Trust that divine presence guides and protects you through every challenge.",
    "Divine Love and Compassion": "Embody patience, kindness, and selflessness in your daily interactions. When you become a vessel of love, you transform both yourself and others.",
    "Spiritual Blessedness": "True happiness comes from the condition of your heart, not your circumstances. Cultivate humility, mercy, and righteousness within.",
    "Divine Wisdom Beyond Appearances": "Trust in divine wisdom, even when circumstances seem confusing - a greater purpose often lies hidden beneath the surface.",
    "Divine Majesty and Omniscience": "Recognize the infinite presence that encompasses all existence. Find peace in knowing your place within this greater cosmic order.",
    "Divine Light and Guidance": "Allow your inner light to illuminate your path forward. When you seek truth with sincerity, guidance will always come.",
    "Divine Compassion and Creation": "Reflect the same compassion that creates and sustains all life. Let mercy guide your interactions with every being you encounter.",
    "Hope and Perseverance": "Remember that every difficulty contains the seeds of its own resolution. With patience and faith, relief will come.",
    "Selfless Service": "Transform your daily actions into spiritual practice by performing them with dedication but without attachment to personal gain.",
    "Divine Justice and Righteousness": "Embody the principles of justice and righteousness in your own life. Be the change you wish to see in the world.",
    "Self-Mastery and Mental Discipline": "Train your mind to be your ally, not your enemy. Through discipline and right understanding, transform thoughts into instruments of peace.",
    "Divine Protection and Devotion": "Sincere devotion creates an unbreakable bond with the divine. Trust that your spiritual progress is protected and your needs will be met.",
    "Divine Grace and Surrender": "In complete surrender to divine will, find perfect freedom. Let grace dissolve the obstacles that your ego cannot overcome.",
    "Mindfulness and Right Intention": "Cultivate peace and happiness by maintaining mindful awareness and pure intentions in all your thoughts and actions.",
    "Compassion and Non-Violence": "Meet hatred with love, violence with compassion. You have the power to break cycles of negativity through understanding.",
    "Ethical Conduct and Purification": "Build your spiritual life on the foundation of ethical conduct. Purify your actions, speech, and thoughts to create inner peace.",
    "Self-Reliance and Inner Strength": "True strength comes from mastering yourself. Develop the inner resources to face any challenge with wisdom and equanimity.",
    "Impermanence and Liberation": "Accept the transient nature of all experiences. In embracing impermanence, find freedom from attachment and lasting peace.",
    "Humility and Natural Action": "Lead by example and serve others' growth - true influence comes from humility, not force or ego.",
    "The Ineffable Divine": "Embrace mystery and let go of the need to understand everything. In accepting the limits of knowledge, touch the infinite.",
    "Humility and Gentle Strength": "Accomplish the most through gentle persistence. Like water that nourishes all life, act without ego or force.",
    "Self-Knowledge and Contentment": "Know yourself deeply and master your inner world. Find contentment that doesn't depend on external circumstances.",
    "Wisdom and Simplicity": "Seek the simple truths that lie beneath complexity. In embracing simplicity, discover the most profound wisdom.",
    "Unity and Interconnectedness": "Recognize your connection to all life and let this awareness guide you toward greater compassion and harmony.",
    "Unity of Self and Divine": "The boundary between your consciousness and universal consciousness is an illusion. Discover your unity with all existence.",
    "Spiritual Awakening and Perseverance": "Stay committed to your spiritual path despite difficulties. Those who persevere will reach the goal of enlightenment.",
    "Spiritual Transformation": "Move from illusion to reality, from darkness to light. This transformation from mortality to immortality is your ultimate purpose.",
    "Transcendent Consciousness": "Seek the consciousness beyond ordinary awareness. This transcendent state is the goal of all spiritual seeking.",
    "The Sacred Value of Life": "Honor the infinite worth of every soul you encounter, for each person carries the divine spark within them.",
    "Moral Courage and Leadership": "Stand up for what is right, especially when others fail to do so. In being fully human, inspire others to discover their humanity.",
    "Personal Responsibility and Action": "Take responsibility for your spiritual development while serving others. The time for meaningful action is always now.",
    "Ethical Treatment of Others": "Treat others as you would wish to be treated. This simple principle contains the essence of all spiritual teaching.",
    "Spiritual Accountability and Humility": "Remember your origins, destination, and ultimate accountability. This keeps you humble and focused on what truly matters."
  };
  
  return lifeLessons[passageData.theme as keyof typeof lifeLessons] || "Seek wisdom in the teachings of the ancients and apply their timeless truths to your daily life.";
}