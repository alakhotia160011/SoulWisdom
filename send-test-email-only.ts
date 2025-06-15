import { storage } from './server/storage';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

async function sendTestEmailOnly() {
  try {
    console.log("Sending test email to ary.lakhotia@gmail.com only...");

    const lesson = await storage.getTodaysLesson();
    if (!lesson) {
      console.error("No lesson found");
      return;
    }

    console.log("Lesson title:", lesson.title);
    console.log("Artwork URL:", lesson.artworkUrl);

    // Check if artwork file exists
    const artworkPath = path.join(process.cwd(), 'public', lesson.artworkUrl);
    console.log("Looking for artwork at:", artworkPath);
    console.log("File exists:", fs.existsSync(artworkPath));

    let artworkSrc = '';
    if (fs.existsSync(artworkPath)) {
      // Get file stats
      const stats = fs.statSync(artworkPath);
      console.log("File size:", stats.size, "bytes");
      
      // Read and convert to base64
      const imageBuffer = fs.readFileSync(artworkPath);
      const base64Image = imageBuffer.toString('base64');
      artworkSrc = `data:image/png;base64,${base64Image}`;
      console.log("✓ Artwork converted to base64, length:", base64Image.length);
    } else {
      console.log("Using fallback image URL");
      artworkSrc = `https://soulwisdom.replit.app${lesson.artworkUrl}`;
    }

    const today = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const emailHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TEST - Daily Spiritual Lesson</title>
</head>
<body style="font-family: Georgia, serif; margin: 0; padding: 20px; background-color: #f8f6f0; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
        
        <div style="text-align: center; border-bottom: 2px solid #8b7355; padding-bottom: 20px; margin-bottom: 30px;">
            <div style="background-color: #8b7355; color: white; padding: 5px 15px; border-radius: 20px; font-size: 14px; display: inline-block; margin-bottom: 10px;">
                ${lesson.passage.tradition.name}
            </div>
            <h1 style="color: #8b7355; margin: 10px 0; font-size: 28px;">${lesson.title}</h1>
            <p style="color: #666; font-style: italic; margin: 10px 0;">${lesson.passage.source}</p>
            <p style="color: #666; font-size: 16px;">${today}</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
            <img src="${artworkSrc}" alt="${lesson.artworkDescription}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
            <p style="font-style: italic; color: #666; font-size: 14px; margin-top: 10px;">
                ${lesson.artworkDescription}
            </p>
        </div>

        <div style="margin: 30px 0;">
            <h3 style="color: #8b7355; margin-top: 0;">Today's Story</h3>
            <div style="line-height: 1.6;">
                ${lesson.story.split('\n\n').map(paragraph => `<p>${paragraph}</p>`).join('')}
            </div>
        </div>

        <div style="background-color: #f9f7f1; padding: 20px; border-left: 4px solid #8b7355; margin: 30px 0; border-radius: 5px;">
            <h3 style="color: #8b7355; margin-top: 0;">Life Lesson</h3>
            <p><strong>${lesson.lifeLesson}</strong></p>
        </div>

        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
            <p>Daily Spiritual Lessons - TEST EMAIL</p>
        </div>
    </div>
</body>
</html>`;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "ary.lakhotia@gmail.com",
        pass: 'mfqmmhuegicitzos'
      }
    });

    const mailOptions = {
      from: {
        name: 'Daily Spiritual Lessons - TEST',
        address: "ary.lakhotia@gmail.com"
      },
      to: "ary.lakhotia@gmail.com",
      subject: `TEST - ${lesson.title} - Artwork Check`,
      html: emailHtml
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✓ TEST email sent to ary.lakhotia@gmail.com only`);
    console.log(`Message ID: ${info.messageId}`);
    console.log("Please check if artwork is visible in this test email");

  } catch (error) {
    console.error("Error sending test email:", error);
  }
}

sendTestEmailOnly();