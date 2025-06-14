import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import fs from 'fs';

export class CloudinaryArtworkHosting {
  private initialized: boolean = false;

  constructor() {
    this.initializeCloudinary();
  }

  private initializeCloudinary() {
    try {
      // Cloudinary can work with a simple URL-based config
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'soulwisdom';
      
      cloudinary.config({
        cloud_name: cloudName,
        secure: true
      });

      this.initialized = true;
      console.log('Cloudinary hosting initialized');
    } catch (error) {
      console.error('Failed to initialize Cloudinary:', error);
    }
  }

  async uploadArtwork(localImagePath: string, fileName: string): Promise<string | null> {
    try {
      if (!this.initialized) {
        return null;
      }

      const fullPath = path.join(process.cwd(), 'public', 'artwork', path.basename(localImagePath));
      
      if (!fs.existsSync(fullPath)) {
        console.error(`Artwork file not found: ${fullPath}`);
        return null;
      }

      // Use unsigned upload for simplicity
      const result = await cloudinary.uploader.unsigned_upload(fullPath, 'soulwisdom_preset', {
        public_id: `artwork/${fileName.replace(/\.[^/.]+$/, "")}`,
        resource_type: 'image',
        format: 'jpg',
        quality: 'auto'
      });

      console.log(`Artwork uploaded to Cloudinary: ${result.secure_url}`);
      return result.secure_url;

    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      return null;
    }
  }

  getPublicUrl(publicId: string): string {
    return cloudinary.url(publicId, { 
      secure: true,
      quality: 'auto',
      format: 'jpg'
    });
  }
}

let cloudinaryHosting: CloudinaryArtworkHosting | null = null;

export function initializeCloudinaryHosting(): CloudinaryArtworkHosting {
  if (!cloudinaryHosting) {
    cloudinaryHosting = new CloudinaryArtworkHosting();
  }
  return cloudinaryHosting;
}

export function getCloudinaryHosting(): CloudinaryArtworkHosting | null {
  return cloudinaryHosting;
}