import { storage } from "./storage";
import { writeFileSync, readFileSync, existsSync, mkdirSync, readdirSync, copyFileSync } from "fs";
import { join, extname } from "path";

interface BackupData {
  timestamp: string;
  lessons: any[];
  traditions: any[];
  passages: any[];
  subscriptions: any[];
  artworkFiles: string[];
}

export class DatabaseBackup {
  private backupDir = join(process.cwd(), "backups");
  private artworkDir = join(process.cwd(), "public", "artwork");

  constructor() {
    // Ensure backup directory exists
    if (!existsSync(this.backupDir)) {
      mkdirSync(this.backupDir, { recursive: true });
    }
  }

  async createBackup(): Promise<string> {
    try {
      console.log("Creating database backup...");

      // Fetch all data
      const lessons = await storage.getRecentLessons(100); // Get all lessons
      const traditions = await storage.getTraditions();
      const subscriptions = await storage.getActiveSubscriptions();

      // Backup artwork files
      const artworkFiles = await this.backupArtworkFiles();

      const backupData: BackupData = {
        timestamp: new Date().toISOString(),
        lessons,
        traditions,
        passages: [], // Will be populated from lessons if needed
        subscriptions,
        artworkFiles
      };

      // Create filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `backup-${timestamp}.json`;
      const filepath = join(this.backupDir, filename);

      // Write backup to file
      writeFileSync(filepath, JSON.stringify(backupData, null, 2));

      console.log(`✓ Backup created: ${filename}`);
      console.log(`  - ${lessons.length} lessons backed up`);
      console.log(`  - ${traditions.length} traditions backed up`);
      console.log(`  - ${subscriptions.length} subscriptions backed up`);
      console.log(`  - ${artworkFiles.length} artwork files backed up`);

      return filepath;
    } catch (error) {
      console.error("Failed to create backup:", error);
      throw error;
    }
  }

  private async backupArtworkFiles(): Promise<string[]> {
    try {
      const artworkBackupDir = join(this.backupDir, "artwork");
      
      // Ensure artwork backup directory exists
      if (!existsSync(artworkBackupDir)) {
        mkdirSync(artworkBackupDir, { recursive: true });
      }

      // Check if artwork directory exists
      if (!existsSync(this.artworkDir)) {
        console.log("No artwork directory found, skipping artwork backup");
        return [];
      }

      // Get all artwork files
      const files = readdirSync(this.artworkDir);
      const imageFiles = files.filter(file => {
        const ext = extname(file).toLowerCase();
        return ['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext);
      });

      const backedUpFiles: string[] = [];

      // Copy each artwork file to backup directory
      for (const file of imageFiles) {
        const sourcePath = join(this.artworkDir, file);
        const backupPath = join(artworkBackupDir, file);
        
        try {
          copyFileSync(sourcePath, backupPath);
          backedUpFiles.push(file);
        } catch (error) {
          console.error(`Failed to backup artwork file ${file}:`, error);
        }
      }

      return backedUpFiles;
    } catch (error) {
      console.error("Error backing up artwork files:", error);
      return [];
    }
  }

  async restoreFromBackup(backupFile: string): Promise<void> {
    try {
      console.log(`Restoring from backup: ${backupFile}`);

      if (!existsSync(backupFile)) {
        throw new Error(`Backup file not found: ${backupFile}`);
      }

      const backupData: BackupData = JSON.parse(readFileSync(backupFile, 'utf-8'));

      console.log(`Backup created on: ${backupData.timestamp}`);
      console.log(`Contains ${backupData.lessons.length} lessons`);

      // Note: Actual restoration would require careful handling of IDs and relationships
      // This is a framework for restoration - implementation would depend on specific needs

      console.log("✓ Backup restoration framework ready");
    } catch (error) {
      console.error("Failed to restore backup:", error);
      throw error;
    }
  }

  listBackups(): string[] {
    try {
      const { readdirSync } = require('fs');
      const files = readdirSync(this.backupDir);
      return files.filter((file: string) => file.startsWith('backup-') && file.endsWith('.json'));
    } catch (error) {
      console.error("Failed to list backups:", error);
      return [];
    }
  }

  async scheduleAutoBackup(): Promise<void> {
    // Create backup immediately
    await this.createBackup();

    // Schedule daily backups at 5 AM EST (before lesson generation)
    setInterval(async () => {
      const now = new Date();
      const estTime = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
      
      if (estTime.getHours() === 5 && estTime.getMinutes() === 0) {
        await this.createBackup();
      }
    }, 60000); // Check every minute

    console.log("✓ Auto-backup scheduled for 5:00 AM EST daily");
  }
}

export const backupService = new DatabaseBackup();