import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const traditions = pgTable("traditions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  color: text("color").notNull(),
  icon: text("icon").notNull(),
  originPeriod: text("origin_period"),
  originLocation: text("origin_location"),
  spiritualTradition: text("spiritual_tradition"),
  summary: text("summary"),
  famousQuotes: text("famous_quotes").array(),
  imageUrl: text("image_url"),
  manuscriptStyle: text("manuscript_style"),
});

export const passages = pgTable("passages", {
  id: serial("id").primaryKey(),
  traditionId: integer("tradition_id").notNull(),
  source: text("source").notNull(), // e.g., "Bhagavad Gita 2:47"
  title: text("title").notNull(),
  content: text("content").notNull(),
  context: text("context").notNull(),
  theme: text("theme").notNull(),
});

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  passageId: integer("passage_id").notNull(),
  title: text("title").notNull(),
  story: text("story").notNull(),
  lifeLesson: text("life_lesson").notNull(),
  artworkUrl: text("artwork_url").notNull(),
  emailArtworkUrl: text("email_artwork_url"), // OpenAI URL for emails
  artworkDescription: text("artwork_description").notNull(),
  date: timestamp("date").notNull(),
  isGenerated: boolean("is_generated").notNull().default(true),
});

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  phoneNumber: text("phone_number"), // WhatsApp phone number
  whatsappActive: boolean("whatsapp_active").notNull().default(false),
  emailActive: boolean("email_active").notNull().default(true),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const whatsappSubscribers = pgTable("whatsapp_subscribers", {
  id: serial("id").primaryKey(),
  phoneNumber: text("phone_number").notNull().unique(),
  name: text("name"),
  isActive: boolean("is_active").notNull().default(true),
  joinedVia: text("joined_via").notNull().default("website"), // "website", "direct", "referral"
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTraditionSchema = createInsertSchema(traditions).omit({
  id: true,
});

export const insertPassageSchema = createInsertSchema(passages).omit({
  id: true,
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
});

export const insertWhatsAppSubscriberSchema = createInsertSchema(whatsappSubscribers).omit({
  id: true,
  createdAt: true,
});

export type WhatsAppSubscriber = typeof whatsappSubscribers.$inferSelect;
export type InsertWhatsAppSubscriber = z.infer<typeof insertWhatsAppSubscriberSchema>;

export type InsertTradition = z.infer<typeof insertTraditionSchema>;
export type InsertPassage = z.infer<typeof insertPassageSchema>;
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;

export type Tradition = typeof traditions.$inferSelect;
export type Passage = typeof passages.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;

// Combined types for API responses
export type LessonWithDetails = Lesson & {
  passage: Passage & {
    tradition: Tradition;
  };
};

export type TraditionWithCount = Tradition & {
  lessonCount: number;
};
