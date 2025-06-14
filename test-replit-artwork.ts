import { ReplitArtworkHosting } from './server/replit-hosting';
import { storage } from './server/storage';

async function testReplitArtworkDelivery() {
  try {
    console.log('=== TESTING REPLIT ARTWORK HOSTING ===\n');
    
    // Get today's lesson
    const todaysLesson = await storage.getTodaysLesson();
    if (!todaysLesson) {
      console.error('No lesson found');
      return;
    }

    console.log('Lesson:', todaysLesson.title);
    console.log('Local artwork path:', todaysLesson.artworkUrl);
    console.log('Email artwork URL:', todaysLesson.emailArtworkUrl);
    
    // Test Replit hosting
    console.log('\n--- Testing Replit Hosting ---');
    
    // Check if file exists
    const fileExists = ReplitArtworkHosting.verifyArtworkExists(todaysLesson.artworkUrl);
    console.log('Artwork file exists:', fileExists);
    
    // Get Replit URL
    const replitUrl = ReplitArtworkHosting.getArtworkUrl(todaysLesson.artworkUrl);
    console.log('Generated Replit URL:', replitUrl);
    
    // Test URL accessibility
    if (replitUrl) {
      const isAccessible = await ReplitArtworkHosting.testUrlAccessibility(replitUrl);
      console.log('URL is accessible:', isAccessible);
    }
    
    // Get best artwork URL
    const bestUrl = ReplitArtworkHosting.getBestArtworkUrl(todaysLesson);
    console.log('Best artwork URL:', bestUrl);
    
    // Test environment variables
    console.log('\n--- Environment Check ---');
    console.log('REPL_ID:', process.env.REPL_ID);
    console.log('REPL_SLUG:', process.env.REPL_SLUG);
    
  } catch (error) {
    console.error('Error testing Replit artwork hosting:', error);
  }
}

testReplitArtworkDelivery();