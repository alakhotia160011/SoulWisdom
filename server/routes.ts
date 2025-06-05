import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSubscriptionSchema } from "@shared/schema";
import { generateTodaysLesson } from "../client/src/lib/lesson-generator";
import { generateArtworkForLesson } from "./artwork-generator";

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
