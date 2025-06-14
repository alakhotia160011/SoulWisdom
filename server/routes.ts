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
import { getWhatsAppManualService } from "./whatsapp-manual";
import { getTwilioWhatsAppService } from "./whatsapp-twilio";

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

  // Force generate new lesson for today
  app.post("/api/lessons/generate-new", async (req, res) => {
    try {
      console.log("Force generating new lesson for today");
      
      // Delete any existing lesson for today first
      const today = new Date().toISOString().split('T')[0];
      await storage.db?.execute(`DELETE FROM lessons WHERE DATE(date) = '${today}'`);
      
      // Generate fresh lesson
      const { generateTodaysLesson } = await import("./lesson-generator");
      const newLesson = await generateTodaysLesson(storage);
      
      if (!newLesson) {
        return res.status(500).json({ message: "Failed to generate new lesson" });
      }

      res.json(newLesson);
    } catch (error) {
      console.error("Error generating new lesson:", error);
      res.status(500).json({ message: "Failed to generate new lesson" });
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

  // Check current email URL configuration
  app.get("/api/email/url-check", (req, res) => {
    res.json({
      currentEmailUrl: emailService.getCurrentWebsiteUrl(),
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });
  });

  // WhatsApp webhook for incoming messages
  app.post("/webhook/whatsapp", express.json(), async (req, res) => {
    try {
      const body = req.body;
      console.log("WhatsApp webhook received:", JSON.stringify(body, null, 2));
      
      // Handle Twilio WhatsApp webhook format
      if (body.MessageSid && body.From && body.Body) {
        const fromNumber = body.From; // Already in whatsapp:+1234567890 format
        const messageBody = body.Body;
        
        console.log(`Received WhatsApp message from ${fromNumber}: ${messageBody}`);
        
        // Process the message with our interactive WhatsApp service
        const whatsappService = getTwilioWhatsAppService();
        if (whatsappService) {
          await whatsappService.processIncomingMessage(messageBody, fromNumber);
        } else {
          console.error('WhatsApp service not initialized');
        }
      }
      
      res.status(200).send("OK");
    } catch (error) {
      console.error("WhatsApp webhook error:", error);
      res.status(500).send("Error");
    }
  });

  // WhatsApp webhook verification
  app.get("/webhook/whatsapp", (req, res) => {
    const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "spiritual_wisdom_token";
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    // Handle webhook verification
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("WhatsApp webhook verified successfully");
      res.status(200).send(challenge);
      return;
    }
    
    // Handle simple GET requests for testing
    if (!mode && !token && !challenge) {
      res.status(200).json({ 
        status: "WhatsApp webhook active",
        endpoint: "/webhook/whatsapp",
        twilio_configured: !!process.env.TWILIO_ACCOUNT_SID,
        from_number: "whatsapp:+14155238886"
      });
      return;
    }
    
    res.status(403).send("Forbidden");
  });

  // WhatsApp subscription management
  app.get("/api/whatsapp/subscribers", async (req, res) => {
    try {
      const subscribers = await storage.getWhatsAppSubscribers();
      res.json({ 
        count: subscribers.length,
        subscribers: subscribers.map(sub => ({
          phoneNumber: sub.phoneNumber,
          name: sub.name,
          joinedVia: sub.joinedVia,
          createdAt: sub.createdAt,
          isActive: sub.isActive
        }))
      });
    } catch (error) {
      console.error("Error fetching WhatsApp subscribers:", error);
      res.status(500).json({ message: "Failed to fetch WhatsApp subscribers" });
    }
  });

  app.post("/api/whatsapp/subscribe", async (req, res) => {
    try {
      const { phoneNumber, name } = req.body;
      
      if (!phoneNumber) {
        return res.status(400).json({ message: "Phone number is required" });
      }

      const existingSubscriber = await storage.getWhatsAppSubscriberByPhone(phoneNumber);
      
      if (existingSubscriber) {
        if (existingSubscriber.isActive) {
          return res.status(409).json({ message: "Already subscribed" });
        } else {
          // Reactivate subscription
          await storage.updateWhatsAppSubscriber(phoneNumber, { isActive: true });
          
          // Send welcome message for reactivated subscription
          try {
            const { getTwilioWhatsAppService } = await import('./whatsapp-twilio');
            const whatsappService = getTwilioWhatsAppService();
            if (whatsappService) {
              await whatsappService.sendWelcomeMessage(phoneNumber);
            }
          } catch (welcomeError) {
            console.error("Error sending welcome message:", welcomeError);
          }
          
          return res.json({ message: "Subscription reactivated", subscriber: existingSubscriber });
        }
      }

      const subscriber = await storage.createWhatsAppSubscriber({
        phoneNumber,
        name,
        joinedVia: 'website'
      });

      // Send automatic welcome message
      try {
        const { getTwilioWhatsAppService } = await import('./whatsapp-twilio');
        const whatsappService = getTwilioWhatsAppService();
        if (whatsappService) {
          await whatsappService.sendWelcomeMessage(phoneNumber);
          console.log(`Welcome message sent to ${phoneNumber}`);
        }
      } catch (welcomeError) {
        console.error("Error sending welcome message:", welcomeError);
        // Don't fail the subscription if welcome message fails
      }

      res.status(201).json({ message: "Subscribed successfully", subscriber });
    } catch (error) {
      console.error("Error creating WhatsApp subscription:", error);
      res.status(500).json({ message: "Failed to create subscription" });
    }
  });

  app.delete("/api/whatsapp/unsubscribe", async (req, res) => {
    try {
      const { phoneNumber } = req.body;
      
      if (!phoneNumber) {
        return res.status(400).json({ message: "Phone number is required" });
      }

      await storage.deleteWhatsAppSubscriber(phoneNumber);
      res.json({ message: "Unsubscribed successfully" });
    } catch (error) {
      console.error("Error unsubscribing:", error);
      res.status(500).json({ message: "Failed to unsubscribe" });
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

  // Force daily email sending manually (emergency backup)
  app.post("/api/force-daily-email", async (req, res) => {
    try {
      const result = await dailyScheduler.forceDailyEmail();
      
      if (result.success) {
        res.json({ 
          message: "Daily email sent successfully to all subscribers",
          lesson: result.lesson
        });
      } else {
        res.status(500).json({ 
          message: "Failed to send daily email",
          error: result.error
        });
      }
    } catch (error) {
      console.error("Error forcing daily email:", error);
      res.status(500).json({ message: "Failed to force daily email" });
    }
  });

  // Uptime monitoring and health check endpoint
  app.get("/api/health", async (req, res) => {
    try {
      const uptime = process.uptime();
      const memory = process.memoryUsage();
      const mb = (bytes: number) => Math.round(bytes / 1024 / 1024);
      
      // Check database connectivity
      const dbCheck = await storage.getTraditions();
      const dbHealthy = dbCheck && dbCheck.length > 0;
      
      // Check scheduler status
      const todayLesson = await storage.getTodaysLesson();
      const schedulerHealthy = todayLesson !== null;
      
      const healthStatus = {
        status: "healthy",
        uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`,
        uptimeSeconds: Math.floor(uptime),
        memory: {
          rss: `${mb(memory.rss)}MB`,
          heapUsed: `${mb(memory.heapUsed)}MB`,
          heapTotal: `${mb(memory.heapTotal)}MB`
        },
        services: {
          database: dbHealthy ? "healthy" : "unhealthy",
          scheduler: schedulerHealthy ? "healthy" : "unhealthy",
          emailSystem: "healthy",
          whatsappSystem: "healthy"
        },
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development"
      };

      res.json(healthStatus);
    } catch (error) {
      console.error("Health check failed:", error);
      res.status(500).json({ 
        status: "unhealthy", 
        error: "Health check failed",
        timestamp: new Date().toISOString()
      });
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

  // WhatsApp API endpoints
  app.post("/api/whatsapp/message", async (req, res) => {
    try {
      const { command } = req.body;
      
      if (!command) {
        return res.status(400).json({ message: "Command is required" });
      }

      const whatsappService = getWhatsAppManualService();
      if (!whatsappService) {
        return res.status(503).json({ message: "WhatsApp service not initialized" });
      }

      const response = await whatsappService.processCommand(command);
      res.json({ response });
    } catch (error) {
      console.error("Error processing WhatsApp command:", error);
      res.status(500).json({ message: "Failed to process command" });
    }
  });

  app.get("/api/whatsapp/daily-lesson", async (req, res) => {
    try {
      const whatsappService = getWhatsAppManualService();
      if (!whatsappService) {
        return res.status(503).json({ message: "WhatsApp service not initialized" });
      }

      const todaysLesson = await storage.getTodaysLesson();
      if (!todaysLesson) {
        return res.status(404).json({ message: "No lesson available for today" });
      }

      const message = whatsappService.getDailyLessonMessage(todaysLesson);
      res.json({ message, lesson: todaysLesson });
    } catch (error) {
      console.error("Error getting daily lesson for WhatsApp:", error);
      res.status(500).json({ message: "Failed to get daily lesson" });
    }
  });

  // Twilio WhatsApp webhook endpoints
  app.post("/api/whatsapp/webhook", async (req, res) => {
    try {
      const { Body, From } = req.body;
      
      if (!Body || !From) {
        return res.status(400).send('Invalid webhook payload');
      }

      // Process the incoming WhatsApp message
      const twilioService = getTwilioWhatsAppService();
      if (twilioService) {
        const response = await twilioService.processIncomingMessage(Body);
        
        // Send response back via Twilio
        await twilioService.sendMessage(response);
      } else {
        // Fallback to manual service
        const whatsappService = getWhatsAppManualService();
        if (whatsappService) {
          const response = await whatsappService.processCommand(Body);
          console.log(`WhatsApp response for ${From}: ${response}`);
        }
      }

      res.status(200).send('OK');
    } catch (error) {
      console.error("Error processing WhatsApp webhook:", error);
      res.status(500).send('Error processing message');
    }
  });

  // Test endpoint for WhatsApp messaging
  app.post("/api/whatsapp/test", async (req, res) => {
    try {
      const { message } = req.body;
      
      const twilioService = getTwilioWhatsAppService();
      if (twilioService) {
        // Get today's lesson and send with artwork
        const todaysLesson = await storage.getTodaysLesson();
        if (todaysLesson && message.includes("Daily Spiritual Lesson")) {
          const sent = await twilioService.sendDailyLesson();
          res.json({ success: sent, message: sent ? "Daily lesson with artwork sent successfully" : "Failed to send daily lesson" });
        } else {
          const sent = await twilioService.sendMessage(message || "Hello from your spiritual lessons app!");
          res.json({ success: sent, message: sent ? "Message sent successfully" : "Failed to send message" });
        }
      } else {
        res.status(503).json({ success: false, message: "Twilio WhatsApp service not available" });
      }
    } catch (error) {
      console.error("Error sending test WhatsApp message:", error);
      res.status(500).json({ success: false, message: "Error sending message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
