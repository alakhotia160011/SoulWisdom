// Fix today's lesson with proper email artwork URL and test email
import { storage } from "./server/storage";
import { emailService } from "./server/email-service";
import { generateArtworkForLesson } from "./server/artwork-generator";

async function fixTodaysLessonArtwork() {
  try {
    console.log('Getting today\'s lesson...');
    const todaysLesson = await storage.getTodaysLesson();
    
    if (!todaysLesson) {
      console.log('No lesson found for today');
      return;
    }
    
    console.log(`Current lesson: "${todaysLesson.title}"`);
    console.log(`Current email artwork URL: ${todaysLesson.emailArtworkUrl || 'Not set'}`);
    
    if (!todaysLesson.emailArtworkUrl) {
      console.log('Generating new artwork with email URL...');
      
      // Generate new artwork that includes email URL
      const artwork = await generateArtworkForLesson(
        todaysLesson.passage.tradition.id,
        todaysLesson.title,
        todaysLesson.story
      );
      
      console.log(`Generated artwork - Website: ${artwork.url}, Email: ${artwork.emailUrl}`);
      
      // Update the lesson with the new email artwork URL
      await storage.updateLessonEmailArtwork(todaysLesson.id, artwork.emailUrl);
      
      // Get the updated lesson
      const updatedLesson = await storage.getLessonById(todaysLesson.id);
      
      if (updatedLesson) {
        console.log('Sending test email with working artwork...');
        
        const testSubscriber = { 
          id: 999, 
          email: 'ary.lakhotia@gmail.com', 
          createdAt: new Date(), 
          isActive: true 
        };
        
        const success = await emailService.sendDailyLesson(updatedLesson, [testSubscriber]);
        
        if (success) {
          console.log('✓ Test email sent with working artwork URLs');
          console.log(`Email artwork URL: ${updatedLesson.emailArtworkUrl}`);
          console.log('Check your email - the artwork should now display properly');
        } else {
          console.log('✗ Failed to send test email');
        }
      }
    } else {
      console.log('Lesson already has email artwork URL, sending test...');
      
      const testSubscriber = { 
        id: 999, 
        email: 'ary.lakhotia@gmail.com', 
        createdAt: new Date(), 
        isActive: true 
      };
      
      const success = await emailService.sendDailyLesson(todaysLesson, [testSubscriber]);
      
      if (success) {
        console.log('✓ Test email sent');
      } else {
        console.log('✗ Failed to send test email');
      }
    }
    
  } catch (error) {
    console.error('Error fixing artwork:', error);
  }
}

fixTodaysLessonArtwork();