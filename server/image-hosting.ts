import fs from 'fs';
import path from 'path';

// Simple image hosting solution using base64 data URLs for emails
export class ImageHostingService {
  
  // Convert local image to base64 data URL for email embedding
  static convertImageToDataUrl(imagePath: string): string | null {
    try {
      const fullPath = path.join(process.cwd(), 'public', imagePath);
      
      if (!fs.existsSync(fullPath)) {
        console.error(`Image file not found: ${fullPath}`);
        return null;
      }

      const imageBuffer = fs.readFileSync(fullPath);
      const base64Image = imageBuffer.toString('base64');
      const mimeType = this.getMimeType(imagePath);
      
      return `data:${mimeType};base64,${base64Image}`;
    } catch (error) {
      console.error('Error converting image to data URL:', error);
      return null;
    }
  }

  private static getMimeType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
      case '.png': return 'image/png';
      case '.jpg': 
      case '.jpeg': return 'image/jpeg';
      case '.gif': return 'image/gif';
      case '.webp': return 'image/webp';
      default: return 'image/png';
    }
  }

  // Get stable URL for production deployment
  static getStableImageUrl(artworkUrl: string): string {
    // If it's already a full URL, return as is
    if (artworkUrl.startsWith('http')) {
      return artworkUrl;
    }

    // For deployment, use environment-specific base URL
    const baseUrl = process.env.RENDER_EXTERNAL_URL || 
                   (process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : 'http://localhost:5000');
    
    return `${baseUrl}${artworkUrl}`;
  }
}