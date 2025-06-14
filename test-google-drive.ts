import { initializeGoogleDriveHosting, getGoogleDriveHosting } from './server/google-drive-hosting';
import { storage } from './server/storage';

async function testGoogleDriveIntegration() {
  try {
    console.log('Testing Google Drive integration...');
    
    // Initialize Google Drive hosting
    const driveHosting = initializeGoogleDriveHosting();
    if (!driveHosting) {
      console.error('Failed to initialize Google Drive hosting');
      return;
    }

    // Initialize folder
    await driveHosting.initializeFolder();
    console.log('Google Drive folder initialized successfully');

    // Get today's lesson
    const todaysLesson = await storage.getTodaysLesson();
    if (!todaysLesson || !todaysLesson.artworkUrl) {
      console.error('No lesson or artwork found');
      return;
    }

    console.log('Found lesson:', todaysLesson.title);
    console.log('Artwork URL:', todaysLesson.artworkUrl);

    // Upload artwork to Google Drive
    const fileName = todaysLesson.artworkUrl.split('/').pop();
    if (!fileName) {
      console.error('Invalid artwork filename');
      return;
    }

    const driveUrl = await driveHosting.uploadArtwork(todaysLesson.artworkUrl, fileName);
    console.log('Artwork uploaded to Google Drive:', driveUrl);

    return driveUrl;

  } catch (error) {
    console.error('Error testing Google Drive integration:', error);
  }
}

testGoogleDriveIntegration();