import { storage } from './server/storage';
import nodemailer from 'nodemailer';

async function sendWorkingEmail() {
  try {
    console.log("Sending email with hosted artwork URL...");

    const lesson = await storage.getTodaysLesson();
    if (!lesson) {
      console.error("No lesson found");
      return;
    }

    // Use the deployed app URL for artwork instead of base64
    const artworkUrl = `https://soulwisdom.replit.app${lesson.artworkUrl}`;
    console.log("Using artwork URL:", artworkUrl);

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
    <title>Daily Spiritual Lesson - ${today}</title>
</head>
<body style="font-family: Georgia, serif; margin: 0; padding: 0; background-color: #f8f6f0;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="padding: 30px; text-align: center; border-bottom: 2px solid #8b7355;">
                            <div style="background-color: #8b7355; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; display: inline-block; margin-bottom: 15px;">
                                ${lesson.passage.tradition.name}
                            </div>
                            <h1 style="color: #8b7355; margin: 10px 0; font-size: 28px; line-height: 1.2;">${lesson.title}</h1>
                            <p style="color: #666; font-style: italic; margin: 10px 0; font-size: 16px;">${lesson.passage.source}</p>
                            <p style="color: #666; font-size: 16px; margin: 10px 0;">${today}</p>
                        </td>
                    </tr>

                    <!-- Artwork -->
                    <tr>
                        <td style="padding: 30px; text-align: center;">
                            <img src="${artworkUrl}" alt="${lesson.artworkDescription}" style="max-width: 100%; height: auto; border-radius: 8px; display: block; margin: 0 auto;" />
                            <p style="font-style: italic; color: #666; font-size: 14px; margin-top: 15px; margin-bottom: 0;">
                                ${lesson.artworkDescription}
                            </p>
                        </td>
                    </tr>

                    <!-- Story -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <h3 style="color: #8b7355; margin: 0 0 15px 0; font-size: 20px;">Today's Story</h3>
                            <div style="line-height: 1.6; color: #333;">
                                ${lesson.story.split('\n\n').map(p => `<p style="margin: 0 0 15px 0;">${p}</p>`).join('')}
                            </div>
                        </td>
                    </tr>

                    <!-- Life Lesson -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="background-color: #f9f7f1; padding: 20px; border-left: 4px solid #8b7355; border-radius: 5px;">
                                <h3 style="color: #8b7355; margin: 0 0 10px 0; font-size: 18px;">Life Lesson</h3>
                                <p style="margin: 0; font-weight: bold; color: #333; line-height: 1.5;">${lesson.lifeLesson}</p>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px 30px; text-align: center; border-top: 1px solid #eee; background-color: #f9f9f9;">
                            <p style="color: #666; font-size: 14px; margin: 5px 0;">Daily Spiritual Lessons - Wisdom from Sacred Traditions</p>
                            <p style="color: #666; font-size: 12px; margin: 5px 0;">To unsubscribe, reply with "unsubscribe" in the subject line.</p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
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
        name: 'Daily Spiritual Lessons',
        address: "ary.lakhotia@gmail.com"
      },
      to: "ary.lakhotia@gmail.com",
      subject: `TEST FINAL - ${lesson.title}`,
      html: emailHtml,
      text: `${lesson.title}\n${lesson.passage.source}\n\n${lesson.story}\n\nLife Lesson: ${lesson.lifeLesson}\n\nTo view artwork, please enable HTML in your email client.`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✓ Email sent with hosted artwork URL`);
    console.log(`Message ID: ${info.messageId}`);
    console.log("Check if this version displays properly");

  } catch (error) {
    console.error("Error:", error);
  }
}

sendWorkingEmail();