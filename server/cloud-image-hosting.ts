import fs from 'fs';
import path from 'path';

// Cloud image hosting using GitHub raw URLs for permanent storage
export class CloudImageHosting {
  
  // Upload image to a permanent hosting service
  // For now, we'll use a simple approach with imgbb or similar free service
  static async uploadToCloud(localImagePath: string): Promise<string | null> {
    try {
      const fullPath = path.join(process.cwd(), 'public', localImagePath);
      
      if (!fs.existsSync(fullPath)) {
        console.error(`Image file not found: ${fullPath}`);
        return null;
      }

      // Read the image file
      const imageBuffer = fs.readFileSync(fullPath);
      const base64Image = imageBuffer.toString('base64');
      
      // Upload to imgbb (free image hosting service)
      const formData = new FormData();
      formData.append('image', base64Image);
      
      const response = await fetch('https://api.imgbb.com/1/upload?key=your-api-key', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const result = await response.json();
        return result.data.url;
      }
      
      return null;
    } catch (error) {
      console.error('Error uploading to cloud:', error);
      return null;
    }
  }
  
  // Fallback method: use GitHub raw URLs for permanent hosting
  static getGitHubRawUrl(artworkUrl: string): string {
    if (artworkUrl.startsWith('http')) {
      return artworkUrl;
    }
    
    // Use GitHub raw URL pattern for permanent hosting
    const filename = path.basename(artworkUrl);
    return `https://raw.githubusercontent.com/arylakhotia/soulwisdom-assets/main/artwork/${filename}`;
  }
  
  // Simple fallback using a stable CDN
  static getPermanentUrl(artworkUrl: string): string {
    if (artworkUrl.startsWith('http')) {
      return artworkUrl;
    }
    
    // Use a stable image placeholder service that generates consistent images
    const filename = path.basename(artworkUrl);
    const seed = filename.replace(/\D/g, ''); // Extract numbers for seed
    
    // Use a placeholder service with consistent generation
    return `https://picsum.photos/seed/${seed}/512/512`;
  }
}