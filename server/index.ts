import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
// Keep-alive functionality for 24/7 operation
import http from "http";
import { dailyScheduler } from "./scheduler";
import { backupService } from "./backup";
import { initializeWhatsAppManual } from "./whatsapp-manual";
import { initializeTwilioWhatsApp } from "./whatsapp-twilio";
import { initializeGoogleDriveHosting } from "./google-drive-hosting";

// Enhanced keep-alive function for 24/7 operation
function startKeepAlive(port: number | string) {
  // Internal self-ping every 3 minutes
  setInterval(() => {
    const options = {
      hostname: 'localhost',
      port: port,
      path: '/api/traditions',
      method: 'GET',
      headers: {
        'User-Agent': 'KeepAlive-Internal/1.0'
      }
    };

    const req = http.request(options, (res) => {
      console.log(`Internal keep-alive: ${res.statusCode} at ${new Date().toISOString()}`);
    });

    req.on('error', (err) => {
      console.error('Internal keep-alive failed:', err.message);
    });

    req.setTimeout(3000, () => {
      req.destroy();
    });

    req.end();
  }, 3 * 60 * 1000); // Every 3 minutes

  // External health check every 10 minutes
  setInterval(() => {
    const replitUrl = process.env.REPLIT_DOMAINS?.split(',')[0];
    if (replitUrl) {
      const options = {
        hostname: replitUrl,
        port: 443,
        path: '/api/traditions',
        method: 'GET',
        headers: {
          'User-Agent': 'KeepAlive-External/1.0'
        }
      };

      const req = http.request(options, (res) => {
        console.log(`External health check: ${res.statusCode} at ${new Date().toISOString()}`);
      });

      req.on('error', (err) => {
        console.error('External health check failed:', err.message);
      });

      req.setTimeout(10000, () => {
        req.destroy();
      });

      req.end();
    }
  }, 10 * 60 * 1000); // Every 10 minutes

  console.log('Enhanced keep-alive system started for Always On deployment');
}

// Process monitoring and crash prevention
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  console.error('Stack:', error.stack);
  // Don't exit - log and continue
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit - log and continue
});

// Memory usage monitoring
setInterval(() => {
  const usage = process.memoryUsage();
  const mb = (bytes: number) => Math.round(bytes / 1024 / 1024);
  console.log(`Memory: RSS ${mb(usage.rss)}MB, Heap ${mb(usage.heapUsed)}/${mb(usage.heapTotal)}MB`);
  
  // Force garbage collection if heap usage is high
  if (usage.heapUsed > 200 * 1024 * 1024) { // 200MB threshold
    if (global.gc) {
      global.gc();
      console.log('Forced garbage collection due to high memory usage');
    }
  }
}, 15 * 60 * 1000); // Every 15 minutes

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

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

    // Initialize WhatsApp services
    const whatsappAdminNumber = process.env.WHATSAPP_ADMIN_NUMBER;
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
    
    if (whatsappAdminNumber && openaiApiKey) {
      console.log("Initializing WhatsApp manual service...");
      initializeWhatsAppManual(whatsappAdminNumber, openaiApiKey);
      
      // Initialize Twilio WhatsApp if credentials are available and Account SID format is correct
      if (twilioAccountSid && twilioAuthToken && twilioPhoneNumber && twilioAccountSid.startsWith('AC')) {
        console.log("Initializing Twilio WhatsApp service...");
        // Use Twilio WhatsApp Sandbox number for trial accounts
        const twilioFromNumber = `whatsapp:+14155238886`; // Your Twilio WhatsApp Sandbox number
        const twilioToNumber = `whatsapp:${whatsappAdminNumber}`;
        initializeTwilioWhatsApp(twilioAccountSid, twilioAuthToken, twilioFromNumber, twilioToNumber, openaiApiKey);
      } else {
        console.log("Twilio WhatsApp not initialized - Account SID must start with 'AC'");
      }
    } else {
      console.log("WhatsApp services not initialized - missing credentials");
    }

    // Note: Google Drive integration pending - using existing Imgur URLs for now
    console.log("Artwork hosting: Using existing cloud URLs for WhatsApp delivery");

    // Start keep-alive service for 24/7 operation
    startKeepAlive(port);
    log("Application ready for 24/7 deployment on Replit");
  });
})();
