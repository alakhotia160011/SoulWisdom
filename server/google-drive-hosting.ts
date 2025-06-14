import { google, drive_v3 } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import fs from 'fs';
import path from 'path';

export class GoogleDriveArtworkHosting {
  private drive: drive_v3.Drive;
  private auth: GoogleAuth;
  private folderId: string;

  constructor() {
    this.auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/drive.file'],
      credentials: this.getCredentials()
    });
    
    this.drive = google.drive({ version: 'v3', auth: this.auth });
    this.folderId = ''; // Will be set after folder creation
  }

  private getCredentials() {
    // Use service account credentials from environment
    const credentials = {
      type: 'service_account',
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL
    };

    return credentials;
  }

  async initializeFolder(): Promise<string> {
    try {
      // Check if folder already exists
      const folderName = 'SoulWisdom-Artwork';
      const response = await this.drive.files.list({
        q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder'`,
        fields: 'files(id, name)'
      });

      if (response.data.files && response.data.files.length > 0) {
        this.folderId = response.data.files[0].id!;
        console.log(`Using existing Google Drive folder: ${this.folderId}`);
      } else {
        // Create new folder
        const folderResponse = await this.drive.files.create({
          requestBody: {
            name: folderName,
            mimeType: 'application/vnd.google-apps.folder'
          },
          fields: 'id'
        });

        this.folderId = folderResponse.data.id!;
        console.log(`Created new Google Drive folder: ${this.folderId}`);

        // Make folder publicly readable
        await this.drive.permissions.create({
          fileId: this.folderId,
          requestBody: {
            role: 'reader',
            type: 'anyone'
          }
        });
      }

      return this.folderId;
    } catch (error) {
      console.error('Error initializing Google Drive folder:', error);
      throw error;
    }
  }

  async uploadArtwork(localImagePath: string, fileName: string): Promise<string> {
    try {
      if (!this.folderId) {
        await this.initializeFolder();
      }

      const fullPath = path.join(process.cwd(), 'public', 'artwork', path.basename(localImagePath));
      
      if (!fs.existsSync(fullPath)) {
        throw new Error(`Artwork file not found: ${fullPath}`);
      }

      // Check if file already exists
      const existingFiles = await this.drive.files.list({
        q: `name='${fileName}' and parents='${this.folderId}'`,
        fields: 'files(id, name)'
      });

      let fileId: string;

      if (existingFiles.data.files && existingFiles.data.files.length > 0) {
        // Update existing file
        fileId = existingFiles.data.files[0].id!;
        await this.drive.files.update({
          fileId: fileId,
          media: {
            mimeType: 'image/png',
            body: fs.createReadStream(fullPath)
          }
        });
        console.log(`Updated existing artwork in Google Drive: ${fileId}`);
      } else {
        // Upload new file
        const response = await this.drive.files.create({
          requestBody: {
            name: fileName,
            parents: [this.folderId]
          },
          media: {
            mimeType: 'image/png',
            body: fs.createReadStream(fullPath)
          },
          fields: 'id'
        });

        fileId = response.data.id!;
        console.log(`Uploaded new artwork to Google Drive: ${fileId}`);

        // Make file publicly readable
        await this.drive.permissions.create({
          fileId: fileId,
          requestBody: {
            role: 'reader',
            type: 'anyone'
          }
        });
      }

      // Return direct download URL
      return `https://drive.google.com/uc?id=${fileId}&export=download`;

    } catch (error) {
      console.error('Error uploading artwork to Google Drive:', error);
      throw error;
    }
  }

  async uploadExistingArtwork(): Promise<void> {
    try {
      const artworkDir = path.join(process.cwd(), 'public', 'artwork');
      
      if (!fs.existsSync(artworkDir)) {
        console.log('No artwork directory found');
        return;
      }

      const files = fs.readdirSync(artworkDir);
      const imageFiles = files.filter(file => 
        file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')
      );

      console.log(`Found ${imageFiles.length} artwork files to upload`);

      for (const file of imageFiles) {
        try {
          const driveUrl = await this.uploadArtwork(file, file);
          console.log(`Uploaded ${file} -> ${driveUrl}`);
        } catch (error) {
          console.error(`Failed to upload ${file}:`, error);
        }
      }

    } catch (error) {
      console.error('Error uploading existing artwork:', error);
    }
  }

  static getDriveUrlFromFileId(fileId: string): string {
    return `https://drive.google.com/uc?id=${fileId}&export=download`;
  }
}

let googleDriveHosting: GoogleDriveArtworkHosting | null = null;

export function initializeGoogleDriveHosting(): GoogleDriveArtworkHosting | null {
  try {
    if (!googleDriveHosting) {
      googleDriveHosting = new GoogleDriveArtworkHosting();
      console.log('Google Drive artwork hosting initialized');
    }
    return googleDriveHosting;
  } catch (error) {
    console.error('Failed to initialize Google Drive hosting:', error);
    return null;
  }
}

export function getGoogleDriveHosting(): GoogleDriveArtworkHosting | null {
  return googleDriveHosting;
}