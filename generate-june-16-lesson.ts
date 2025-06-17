import { storage } from './server/storage';
import { lessonGenerator } from './server/lesson-generator';
import { generateArtworkForLesson } from './server/artwork-generator';
import { emailService } from './server/email-service';

async function generateJune16Lesson() {
  try {
    console.log('🎯 Generating new lesson for June 16, 2025...');
    
    // Get available passages that haven't been used yet
    const allPassages = await storage.db.select().from(storage.schema.passages);
    const usedPassageIds = await storage.db.select({ passageId: storage.schema.lessons.passageId })
      .from(storage.schema.lessons);
    
    const usedIds = new Set(usedPassageIds.map(l => l.passageId));
    const availablePassages = allPassages.filter(p => !usedIds.has(p.id));
    
    console.log(`📚 Found ${availablePassages.length} unused passages`);
    
    if (availablePassages.length === 0) {
      console.log('No unused passages available');
      return;
    }
    
    // Select a random passage for today's lesson
    const selectedPassage = availablePassages[Math.floor(Math.random() * availablePassages.length)];
    console.log(`✨ Selected passage: ${selectedPassage.source} - ${selectedPassage.title}`);
    
    // Generate the lesson content
    console.log('🤖 Generating lesson content...');
    const lesson = await lessonGenerator.generateLesson(selectedPassage);
    
    // Generate artwork
    console.log('🎨 Creating artwork...');
    const artworkResult = await generateArtworkForLesson(lesson, selectedPassage);
    
    if (!artworkResult.success || !artworkResult.localPath) {
      console.log('❌ Failed to generate artwork');
      return;
    }
    
    // Save lesson to database with today's date
    const today = new Date('2025-06-16T12:00:00Z'); // June 16, 2025
    
    const [savedLesson] = await storage.db.insert(storage.schema.lessons).values({
      passageId: selectedPassage.id,
      title: lesson.title,
      story: lesson.story,
      lifeLesson: lesson.lifeLesson,
      artworkUrl: artworkResult.localPath,
      emailArtworkUrl: artworkResult.localPath,
      artworkDescription: artworkResult.description || 'Spiritual artwork',
      date: today,
      isGenerated: true
    }).returning();
    
    console.log(`✅ Lesson saved with ID: ${savedLesson.id}`);
    
    // Get lesson with passage details for email
    const lessonWithDetails = await storage.db.select()
      .from(storage.schema.lessons)
      .innerJoin(storage.schema.passages, storage.db.eq(storage.schema.lessons.passageId, storage.schema.passages.id))
      .innerJoin(storage.schema.traditions, storage.db.eq(storage.schema.passages.traditionId, storage.schema.traditions.id))
      .where(storage.db.eq(storage.schema.lessons.id, savedLesson.id))
      .limit(1);
    
    if (!lessonWithDetails.length) {
      console.log('❌ Could not retrieve lesson details');
      return;
    }
    
    const lessonData = lessonWithDetails[0];
    const emailLesson = {
      id: lessonData.lessons.id,
      title: lessonData.lessons.title,
      story: lessonData.lessons.story,
      lifeLesson: lessonData.lessons.lifeLesson,
      artworkUrl: lessonData.lessons.artworkUrl,
      emailArtworkUrl: lessonData.lessons.emailArtworkUrl,
      artworkDescription: lessonData.lessons.artworkDescription,
      date: lessonData.lessons.date,
      passageId: lessonData.lessons.passageId,
      isGenerated: lessonData.lessons.isGenerated,
      passage: {
        id: lessonData.passages.id,
        title: lessonData.passages.title,
        traditionId: lessonData.passages.traditionId,
        source: lessonData.passages.source,
        content: lessonData.passages.content,
        context: lessonData.passages.context,
        theme: lessonData.passages.theme,
        tradition: {
          id: lessonData.traditions.id,
          name: lessonData.traditions.name,
          slug: lessonData.traditions.slug,
          description: lessonData.traditions.description,
          color: lessonData.traditions.color,
          textColor: lessonData.traditions.textColor,
          backgroundColor: lessonData.traditions.backgroundColor,
          borderColor: lessonData.traditions.borderColor,
          accentColor: lessonData.traditions.accentColor,
          fontFamily: lessonData.traditions.fontFamily,
          culturalElements: lessonData.traditions.culturalElements,
          artworkStyle: lessonData.traditions.artworkStyle,
          manuscriptStyle: lessonData.traditions.manuscriptStyle
        }
      }
    };
    
    console.log(`📧 Sending lesson "${emailLesson.title}" to ary.lakhotia@gmail.com`);
    
    // Create test subscriber
    const testSubscriber = {
      id: 999,
      email: 'ary.lakhotia@gmail.com',
      phoneNumber: null,
      whatsappActive: false,
      emailActive: true,
      isActive: true,
      createdAt: new Date()
    };
    
    // Send email
    const emailSuccess = await emailService.sendDailyLesson(emailLesson, [testSubscriber]);
    
    if (emailSuccess) {
      console.log('✅ Email sent successfully!');
    } else {
      console.log('❌ Email failed to send');
    }
    
    console.log('\n🎉 June 16 lesson generation complete!');
    console.log(`📖 Title: "${lesson.title}"`);
    console.log(`📜 Source: ${selectedPassage.source}`);
    console.log(`🎨 Artwork: ${artworkResult.localPath}`);
    
  } catch (error) {
    console.error('❌ Error generating June 16 lesson:', error);
  }
}

generateJune16Lesson();