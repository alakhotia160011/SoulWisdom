import { storage } from './server/storage';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

async function sendFixedArtworkEmail() {
  try {
    console.log("Sending corrected email with embedded artwork...");

    const lesson = await storage.getTodaysLesson();
    if (!lesson) {
      console.error("No lesson found");
      return;
    }

    const subscribers = await storage.getActiveSubscriptions();
    console.log(`Sending to ${subscribers.length} subscribers`);

    // Read and embed artwork as base64
    const artworkPath = path.join(process.cwd(), 'public', lesson.artworkUrl);
    let artworkDataUri = '';
    
    if (fs.existsSync(artworkPath)) {
      const imageBuffer = fs.readFileSync(artworkPath);
      const base64Image = imageBuffer.toString('base64');
      artworkDataUri = `data:image/png;base64,${base64Image}`;
      console.log("✓ Artwork embedded as base64");
    } else {
      console.log("Artwork file not found, using fallback");
      artworkDataUri = 'https://via.placeholder.com/400x300/8b7355/ffffff?text=Talmud+Lesson';
    }

    const today = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const emailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily Spiritual Lesson - ${today}</title>
    <style>
        body { font-family: 'Georgia', serif; margin: 0; padding: 20px; background-color: #f8f6f0; color: #333; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; border-bottom: 2px solid #8b7355; padding-bottom: 20px; margin-bottom: 30px; }
        .tradition-badge { background-color: #8b7355; color: white; padding: 5px 15px; border-radius: 20px; font-size: 14px; display: inline-block; margin-bottom: 10px; }
        .lesson-title { color: #8b7355; margin: 10px 0; font-size: 28px; }
        .source { color: #666; font-style: italic; margin: 10px 0; }
        .artwork { text-align: center; margin: 30px 0; }
        .artwork img { max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
        .story { margin: 30px 0; }
        .life-lesson { background-color: #f9f7f1; padding: 20px; border-left: 4px solid #8b7355; margin: 30px 0; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="tradition-badge">${lesson.passage.tradition.name}</div>
            <h1 class="lesson-title">${lesson.title}</h1>
            <p class="source">${lesson.passage.source}</p>
            <p style="color: #666; font-size: 16px;">${today}</p>
        </div>

        <div class="artwork">
            <img src="${artworkDataUri}" alt="${lesson.artworkDescription}" />
            <p style="font-style: italic; color: #666; font-size: 14px; margin-top: 10px;">
                ${lesson.artworkDescription}
            </p>
        </div>

        <div class="story">
            <h3 style="color: #8b7355; margin-top: 0;">Today's Story</h3>
            <p>${lesson.story.replace(/\n/g, '</p><p>')}</p>
        </div>

        <div class="life-lesson">
            <h3 style="color: #8b7355; margin-top: 0;">Life Lesson</h3>
            <p><strong>${lesson.lifeLesson}</strong></p>
        </div>

        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
            <p>Daily Spiritual Lessons - Wisdom from Sacred Traditions</p>
            <p>To unsubscribe, reply with "unsubscribe" in the subject line.</p>
        </div>
    </div>
</body>
</html>`;

    const transporter = nodemailer.createTransporter({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "ary.lakhotia@gmail.com",
        pass: 'mfqmmhuegicitzos'
      }
    });

    const subscriberEmails = subscribers.map(sub => sub.email);

    const mailOptions = {
      from: {
        name: 'Daily Spiritual Lessons',
        address: "ary.lakhotia@gmail.com"
      },
      to: "ary.lakhotia@gmail.com",
      bcc: subscriberEmails,
      subject: `Daily Spiritual Lesson - ${lesson.title}`,
      html: emailHtml,
      text: `${lesson.title}\n${lesson.passage.source}\n\n${lesson.story}\n\nLife Lesson: ${lesson.lifeLesson}`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✓ Corrected email sent to ${subscribers.length} subscribers`);
    console.log(`Message ID: ${info.messageId}`);
    console.log("Email includes properly embedded artwork");

  } catch (error) {
    console.error("Error sending corrected email:", error);
  }
}

sendFixedArtworkEmail();