import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const app = express();

// Gmail SMTP configuration
const gmailEmail = process.env.GMAIL_EMAIL;
const gmailPassword = process.env.GMAIL_APP_PASSWORD;

if (!gmailEmail || !gmailPassword) {
  console.error("❌ Error: GMAIL_EMAIL or GMAIL_APP_PASSWORD not found in .env.local");
  console.error("Add these to .env.local:");
  console.error("GMAIL_EMAIL=your_email@gmail.com");
  console.error("GMAIL_APP_PASSWORD=your_16_char_app_password");
  process.exit(1);
}

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

app.use(express.json());
app.use(cors());

app.post("/api/send-email", async (req, res) => {
  try {
    const { to, subject, html } = req.body;

    if (!to || !subject || !html) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log(`📧 Sending email to: ${to}`);
    
    const mailOptions = {
      from: gmailEmail,
      to: to,
      subject: subject,
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`✓ Email sent successfully. ID: ${info.messageId}`);
    res.json({ success: true, id: info.messageId });
  } catch (error) {
    console.error("❌ Email sending error:", error.message);
    res.status(500).json({ error: error.message || "Failed to send email" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✓ Email server running on http://localhost:${PORT}`);
  console.log(`✓ Gmail configured: ${gmailEmail}`);
  console.log(`✓ Ready to send emails!`);
});
