import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
// Keep-alive functionality will be handled by Replit deployment system
import { dailyScheduler } from "./scheduler";
import { backupService } from "./backup";
import { initializeWhatsAppManual } from "./whatsapp-manual";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

async function waitForDatabase(maxRetries = 30, retryDelay = 2000) {
  for (let i = 0; i < maxRetries; i++) {
    if (process.env.DATABASE_URL) {
      console.log(`✓ DATABASE_URL found after ${i} attempts`);
      return true;
    }
    console.log(`Waiting for DATABASE_URL... attempt ${i + 1}/${maxRetries}`);
    await new Promise(resolve => setTimeout(resolve, retryDelay));
  }
  console.error("DATABASE_URL not available after maximum retries");
  return false;
}

async function waitForOpenAI(maxRetries = 15, retryDelay = 2000) {
  for (let i = 0; i < maxRetries; i++) {
    if (process.env.OPENAI_API_KEY) {
      console.log(`✓ OPENAI_API_KEY found after ${i} attempts`);
      return true;
    }
    console.log(`Waiting for OPENAI_API_KEY... attempt ${i + 1}/${maxRetries}`);
    await new Promise(resolve => setTimeout(resolve, retryDelay));
  }
  console.warn("OPENAI_API_KEY not available after maximum retries - artwork generation will be disabled");
  return false;
}

(async () => {
  // Wait for environment variables in production environments
  if (process.env.NODE_ENV === "production") {
    console.log("Production environment detected, waiting for environment variables...");
    await waitForDatabase();
    await waitForOpenAI();
  }

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Use PORT from environment or default to 5000 for development
  const port = process.env.PORT || 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, async () => {
    log(`serving on port ${port}`);
    
    // Start daily lesson scheduler
    dailyScheduler.start();
    
    // Initialize backup service and create initial backup
    try {
      await backupService.scheduleAutoBackup();
    } catch (error) {
      console.error("Failed to initialize backup service:", error);
    }

    // Initialize WhatsApp manual service if admin number is provided
    const whatsappAdminNumber = process.env.WHATSAPP_ADMIN_NUMBER;
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (whatsappAdminNumber && openaiApiKey) {
      console.log("Initializing WhatsApp manual service...");
      initializeWhatsAppManual(whatsappAdminNumber, openaiApiKey);
    } else {
      console.log("WhatsApp service not initialized - WHATSAPP_ADMIN_NUMBER or OPENAI_API_KEY not provided");
    }

    // 24/7 operation is handled by Replit deployment system
    log("Application ready for 24/7 deployment on Replit");
  });
})();
