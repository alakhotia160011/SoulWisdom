import { 
  traditions, 
  passages, 
  lessons, 
  subscriptions,
  whatsappSubscribers,
  type Tradition, 
  type Passage, 
  type Lesson, 
  type Subscription,
  type WhatsAppSubscriber,
  type InsertTradition, 
  type InsertPassage, 
  type InsertLesson, 
  type InsertSubscription,
  type InsertWhatsAppSubscriber,
  type LessonWithDetails,
  type TraditionWithCount
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, like, count, and, gte, lte, lt, or } from "drizzle-orm";

export interface IStorage {
  // Traditions
  getTraditions(): Promise<Tradition[]>;
  getTraditionsWithCounts(): Promise<TraditionWithCount[]>;
  getTraditionBySlug(slug: string): Promise<Tradition | undefined>;
  createTradition(tradition: InsertTradition): Promise<Tradition>;

  // Passages
  getPassagesByTradition(traditionId: number): Promise<Passage[]>;
  getRandomPassage(excludeIds?: number[]): Promise<Passage | undefined>;
  createPassage(passage: InsertPassage): Promise<Passage>;

  // Lessons
  getTodaysLesson(): Promise<LessonWithDetails | undefined>;
  getLessonById(id: number): Promise<LessonWithDetails | undefined>;
  getRecentLessons(limit?: number, offset?: number): Promise<LessonWithDetails[]>;
  getLessonsByTradition(traditionSlug: string, limit?: number, offset?: number): Promise<LessonWithDetails[]>;
  searchLessons(query: string, limit?: number, offset?: number): Promise<LessonWithDetails[]>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  updateLessonEmailArtwork(lessonId: number, emailArtworkUrl: string): Promise<void>;

  // Subscriptions
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  getActiveSubscriptions(): Promise<Subscription[]>;

  // WhatsApp Subscriptions
  getWhatsAppSubscribers(): Promise<WhatsAppSubscriber[]>;
  getWhatsAppSubscriberByPhone(phoneNumber: string): Promise<WhatsAppSubscriber | undefined>;
  createWhatsAppSubscriber(subscriber: InsertWhatsAppSubscriber): Promise<WhatsAppSubscriber>;
  updateWhatsAppSubscriber(phoneNumber: string, updates: Partial<WhatsAppSubscriber>): Promise<void>;
  deleteWhatsAppSubscriber(phoneNumber: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    this.initializeDatabase();
  }

  private async initializeDatabase() {
    try {
      const existingTraditions = await db.select().from(traditions).limit(1);
      if (existingTraditions.length === 0) {
        await this.seedDatabase();
      }
    } catch (error) {
      console.log("Database will be initialized on first use");
    }
  }

  private async seedDatabase() {
    console.log("Seeding database with spiritual traditions and passages...");
    
    const traditionsData = [
      {
        name: "Bible",
        slug: "bible",
        description: "Psalms, Job, Gospels, Letters",
        color: "blue",
        icon: "fas fa-cross",
        originPeriod: "1200 BCE - 100 CE",
        originLocation: "Ancient Israel, Palestine, and Mediterranean",
        spiritualTradition: "Christianity and Judaism",
        summary: "The Bible is a collection of sacred texts fundamental to both Judaism and Christianity. It contains historical narratives, poetry, prophecy, and teachings that have shaped Western civilization for millennia. The Hebrew Bible (Tanakh) forms the foundation, while the New Testament adds Christian teachings and the life of Jesus Christ.",
        famousQuotes: [
          "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life. - John 3:16",
          "The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters. - Psalm 23:1-2",
          "Trust in the Lord with all your heart and lean not on your own understanding. - Proverbs 3:5"
        ],
        imageUrl: "/api/placeholder/illuminated-manuscript-bible",
        manuscriptStyle: "Medieval illuminated manuscript"
      },
      {
        name: "Qur'an",
        slug: "quran",
        description: "Sacred verses of divine guidance",
        color: "green",
        icon: "fas fa-moon",
        originPeriod: "610 - 632 CE",
        originLocation: "Arabian Peninsula (Mecca and Medina)",
        spiritualTradition: "Islam",
        summary: "The Qur'an is the central religious text of Islam, believed by Muslims to be the direct word of God (Allah) as revealed to the Prophet Muhammad. Written in Arabic, it serves as a guide for all aspects of life, containing moral guidance, legal principles, and spiritual teachings that form the foundation of Islamic civilization.",
        famousQuotes: [
          "And whoever saves a life, it is as if he has saved mankind entirely. - Qur'an 5:32",
          "And it is He who created the heavens and earth in truth. And the day He says, 'Be,' and it is, His word is the truth. - Qur'an 6:73",
          "Indeed, with hardship comes ease. - Qur'an 94:6"
        ],
        imageUrl: "/api/placeholder/islamic-calligraphy-quran",
        manuscriptStyle: "Islamic calligraphy"
      },
      {
        name: "Bhagavad Gita",
        slug: "bhagavad-gita",
        description: "Krishna's teachings on duty and devotion",
        color: "orange",
        icon: "fas fa-om",
        originPeriod: "400 BCE - 400 CE",
        originLocation: "Ancient India",
        spiritualTradition: "Hinduism",
        summary: "The Bhagavad Gita is a sacred Hindu scripture that forms part of the epic Mahabharata. It presents a dialogue between Prince Arjuna and Lord Krishna on the battlefield of Kurukshetra, addressing fundamental questions about duty, righteousness, and the nature of reality. It remains one of the most influential philosophical and spiritual texts in world literature.",
        famousQuotes: [
          "You have the right to perform your actions, but you are not entitled to the fruits of action. - Bhagavad Gita 2:47",
          "Whenever there is a decline in righteousness and an increase in unrighteousness, I manifest myself. - Bhagavad Gita 4:7",
          "The soul is neither born, and nor does it die. - Bhagavad Gita 2:20"
        ],
        imageUrl: "/api/placeholder/sanskrit-manuscript-gita",
        manuscriptStyle: "Sanskrit palm leaf manuscript"
      },
      {
        name: "Dhammapada",
        slug: "dhammapada",
        description: "Buddha's path to enlightenment",
        color: "purple",
        icon: "fas fa-lotus",
        originPeriod: "3rd century BCE",
        originLocation: "Ancient India and Sri Lanka",
        spiritualTradition: "Buddhism",
        summary: "The Dhammapada is a collection of sayings of the Buddha in verse form, one of the most widely read and studied Buddhist scriptures. It presents the essence of Buddha's teaching through 423 verses organized into 26 chapters, covering topics such as mindfulness, wisdom, and the path to liberation from suffering.",
        famousQuotes: [
          "All that we are is the result of what we have thought: it is founded on our thoughts, it is made up of our thoughts. - Dhammapada 1:1",
          "Hatred does not cease by hatred, but only by love; this is the eternal rule. - Dhammapada 1:5",
          "Better than a thousand hollow words, is one word that brings peace. - Dhammapada 8:100"
        ],
        imageUrl: "/api/placeholder/buddhist-manuscript-dhammapada",
        manuscriptStyle: "Buddhist palm leaf manuscript"
      },
      {
        name: "Tao Te Ching",
        slug: "tao-te-ching",
        description: "The way of natural harmony",
        color: "gray",
        icon: "fas fa-yin-yang",
        originPeriod: "6th - 4th century BCE",
        originLocation: "Ancient China",
        spiritualTradition: "Taoism",
        summary: "The Tao Te Ching, attributed to the sage Lao Tzu, is the foundational text of Taoism. Comprising 81 short chapters, it explores the concept of the Tao (the Way) - the source and pattern of the universe. It emphasizes wu wei (effortless action), simplicity, and living in harmony with the natural order.",
        famousQuotes: [
          "The journey of a thousand miles begins with one step. - Tao Te Ching 64",
          "When people see some things as beautiful, other things become ugly. - Tao Te Ching 2",
          "The sage does not attempt anything very big, and thus achieves greatness. - Tao Te Ching 63"
        ],
        imageUrl: "/api/placeholder/chinese-scroll-tao",
        manuscriptStyle: "Chinese brush calligraphy scroll"
      },
      {
        name: "Upanishads",
        slug: "upanishads",
        description: "Vedantic wisdom and cosmic consciousness",
        color: "yellow",
        icon: "fas fa-fire",
        originPeriod: "800 - 200 BCE",
        originLocation: "Ancient India",
        spiritualTradition: "Hinduism (Vedanta)",
        summary: "The Upanishads are ancient Sanskrit texts that form the philosophical foundation of Hinduism. They explore the nature of ultimate reality (Brahman), the self (Atman), and their fundamental unity. These profound philosophical dialogues between teachers and students have influenced countless spiritual seekers and philosophers throughout history.",
        famousQuotes: [
          "Tat tvam asi (That thou art) - You are That - Chandogya Upanishad",
          "The universe is the creation of the Supreme Power meant for the benefit of all creation. - Isha Upanishad 1",
          "From the unreal lead me to the real, from darkness lead me to light, from death lead me to immortality. - Brihadaranyaka Upanishad"
        ],
        imageUrl: "/api/placeholder/sanskrit-upanishads",
        manuscriptStyle: "Sanskrit Devanagari manuscript"
      },
      {
        name: "Talmud & Midrash",
        slug: "talmud",
        description: "Rabbinic wisdom and interpretation",
        color: "indigo",
        icon: "fas fa-star-of-david",
        originPeriod: "200 - 500 CE",
        originLocation: "Babylonia and Palestine",
        spiritualTradition: "Judaism",
        summary: "The Talmud is a vast collection of rabbinic discussions and interpretations of the Torah, forming the basis of Jewish law and theology. Combined with Midrash (homiletical interpretations), these texts represent centuries of scholarly debate and wisdom, providing guidance on both religious practice and ethical living.",
        famousQuotes: [
          "Whoever saves one life, it is considered as if he saved an entire world. - Talmud, Sanhedrin 37a",
          "In a place where there are no human beings, strive to be human. - Talmud, Avot 2:5",
          "The day is short, the work is much, the workers are lazy, the reward is great, and the Master is pressing. - Talmud, Avot 2:15"
        ],
        imageUrl: "/api/placeholder/hebrew-talmud-manuscript",
        manuscriptStyle: "Hebrew manuscript with commentary"
      }
    ];

    const insertedTraditions = await db.insert(traditions).values(traditionsData).returning();

    const passagesData = [
      {
        traditionId: insertedTraditions[0].id,
        source: "Matthew 18:12-14",
        title: "The Lost Sheep",
        content: "What do you think? If a man owns a hundred sheep, and one of them wanders away, will he not leave the ninety-nine on the hills and go to look for the one that wandered off? And if he finds it, truly I tell you, he is happier about that one sheep than about the ninety-nine that did not wander off. In the same way your Father in heaven is not willing that any of these little ones should perish.",
        context: "Jesus teaches about God's love for each individual soul",
        theme: "Divine Love and Forgiveness"
      },
      {
        traditionId: insertedTraditions[1].id,
        source: "Quran 18:65-82",
        title: "Moses and Al-Khidr",
        content: "So they found one of Our servants, on whom We had bestowed Mercy from Ourselves and whom We had taught knowledge from Our own Presence. Moses said to him: 'May I follow you, on the footing that you teach me something of the (higher) Truth which you have been taught?' The other said: 'Verily you will not be able to have patience with me!'",
        context: "The story of Moses learning from the mysterious servant Al-Khidr about divine wisdom",
        theme: "Divine Wisdom Beyond Appearances"
      },
      {
        traditionId: insertedTraditions[2].id,
        source: "Bhagavad Gita 2:47",
        title: "The Right to Action",
        content: "You have the right to perform your actions, but you are not entitled to the fruits of your actions. Do not let the results be your motive, nor let your attachment be to inaction.",
        context: "Krishna's teaching to Arjuna on the battlefield about duty without attachment to results",
        theme: "Detachment and Duty"
      },
      {
        traditionId: insertedTraditions[3].id,
        source: "Dhammapada 1:1-2",
        title: "Mind as Foundation",
        content: "All that we are is the result of what we have thought: it is founded on our thoughts, it is made up of our thoughts. If a man speaks or acts with an evil thought, pain follows him, as the wheel follows the foot of the ox that draws the carriage.",
        context: "Buddha's teaching on the power of mind and thought in shaping our experience",
        theme: "Mindfulness and Mental Purity"
      },
      {
        traditionId: insertedTraditions[4].id,
        source: "Tao Te Ching 17",
        title: "The Invisible Leader",
        content: "The best leaders are those the people hardly know exist. The next best is a leader who is loved and praised. Next comes the one who is feared. The worst one is the leader that is despised. If you don't trust the people, they will become untrustworthy. The best leaders value their words, and use them sparingly. When they have accomplished their task, the people say, 'Amazing! We did it, all by ourselves!'",
        context: "Lao Tzu's teaching on wu wei - effortless action and humble leadership",
        theme: "Humility and Natural Action"
      },
      {
        traditionId: insertedTraditions[5].id,
        source: "Isha Upanishad 1",
        title: "The Divine in All",
        content: "The universe is the creation of the Supreme Power meant for the benefit of all creation. Each individual life form must learn to enjoy its benefits by forming a part of the system in close relation with other species. Let not any one species encroach upon others' rights.",
        context: "Ancient Vedic wisdom about interconnectedness and cosmic harmony",
        theme: "Unity and Interconnectedness"
      },
      {
        traditionId: insertedTraditions[6].id,
        source: "Talmud, Sanhedrin 37a",
        title: "The Value of One Life",
        content: "Whoever saves one life, it is considered as if he saved an entire world. And whoever destroys a soul, it is considered as if he destroyed an entire world.",
        context: "Rabbinic teaching emphasizing the infinite value of each human life",
        theme: "Human Dignity and Responsibility"
      }
    ];

    await db.insert(passages).values(passagesData);
    console.log("Database seeded successfully");
  }

  async getTraditions(): Promise<Tradition[]> {
    return await db.select().from(traditions);
  }

  async getTraditionsWithCounts(): Promise<TraditionWithCount[]> {
    const traditionsWithCounts = await db
      .select({
        id: traditions.id,
        name: traditions.name,
        slug: traditions.slug,
        description: traditions.description,
        color: traditions.color,
        icon: traditions.icon,
        originPeriod: traditions.originPeriod,
        originLocation: traditions.originLocation,
        spiritualTradition: traditions.spiritualTradition,
        summary: traditions.summary,
        famousQuotes: traditions.famousQuotes,
        imageUrl: traditions.imageUrl,
        manuscriptStyle: traditions.manuscriptStyle,
        lessonCount: count(lessons.id)
      })
      .from(traditions)
      .leftJoin(passages, eq(passages.traditionId, traditions.id))
      .leftJoin(lessons, eq(lessons.passageId, passages.id))
      .groupBy(traditions.id)
      .orderBy(traditions.id);

    return traditionsWithCounts;
  }

  async getTraditionBySlug(slug: string): Promise<Tradition | undefined> {
    const [tradition] = await db.select().from(traditions).where(eq(traditions.slug, slug));
    return tradition;
  }

  async createTradition(insertTradition: InsertTradition): Promise<Tradition> {
    const [tradition] = await db.insert(traditions).values(insertTradition).returning();
    return tradition;
  }

  async getPassagesByTradition(traditionId: number): Promise<Passage[]> {
    return await db.select().from(passages).where(eq(passages.traditionId, traditionId));
  }

  async getRandomPassage(excludeIds: number[] = []): Promise<Passage | undefined> {
    const allPassages = await db.select().from(passages);
    const availablePassages = allPassages.filter(p => !excludeIds.includes(p.id));
    
    if (availablePassages.length === 0) return undefined;
    
    const randomIndex = Math.floor(Math.random() * availablePassages.length);
    return availablePassages[randomIndex];
  }

  async createPassage(insertPassage: InsertPassage): Promise<Passage> {
    const [passage] = await db.insert(passages).values(insertPassage).returning();
    return passage;
  }

  async getTodaysLesson(): Promise<LessonWithDetails | undefined> {
    // Get today's date in EST timezone
    const estToday = new Date(new Date().toLocaleString("en-US", {timeZone: "America/New_York"}));
    const estStartOfDay = new Date(estToday.getFullYear(), estToday.getMonth(), estToday.getDate());
    const estEndOfDay = new Date(estToday.getFullYear(), estToday.getMonth(), estToday.getDate() + 1);

    // First try to find a lesson created today in EST
    const [todaysLesson] = await db
      .select()
      .from(lessons)
      .where(and(gte(lessons.date, estStartOfDay), lt(lessons.date, estEndOfDay)))
      .orderBy(desc(lessons.date))
      .limit(1);

    if (todaysLesson) {
      return this.buildLessonWithDetails(todaysLesson);
    }

    // If no lesson for today, return the most recent lesson
    const [lesson] = await db
      .select()
      .from(lessons)
      .orderBy(desc(lessons.date))
      .limit(1);

    if (!lesson) return undefined;
    return this.buildLessonWithDetails(lesson);
  }

  async getLessonById(id: number): Promise<LessonWithDetails | undefined> {
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
    if (!lesson) return undefined;
    return this.buildLessonWithDetails(lesson);
  }

  async getRecentLessons(limit: number = 10, offset: number = 0): Promise<LessonWithDetails[]> {
    const recentLessons = await db
      .select()
      .from(lessons)
      .orderBy(desc(lessons.date))
      .limit(limit)
      .offset(offset);

    const lessonsWithDetails = await Promise.all(
      recentLessons.map(lesson => this.buildLessonWithDetails(lesson))
    );

    return lessonsWithDetails.filter(lesson => lesson !== undefined) as LessonWithDetails[];
  }

  async getLessonsByTradition(traditionSlug: string, limit: number = 10, offset: number = 0): Promise<LessonWithDetails[]> {
    const traditionLessons = await db
      .select({
        id: lessons.id,
        title: lessons.title,
        story: lessons.story,
        lifeLesson: lessons.lifeLesson,
        artworkUrl: lessons.artworkUrl,
        artworkDescription: lessons.artworkDescription,
        date: lessons.date,
        isGenerated: lessons.isGenerated,
        passageId: lessons.passageId
      })
      .from(lessons)
      .innerJoin(passages, eq(lessons.passageId, passages.id))
      .innerJoin(traditions, eq(passages.traditionId, traditions.id))
      .where(eq(traditions.slug, traditionSlug))
      .orderBy(desc(lessons.date))
      .limit(limit)
      .offset(offset);

    const lessonsWithDetails = await Promise.all(
      traditionLessons.map(lesson => this.buildLessonWithDetails(lesson))
    );

    return lessonsWithDetails.filter(lesson => lesson !== undefined) as LessonWithDetails[];
  }

  async searchLessons(query: string, limit: number = 10, offset: number = 0): Promise<LessonWithDetails[]> {
    const searchPattern = `%${query.toLowerCase()}%`;
    
    const searchResults = await db
      .select({
        id: lessons.id,
        title: lessons.title,
        story: lessons.story,
        lifeLesson: lessons.lifeLesson,
        artworkUrl: lessons.artworkUrl,
        artworkDescription: lessons.artworkDescription,
        date: lessons.date,
        isGenerated: lessons.isGenerated,
        passageId: lessons.passageId
      })
      .from(lessons)
      .innerJoin(passages, eq(lessons.passageId, passages.id))
      .innerJoin(traditions, eq(passages.traditionId, traditions.id))
      .where(
        or(
          like(lessons.title, searchPattern),
          like(lessons.story, searchPattern),
          like(lessons.lifeLesson, searchPattern),
          like(passages.content, searchPattern),
          like(traditions.name, searchPattern)
        )
      )
      .orderBy(desc(lessons.date))
      .limit(limit)
      .offset(offset);

    const lessonsWithDetails = await Promise.all(
      searchResults.map(lesson => this.buildLessonWithDetails(lesson))
    );

    return lessonsWithDetails.filter(lesson => lesson !== undefined) as LessonWithDetails[];
  }

  async createLesson(insertLesson: InsertLesson): Promise<Lesson> {
    const [lesson] = await db.insert(lessons).values({
      ...insertLesson,
      date: new Date(),
      isGenerated: true
    }).returning();
    return lesson;
  }

  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const [subscription] = await db.insert(subscriptions).values({
      ...insertSubscription,
      isActive: true,
      createdAt: new Date()
    }).returning();
    return subscription;
  }

  async getActiveSubscriptions(): Promise<Subscription[]> {
    return await db.select().from(subscriptions).where(eq(subscriptions.isActive, true));
  }

  // WhatsApp Subscriptions
  async getWhatsAppSubscribers(): Promise<WhatsAppSubscriber[]> {
    return await db.select().from(whatsappSubscribers).where(eq(whatsappSubscribers.isActive, true));
  }

  async getWhatsAppSubscriberByPhone(phoneNumber: string): Promise<WhatsAppSubscriber | undefined> {
    const [subscriber] = await db.select()
      .from(whatsappSubscribers)
      .where(eq(whatsappSubscribers.phoneNumber, phoneNumber));
    return subscriber;
  }

  async createWhatsAppSubscriber(insertSubscriber: InsertWhatsAppSubscriber): Promise<WhatsAppSubscriber> {
    const [subscriber] = await db.insert(whatsappSubscribers).values({
      ...insertSubscriber,
      isActive: true,
      createdAt: new Date()
    }).returning();
    return subscriber;
  }

  async updateWhatsAppSubscriber(phoneNumber: string, updates: Partial<WhatsAppSubscriber>): Promise<void> {
    await db.update(whatsappSubscribers)
      .set(updates)
      .where(eq(whatsappSubscribers.phoneNumber, phoneNumber));
  }

  async deleteWhatsAppSubscriber(phoneNumber: string): Promise<void> {
    await db.update(whatsappSubscribers)
      .set({ isActive: false })
      .where(eq(whatsappSubscribers.phoneNumber, phoneNumber));
  }

  private async buildLessonWithDetails(lesson: Lesson): Promise<LessonWithDetails | undefined> {
    const [passageWithTradition] = await db
      .select({
        passage: passages,
        tradition: traditions
      })
      .from(passages)
      .innerJoin(traditions, eq(passages.traditionId, traditions.id))
      .where(eq(passages.id, lesson.passageId));

    if (!passageWithTradition) return undefined;

    return {
      ...lesson,
      passage: {
        ...passageWithTradition.passage,
        tradition: passageWithTradition.tradition
      }
    };
  }
}

export const storage = new DatabaseStorage();