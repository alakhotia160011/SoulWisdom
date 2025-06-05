import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSubscriptionSchema } from "@shared/schema";
import { generateTodaysLesson } from "./lesson-generator";
import { generateArtworkForLesson } from "./artwork-generator";
import { getTodaysEmailTemplate, getSubscriberEmailList } from "./scheduler";
import { generateSocialCard } from "./social-cards";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all traditions with lesson counts
  app.get("/api/traditions", async (req, res) => {
    try {
      const traditions = await storage.getTraditionsWithCounts();
      res.json(traditions);
    } catch (error) {
      console.error("Error fetching traditions:", error);
      res.status(500).json({ message: "Failed to fetch traditions" });
    }
  });

  // Get today's lesson
  app.get("/api/lessons/today", async (req, res) => {
    try {
      let todaysLesson = await storage.getTodaysLesson();
      
      // If no lesson exists for today, generate one
      if (!todaysLesson) {
        const generatedLesson = await generateTodaysLesson(storage);
        if (generatedLesson) {
          todaysLesson = await storage.getLessonById(generatedLesson.id);
        }
      }

      if (!todaysLesson) {
        return res.status(404).json({ message: "No lesson available for today" });
      }

      res.json(todaysLesson);
    } catch (error) {
      console.error("Error fetching today's lesson:", error);
      res.status(500).json({ message: "Failed to fetch today's lesson" });
    }
  });

  // Get recent lessons for archive
  app.get("/api/lessons", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      const tradition = req.query.tradition as string;
      const search = req.query.search as string;

      let lessons;
      if (search) {
        lessons = await storage.searchLessons(search, limit, offset);
      } else if (tradition) {
        lessons = await storage.getLessonsByTradition(tradition, limit, offset);
      } else {
        lessons = await storage.getRecentLessons(limit, offset);
      }

      res.json(lessons);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      res.status(500).json({ message: "Failed to fetch lessons" });
    }
  });

  // Get specific lesson by ID
  app.get("/api/lessons/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const lesson = await storage.getLessonById(id);
      
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }

      res.json(lesson);
    } catch (error) {
      console.error("Error fetching lesson:", error);
      res.status(500).json({ message: "Failed to fetch lesson" });
    }
  });

  // Generate artwork for a lesson
  app.post("/api/generate-artwork", async (req, res) => {
    try {
      const { traditionId, storyTitle, storyContent } = req.body;
      
      if (!traditionId || !storyTitle || !storyContent) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const artwork = await generateArtworkForLesson(traditionId, storyTitle, storyContent);
      res.json(artwork);
    } catch (error: any) {
      console.error("Error generating artwork:", error);
      res.status(500).json({ message: "Failed to generate artwork" });
    }
  });

  // Generate social media card for a lesson
  app.post("/api/generate-social-card", async (req, res) => {
    try {
      const { lessonId, title, lifeLesson, source, tradition, artworkUrl, platform } = req.body;
      
      if (!lessonId || !title || !lifeLesson || !source || !tradition || !platform) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const card = await generateSocialCard({
        lessonId,
        title,
        lifeLesson,
        source,
        tradition,
        artworkUrl,
        platform
      });
      
      res.json(card);
    } catch (error: any) {
      console.error("Error generating social card:", error);
      res.status(500).json({ message: "Failed to generate social card" });
    }
  });

  // Get email template for today's lesson
  app.get("/api/email-template", async (req, res) => {
    try {
      const template = await getTodaysEmailTemplate();
      if (!template) {
        return res.status(404).json({ message: "No lesson available for email template" });
      }
      res.setHeader('Content-Type', 'text/html');
      res.send(template);
    } catch (error) {
      console.error("Error generating email template:", error);
      res.status(500).json({ message: "Failed to generate email template" });
    }
  });

  // Get subscriber email list for manual Gmail sending
  app.get("/api/subscribers", async (req, res) => {
    try {
      const emails = await getSubscriberEmailList();
      res.json({ 
        count: emails.length,
        emails: emails,
        instructions: "Copy these emails to your Gmail BCC field when sending the daily lesson"
      });
    } catch (error) {
      console.error("Error fetching subscriber emails:", error);
      res.status(500).json({ message: "Failed to fetch subscriber emails" });
    }
  });

  // Subscribe to email list
  app.post("/api/subscribe", async (req, res) => {
    try {
      const validatedData = insertSubscriptionSchema.parse(req.body);
      const subscription = await storage.createSubscription(validatedData);
      res.status(201).json({ message: "Successfully subscribed!", subscription });
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid email address" });
      }
      res.status(500).json({ message: "Failed to subscribe" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
