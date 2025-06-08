import { 
  traditions, 
  passages, 
  lessons, 
  subscriptions,
  type Tradition, 
  type Passage, 
  type Lesson, 
  type Subscription,
  type InsertTradition, 
  type InsertPassage, 
  type InsertLesson, 
  type InsertSubscription,
  type LessonWithDetails,
  type TraditionWithCount
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, like, count, and, gte, lte, or } from "drizzle-orm";

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

  // Subscriptions
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  getActiveSubscriptions(): Promise<Subscription[]>;
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
      { name: "Bible", slug: "bible", description: "Psalms, Job, Gospels, Letters", color: "blue", icon: "fas fa-cross" },
      { name: "Qur'an", slug: "quran", description: "Sacred verses of guidance", color: "green", icon: "fas fa-moon" },
      { name: "Bhagavad Gita", slug: "bhagavad-gita", description: "Krishna's teachings on duty", color: "orange", icon: "fas fa-om" },
      { name: "Dhammapada", slug: "dhammapada", description: "Buddha's path to awakening", color: "purple", icon: "fas fa-lotus" },
      { name: "Tao Te Ching", slug: "tao-te-ching", description: "The way of harmony", color: "gray", icon: "fas fa-yin-yang" },
      { name: "Upanishads", slug: "upanishads", description: "Vedantic wisdom texts", color: "yellow", icon: "fas fa-fire" },
      { name: "Talmud & Midrash", slug: "talmud", description: "Rabbinic wisdom", color: "indigo", icon: "fas fa-star-of-david" }
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
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const [lesson] = await db
      .select()
      .from(lessons)
      .where(and(gte(lessons.date, startOfDay), lte(lessons.date, endOfDay)))
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