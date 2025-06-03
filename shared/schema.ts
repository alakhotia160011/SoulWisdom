import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const traditions = pgTable("traditions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  color: text("color").notNull(),
  icon: text("icon").notNull(),
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
  artworkDescription: text("artwork_description").notNull(),
  date: timestamp("date").notNull(),
  isGenerated: boolean("is_generated").defaultValue(true),
});

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  isActive: boolean("is_active").defaultValue(true),
  createdAt: timestamp("created_at").defaultValue(new Date()),
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
