import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import path from "path";
import { storage } from "./storage";
import { insertSubscriptionSchema } from "@shared/schema";
import { generateTodaysLesson, generateDemoLessons } from "./lesson-generator";
import { generateArtworkForLesson } from "./artwork-generator";
import { getTodaysEmailTemplate, getSubscriberEmailList, dailyScheduler } from "./scheduler";
import { generateSocialCard } from "./social-cards";
import { emailService } from "./email-service";
import { backupService } from "./backup";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve static artwork files
  app.use('/artwork', express.static(path.join(process.cwd(), 'public', 'artwork')));

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

  // Get individual tradition by slug
  app.get("/api/traditions/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const tradition = await storage.getTraditionBySlug(slug);
      
      if (!tradition) {
        return res.status(404).json({ message: "Tradition not found" });
      }
      
      res.json(tradition);
    } catch (error) {
      console.error("Error fetching tradition:", error);
      res.status(500).json({ message: "Failed to fetch tradition" });
    }
  });

  // Get today's lesson
  app.get("/api/lessons/today", async (req, res) => {
    try {
      const todaysLesson = await storage.getTodaysLesson();

      if (!todaysLesson) {
        return res.status(404).json({ message: "No lesson available for today" });
      }

      res.json(todaysLesson);
    } catch (error) {
      console.error("Error fetching today's lesson:", error);
      res.status(500).json({ message: "Failed to fetch today's lesson" });
    }
  });

  // Manual lesson generation (admin only)
  app.post("/api/lessons/generate", async (req, res) => {
    try {
      console.log("Manual lesson generation requested");
      const newLesson = await generateTodaysLesson(storage);
      
      if (!newLesson) {
        return res.status(500).json({ message: "Failed to generate lesson" });
      }

      res.json(newLesson);
    } catch (error) {
      console.error("Error generating lesson:", error);
      res.status(500).json({ message: "Failed to generate lesson" });
    }
  });

  // Generate lessons for all traditions (demo purposes)
  app.post("/api/lessons/generate-demo", async (req, res) => {
    try {
      console.log("Generating demo lessons for all traditions");
      const lessons = await generateDemoLessons(storage);
      res.json({ 
        message: `Generated ${lessons.length} demo lessons`,
        lessons: lessons.map((l: any) => ({ id: l.id, title: l.title, tradition: l.passage.tradition.name }))
      });
    } catch (error) {
      console.error("Error generating demo lessons:", error);
      res.status(500).json({ message: "Failed to generate demo lessons" });
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
      
      // Send welcome email with today's lesson
      try {
        const todaysLesson = await storage.getTodaysLesson();
        const welcomeEmailSent = await emailService.sendWelcomeEmail(subscription.email, todaysLesson);
        
        if (welcomeEmailSent) {
          console.log(`✓ Welcome email sent to ${subscription.email}`);
        } else {
          console.log(`⚠ Subscription successful but welcome email failed for ${subscription.email}`);
        }
      } catch (emailError) {
        console.error("Error sending welcome email:", emailError);
        // Don't fail the subscription if welcome email fails
      }

      // Send admin notification about new subscriber
      try {
        const adminNotificationSent = await emailService.sendNewSubscriberNotification(subscription.email);
        
        if (adminNotificationSent) {
          console.log(`✓ Admin notification sent for new subscriber: ${subscription.email}`);
        } else {
          console.log(`⚠ Admin notification failed for new subscriber: ${subscription.email}`);
        }
      } catch (adminEmailError) {
        console.error("Error sending admin notification:", adminEmailError);
        // Don't fail the subscription if admin notification fails
      }
      
      res.status(201).json({ 
        message: "Successfully subscribed! Welcome email sent.", 
        subscription,
        welcomeEmailSent: true
      });
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid email address" });
      }
      res.status(500).json({ message: "Failed to subscribe" });
    }
  });

  // Test email system
  app.post("/api/email/test", async (req, res) => {
    try {
      const emailSent = await emailService.sendTestEmail();
      
      if (emailSent) {
        res.json({ message: "Test email sent successfully!" });
      } else {
        res.status(500).json({ message: "Failed to send test email" });
      }
    } catch (error) {
      console.error("Error sending test email:", error);
      res.status(500).json({ message: "Failed to send test email" });
    }
  });

  // Send welcome email manually
  app.post("/api/email/welcome", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email address is required" });
      }

      const todaysLesson = await storage.getTodaysLesson();
      const emailSent = await emailService.sendWelcomeEmail(email, todaysLesson);
      
      if (emailSent) {
        res.json({ 
          message: "Welcome email sent successfully!",
          recipient: email,
          lessonIncluded: !!todaysLesson
        });
      } else {
        res.status(500).json({ message: "Failed to send welcome email" });
      }
    } catch (error) {
      console.error("Error sending welcome email:", error);
      res.status(500).json({ message: "Failed to send welcome email" });
    }
  });

  // Send today's lesson email manually to all subscribers
  app.post("/api/email/send", async (req, res) => {
    try {
      const todaysLesson = await storage.getTodaysLesson();
      if (!todaysLesson) {
        return res.status(404).json({ message: "No lesson available to send" });
      }

      const subscribers = await storage.getActiveSubscriptions();
      if (subscribers.length === 0) {
        return res.status(400).json({ message: "No subscribers to send emails to" });
      }

      const emailSent = await emailService.sendDailyLesson(todaysLesson, subscribers);
      
      if (emailSent) {
        res.json({ 
          message: `Daily lesson email sent successfully to ${subscribers.length} subscribers`,
          subscriberCount: subscribers.length,
          lessonTitle: todaysLesson.title
        });
      } else {
        res.status(500).json({ message: "Failed to send daily lesson email" });
      }
    } catch (error) {
      console.error("Error sending daily lesson email:", error);
      res.status(500).json({ message: "Failed to send daily lesson email" });
    }
  });

  // Send test lesson email to admin only
  app.post("/api/email/send-test", async (req, res) => {
    try {
      const todaysLesson = await storage.getTodaysLesson();
      if (!todaysLesson) {
        return res.status(404).json({ message: "No lesson available to send" });
      }

      // Create a test subscriber for admin email only
      const testSubscriber = { email: "ary.lakhotia@gmail.com", id: 999, isActive: true, createdAt: new Date() };
      const emailSent = await emailService.sendDailyLesson(todaysLesson, [testSubscriber]);
      
      if (emailSent) {
        res.json({ 
          message: "Test lesson email sent successfully to ary.lakhotia@gmail.com",
          lessonTitle: todaysLesson.title
        });
      } else {
        res.status(500).json({ message: "Failed to send test lesson email" });
      }
    } catch (error) {
      console.error("Error sending test lesson email:", error);
      res.status(500).json({ message: "Failed to send test lesson email" });
    }
  });

  // Backup endpoints
  app.post("/api/backup/create", async (req, res) => {
    try {
      const backupPath = await backupService.createBackup();
      res.json({ 
        message: "Backup created successfully",
        backupPath: backupPath.split('/').pop() // Return just filename for security
      });
    } catch (error) {
      console.error("Error creating backup:", error);
      res.status(500).json({ message: "Failed to create backup" });
    }
  });

  // Schedule test email
  app.post("/api/schedule-test-email", async (req, res) => {
    try {
      const { hour, minute, email } = req.body;
      
      if (!hour || !minute || !email) {
        return res.status(400).json({ message: "Missing required fields: hour, minute, email" });
      }

      dailyScheduler.scheduleTestEmail(hour, minute, email);
      
      res.json({ 
        message: `Test email scheduled for ${hour}:${minute.toString().padStart(2, '0')} EST to ${email}`,
        scheduledTime: `${hour}:${minute.toString().padStart(2, '0')} EST`,
        targetEmail: email
      });
    } catch (error) {
      console.error("Error scheduling test email:", error);
      res.status(500).json({ message: "Failed to schedule test email" });
    }
  });

  // Send immediate test email
  app.post("/api/send-test-email-now", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email address required" });
      }

      // Get today's lesson
      const todaysLesson = await storage.getTodaysLesson();
      if (!todaysLesson) {
        return res.status(404).json({ message: "No lesson available" });
      }

      // Send the lesson email immediately
      const emailSent = await emailService.sendDailyLesson(todaysLesson, [{ 
        id: 999, 
        email: email, 
        isActive: true, 
        createdAt: new Date() 
      }]);

      if (emailSent) {
        res.json({ 
          message: `Test email sent immediately to ${email}`,
          lesson: todaysLesson.title,
          targetEmail: email
        });
      } else {
        res.status(500).json({ message: "Failed to send test email" });
      }
    } catch (error) {
      console.error("Error sending immediate test email:", error);
      res.status(500).json({ message: "Failed to send test email" });
    }
  });

  app.get("/api/backup/list", async (req, res) => {
    try {
      const backups = backupService.listBackups();
      res.json({ backups });
    } catch (error) {
      console.error("Error listing backups:", error);
      res.status(500).json({ message: "Failed to list backups" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
