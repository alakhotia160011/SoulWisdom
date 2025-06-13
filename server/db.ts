import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Allow for delayed database initialization in production environments
let pool: Pool | null = null;
let db: any = null;

function initializeDatabase() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not found. Waiting for environment variable...");
    return false;
  }

  try {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle({ client: pool, schema });
    console.log("✓ Database connection initialized successfully");
    return true;
  } catch (error) {
    console.error("Failed to initialize database:", error);
    return false;
  }
}

// Try to initialize immediately
if (process.env.DATABASE_URL) {
  initializeDatabase();
}

// Export a function to get the database connection
export function getDatabase() {
  if (!db && process.env.DATABASE_URL) {
    initializeDatabase();
  }
  
  if (!db) {
    throw new Error("Database not initialized. DATABASE_URL may not be available yet.");
  }
  
  return db;
}

// Export pool for backward compatibility
export { pool };

// Export db with lazy initialization
export const database = new Proxy({} as any, {
  get(target, prop) {
    const dbInstance = getDatabase();
    return dbInstance[prop];
  }
});

// For backward compatibility
export { database as db };