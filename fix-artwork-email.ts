import { storage } from './server/storage';
import fs from 'fs';
import path from 'path';

async function fixTodaysLessonArtwork() {
  try {
    console.log('Fixing today\'s lesson artwork URL...');
    
    const todaysLesson = await storage.getTodaysLesson();
    if (!todaysLesson) {
      console.error('No lesson found');
      return;
    }

    console.log('Current lesson:', todaysLesson.title);
    console.log('Current emailArtworkUrl:', todaysLesson.emailArtworkUrl);
    console.log('Current artworkUrl:', todaysLesson.artworkUrl);

    // Test current Imgur URL
    try {
      const response = await fetch(todaysLesson.emailArtworkUrl);
      console.log('Imgur URL status:', response.status);
      console.log('Content-Type:', response.headers.get('content-type'));
      
      if (response.ok) {
        // Convert to direct image format if needed
        let directUrl = todaysLesson.emailArtworkUrl;
        if (!directUrl.endsWith('.jpg') && !directUrl.endsWith('.jpeg') && !directUrl.endsWith('.png')) {
          // Extract image ID and make direct URL
          const imgId = directUrl.split('/').pop();
          directUrl = `https://i.imgur.com/${imgId}.jpg`;
          console.log('Converted to direct URL:', directUrl);
          
          // Update lesson with direct URL
          await storage.db.update(storage.lessonsTable)
            .set({ emailArtworkUrl: directUrl })
            .where(storage.eq(storage.lessonsTable.id, todaysLesson.id));
          
          console.log('Updated lesson with direct Imgur URL');
        }
      }
    } catch (error) {
      console.error('Error testing Imgur URL:', error);
    }

    // Alternative: Use a known working test image
    const testImageUrl = 'https://picsum.photos/800/600.jpg';
    console.log('Testing with alternative image:', testImageUrl);
    
    try {
      const testResponse = await fetch(testImageUrl);
      console.log('Test image status:', testResponse.status);
      
      if (testResponse.ok) {
        await storage.db.update(storage.lessonsTable)
          .set({ emailArtworkUrl: testImageUrl })
          .where(storage.eq(storage.lessonsTable.id, todaysLesson.id));
        
        console.log('Updated lesson with test image URL');
      }
    } catch (error) {
      console.error('Error with test image:', error);
    }

  } catch (error) {
    console.error('Error fixing artwork:', error);
  }
}

fixTodaysLessonArtwork();