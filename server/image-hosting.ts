import fs from 'fs';
import path from 'path';

export class ImageHostingService {
  /**
   * Convert local image file to data URL for embedding
   */
  static convertImageToDataUrl(imagePath: string): string | null {
    try {
      const fullPath = path.join(process.cwd(), 'public', 'artwork', path.basename(imagePath));
      
      if (!fs.existsSync(fullPath)) {
        console.error(`Image file not found: ${fullPath}`);
        return null;
      }

      const imageBuffer = fs.readFileSync(fullPath);
      const mimeType = this.getMimeType(fullPath);
      const base64Data = imageBuffer.toString('base64');
      
      return `data:${mimeType};base64,${base64Data}`;
    } catch (error) {
      console.error('Error converting image to data URL:', error);
      return null;
    }
  }

  private static getMimeType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        return 'image/jpeg';
      case '.png':
        return 'image/png';
      case '.gif':
        return 'image/gif';
      case '.webp':
        return 'image/webp';
      default:
        return 'image/jpeg';
    }
  }

  /**
   * Get stable image URL that works across different environments
   */
  static getStableImageUrl(artworkUrl: string): string {
    // If it's already a full URL, return as-is
    if (artworkUrl.startsWith('http')) {
      return artworkUrl;
    }

    // Use Replit domain if available
    if (process.env.REPL_ID) {
      return `https://${process.env.REPL_ID}.replit.app${artworkUrl}`;
    }

    // Fallback to localhost for development
    return `http://localhost:5000${artworkUrl}`;
  }
}