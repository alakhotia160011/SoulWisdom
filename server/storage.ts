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

export class MemStorage implements IStorage {
  private traditions: Map<number, Tradition>;
  private passages: Map<number, Passage>;
  private lessons: Map<number, Lesson>;
  private subscriptions: Map<number, Subscription>;
  private currentId: { traditions: number; passages: number; lessons: number; subscriptions: number };

  constructor() {
    this.traditions = new Map();
    this.passages = new Map();
    this.lessons = new Map();
    this.subscriptions = new Map();
    this.currentId = { traditions: 1, passages: 1, lessons: 1, subscriptions: 1 };
    this.initializeData();
  }

  private initializeData() {
    // Initialize traditions
    const traditionsData = [
      { name: "Bible", slug: "bible", description: "Psalms, Job, Gospels, Letters", color: "blue", icon: "fas fa-cross" },
      { name: "Qur'an", slug: "quran", description: "Sacred verses of guidance", color: "green", icon: "fas fa-moon" },
      { name: "Bhagavad Gita", slug: "bhagavad-gita", description: "Krishna's teachings on duty", color: "orange", icon: "fas fa-om" },
      { name: "Dhammapada", slug: "dhammapada", description: "Buddha's path to awakening", color: "purple", icon: "fas fa-lotus" },
      { name: "Tao Te Ching", slug: "tao-te-ching", description: "The way of harmony", color: "gray", icon: "fas fa-yin-yang" },
      { name: "Upanishads", slug: "upanishads", description: "Vedantic wisdom texts", color: "yellow", icon: "fas fa-fire" },
      { name: "Talmud & Midrash", slug: "talmud", description: "Rabbinic wisdom", color: "indigo", icon: "fas fa-star-of-david" }
    ];

    traditionsData.forEach(data => {
      const tradition: Tradition = { ...data, id: this.currentId.traditions++ };
      this.traditions.set(tradition.id, tradition);
    });

    // Initialize some sample passages
    const passagesData = [
      {
        traditionId: 3, // Bhagavad Gita
        source: "Bhagavad Gita 2:47",
        title: "The Right to Action",
        content: "You have the right to perform your actions, but you are not entitled to the fruits of your actions. Do not let the results be your motive, nor let your attachment be to inaction.",
        context: "Krishna's teaching to Arjuna on the battlefield about duty without attachment to results",
        theme: "Detachment and Duty"
      },
      {
        traditionId: 1, // Bible
        source: "Psalm 23:4",
        title: "Walking Through Darkness",
        content: "Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me; your rod and your staff, they comfort me.",
        context: "David's psalm of trust in divine protection during difficult times",
        theme: "Trust and Comfort"
      },
      {
        traditionId: 4, // Dhammapada
        source: "Dhammapada 1:1",
        title: "The Mind's Creation",
        content: "All that we are is the result of what we have thought. If a man speaks or acts with an evil thought, pain follows him. If a man speaks or acts with a pure thought, happiness follows him, like a shadow that never leaves him.",
        context: "Buddha's teaching on the power of thought and its consequences",
        theme: "Mindfulness and Thought"
      }
    ];

    passagesData.forEach(data => {
      const passage: Passage = { ...data, id: this.currentId.passages++ };
      this.passages.set(passage.id, passage);
    });
  }

  async getTraditions(): Promise<Tradition[]> {
    return Array.from(this.traditions.values());
  }

  async getTraditionsWithCounts(): Promise<TraditionWithCount[]> {
    const traditions = Array.from(this.traditions.values());
    return traditions.map(tradition => ({
      ...tradition,
      lessonCount: Array.from(this.lessons.values()).filter(lesson => {
        const passage = this.passages.get(lesson.passageId);
        return passage?.traditionId === tradition.id;
      }).length
    }));
  }

  async getTraditionBySlug(slug: string): Promise<Tradition | undefined> {
    return Array.from(this.traditions.values()).find(t => t.slug === slug);
  }

  async createTradition(insertTradition: InsertTradition): Promise<Tradition> {
    const tradition: Tradition = { ...insertTradition, id: this.currentId.traditions++ };
    this.traditions.set(tradition.id, tradition);
    return tradition;
  }

  async getPassagesByTradition(traditionId: number): Promise<Passage[]> {
    return Array.from(this.passages.values()).filter(p => p.traditionId === traditionId);
  }

  async getRandomPassage(excludeIds: number[] = []): Promise<Passage | undefined> {
    const availablePassages = Array.from(this.passages.values()).filter(p => !excludeIds.includes(p.id));
    if (availablePassages.length === 0) return undefined;
    return availablePassages[Math.floor(Math.random() * availablePassages.length)];
  }

  async createPassage(insertPassage: InsertPassage): Promise<Passage> {
    const passage: Passage = { ...insertPassage, id: this.currentId.passages++ };
    this.passages.set(passage.id, passage);
    return passage;
  }

  async getTodaysLesson(): Promise<LessonWithDetails | undefined> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaysLesson = Array.from(this.lessons.values()).find(lesson => {
      const lessonDate = new Date(lesson.date);
      lessonDate.setHours(0, 0, 0, 0);
      return lessonDate.getTime() === today.getTime();
    });

    if (!todaysLesson) return undefined;

    return this.buildLessonWithDetails(todaysLesson);
  }

  async getLessonById(id: number): Promise<LessonWithDetails | undefined> {
    const lesson = this.lessons.get(id);
    if (!lesson) return undefined;
    return this.buildLessonWithDetails(lesson);
  }

  async getRecentLessons(limit: number = 10, offset: number = 0): Promise<LessonWithDetails[]> {
    const allLessons = Array.from(this.lessons.values())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(offset, offset + limit);

    return Promise.all(allLessons.map(lesson => this.buildLessonWithDetails(lesson)!));
  }

  async getLessonsByTradition(traditionSlug: string, limit: number = 10, offset: number = 0): Promise<LessonWithDetails[]> {
    const tradition = await this.getTraditionBySlug(traditionSlug);
    if (!tradition) return [];

    const traditionLessons = Array.from(this.lessons.values())
      .filter(lesson => {
        const passage = this.passages.get(lesson.passageId);
        return passage?.traditionId === tradition.id;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(offset, offset + limit);

    return Promise.all(traditionLessons.map(lesson => this.buildLessonWithDetails(lesson)!));
  }

  async searchLessons(query: string, limit: number = 10, offset: number = 0): Promise<LessonWithDetails[]> {
    const searchQuery = query.toLowerCase();
    const matchingLessons = Array.from(this.lessons.values())
      .filter(lesson => {
        const passage = this.passages.get(lesson.passageId);
        const tradition = passage ? this.traditions.get(passage.traditionId) : undefined;
        
        return lesson.title.toLowerCase().includes(searchQuery) ||
               lesson.story.toLowerCase().includes(searchQuery) ||
               lesson.lifeLesson.toLowerCase().includes(searchQuery) ||
               passage?.title.toLowerCase().includes(searchQuery) ||
               passage?.content.toLowerCase().includes(searchQuery) ||
               tradition?.name.toLowerCase().includes(searchQuery);
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(offset, offset + limit);

    return Promise.all(matchingLessons.map(lesson => this.buildLessonWithDetails(lesson)!));
  }

  async createLesson(insertLesson: InsertLesson): Promise<Lesson> {
    const lesson: Lesson = { ...insertLesson, id: this.currentId.lessons++ };
    this.lessons.set(lesson.id, lesson);
    return lesson;
  }

  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const subscription: Subscription = { 
      ...insertSubscription, 
      id: this.currentId.subscriptions++,
      createdAt: new Date()
    };
    this.subscriptions.set(subscription.id, subscription);
    return subscription;
  }

  async getActiveSubscriptions(): Promise<Subscription[]> {
    return Array.from(this.subscriptions.values()).filter(s => s.isActive);
  }

  private buildLessonWithDetails(lesson: Lesson): LessonWithDetails | undefined {
    const passage = this.passages.get(lesson.passageId);
    if (!passage) return undefined;
    
    const tradition = this.traditions.get(passage.traditionId);
    if (!tradition) return undefined;

    return {
      ...lesson,
      passage: {
        ...passage,
        tradition
      }
    };
  }
}

export const storage = new MemStorage();
