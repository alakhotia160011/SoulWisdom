import nodemailer from 'nodemailer';

async function sendSimpleTest() {
  try {
    console.log("Sending simple HTML test email...");

    const simpleHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Simple Test</title>
</head>
<body>
    <h1 style="color: red;">TEST EMAIL</h1>
    <p>This is a simple test to check if HTML emails work at all.</p>
    <div style="background-color: yellow; padding: 10px;">
        <p>If you can see this yellow box, HTML is working.</p>
    </div>
    <img src="https://via.placeholder.com/300x200/blue/white?text=Test+Image" alt="Test Image" style="max-width: 100%;">
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
      from: "ary.lakhotia@gmail.com",
      to: "ary.lakhotia@gmail.com",
      subject: "SIMPLE HTML TEST - Can you see this?",
      html: simpleHtml,
      text: "This is a simple test email. If HTML doesn't work, you should see this text instead."
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✓ Simple test email sent`);
    console.log(`Message ID: ${info.messageId}`);
    console.log("Check if you can see HTML content or just plain text");

  } catch (error) {
    console.error("Error:", error);
  }
}

sendSimpleTest();