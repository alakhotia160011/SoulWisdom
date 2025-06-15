import { storage } from "./server/storage";
import { generateArtworkForLesson } from "./server/artwork-generator";
import { db } from "./server/db";
import { passages, traditions } from "./shared/schema";
import { eq } from "drizzle-orm";

async function createTalmudLesson() {
  try {
    // Get the Talmud passage directly from database
    const [passage] = await db.select().from(passages).where(eq(passages.id, 32));
    if (!passage) {
      console.error("Passage not found");
      return;
    }
    
    // Get tradition info
    const [tradition] = await db.select().from(traditions).where(eq(traditions.id, passage.tradition_id));

    console.log("Creating lesson for:", passage.source, "-", passage.title);

    // Create passage object with tradition for artwork generation
    const passageWithTradition = {
      ...passage,
      tradition: tradition
    };

    // Generate artwork first
    const artworkResult = await generateArtworkForLesson(passageWithTradition);
    
    // Create detailed story content
    const story = `In ${passage.source}, the great sage Hillel delivers one of the most profound ethical teachings in Jewish wisdom: "${passage.content}"

This timeless guidance emerges from the understanding that true leadership is not about titles or positions, but about moral courage in the face of indifference. When Hillel speaks of "being human," he calls us to embody the highest qualities of compassion, justice, and dignity—especially when others around us have abandoned these values.

The teaching recognizes a harsh reality: there are times and places where basic human decency seems absent, where cruelty flourishes, and where people turn away from suffering. In such moments, the natural response might be to conform, to lower our standards, or to simply survive. But Hillel challenges us to do the opposite—to rise up and become more human, not less.

To "be human" in this context means to act with conscience when others act without it, to show mercy when others show none, to speak truth when others remain silent, and to extend help when others withhold it. It means carrying the light of human dignity into dark spaces where it has been extinguished.

This teaching has echoed through history in the words of moral leaders who understood that individual conscience can transform entire communities. When we choose to "be human" in inhuman circumstances, we not only preserve our own integrity but also plant seeds of hope that can grow into lasting change.`;

    const lifeLesson = "When faced with moral darkness around you, become a beacon of human dignity. Your individual choice to act with compassion and justice can illuminate the path for others and transform the very environment that seemed hopeless.";

    // Create the lesson
    const lessonData = {
      passageId: passage.id,
      title: "Being Human Where None Are",
      story: story,
      lifeLesson: lifeLesson,
      artworkUrl: `/artwork/lesson-${passage.tradition_id}-${Date.now()}.png`,
      emailArtworkUrl: artworkResult.emailUrl,
      artworkDescription: artworkResult.description,
      date: new Date().toISOString(),
      isGenerated: true
    };

    const lesson = await storage.createLesson(lessonData);
    console.log("✓ Created new Talmud lesson:", lesson.title);
    console.log("Lesson ID:", lesson.id);
    
    return lesson;
  } catch (error) {
    console.error("Error creating Talmud lesson:", error);
  }
}

createTalmudLesson();