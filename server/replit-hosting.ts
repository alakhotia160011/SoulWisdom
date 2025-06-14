import fs from 'fs';
import path from 'path';

export class ReplitArtworkHosting {
  /**
   * Get the direct Replit URL for artwork files
   */
  static getArtworkUrl(artworkPath: string): string | null {
    const replId = process.env.REPL_ID;
    if (!replId) {
      console.log('No REPL_ID available');
      return null;
    }

    // Remove leading slash if present
    const cleanPath = artworkPath.startsWith('/') ? artworkPath.substring(1) : artworkPath;
    
    // Construct the direct Replit URL using the correct format
    const replitUrl = `https://${replId}.replit.app/${cleanPath}`;
    
    console.log(`Generated Replit artwork URL: ${replitUrl}`);
    return replitUrl;
  }

  /**
   * Verify that artwork file exists in public directory
   */
  static verifyArtworkExists(artworkPath: string): boolean {
    try {
      const cleanPath = artworkPath.startsWith('/') ? artworkPath.substring(1) : artworkPath;
      const fullPath = path.join(process.cwd(), 'public', cleanPath);
      
      const exists = fs.existsSync(fullPath);
      console.log(`Artwork file ${fullPath} exists: ${exists}`);
      return exists;
    } catch (error) {
      console.error('Error verifying artwork:', error);
      return false;
    }
  }

  /**
   * Get the best available artwork URL for a lesson
   */
  static getBestArtworkUrl(lesson: any): string | null {
    // Priority 1: Cloud-hosted image (Imgur)
    if (lesson.emailArtworkUrl && lesson.emailArtworkUrl.includes('imgur.com')) {
      console.log(`Using cloud artwork: ${lesson.emailArtworkUrl}`);
      return lesson.emailArtworkUrl;
    }

    // Priority 2: Replit-hosted local image
    if (lesson.artworkUrl && this.verifyArtworkExists(lesson.artworkUrl)) {
      const replitUrl = this.getArtworkUrl(lesson.artworkUrl);
      if (replitUrl) {
        console.log(`Using Replit artwork: ${replitUrl}`);
        return replitUrl;
      }
    }

    console.log('No artwork URL available');
    return null;
  }

  /**
   * Test URL accessibility
   */
  static async testUrlAccessibility(url: string): Promise<boolean> {
    try {
      const response = await fetch(url);
      const isAccessible = response.ok && response.headers.get('content-type')?.startsWith('image/');
      console.log(`URL ${url} accessible: ${isAccessible} (status: ${response.status})`);
      return isAccessible;
    } catch (error) {
      console.log(`URL ${url} not accessible: ${error.message}`);
      return false;
    }
  }
}