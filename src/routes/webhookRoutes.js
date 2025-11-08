import express from "express";
import nodemailer from "nodemailer";
import { Waitlist } from "../models/waitlist.js";

const router = express.Router();

// ✅ Gmail transporter — works on Vercel
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
 port: 465,
secure: true,
 // TLS
  auth: {
    user: process.env.EMAIL_USER,       // your Gmail address
    pass: process.env.EMAIL_PASSWORD,   // your Gmail App Password
  },
});

// ✅ Route: POST /api/waitlist
router.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    const existing = await Waitlist.findOne({ email });
    if (!existing) await Waitlist.create({ name, email });

await transporter.sendMail({
  from: `"MoM.AI Team" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: "Welcome to MoM.AI — You're on the Early Access List 🚀",
  html: `
    <div style="background-color:#0f172a;color:#e2e8f0;font-family:'Inter',Arial,sans-serif;padding:48px 32px;border-radius:16px;max-width:640px;margin:40px auto;box-shadow:0 0 35px rgba(99,102,241,0.15);">
      <h1 style="color:#a5b4fc;font-size:28px;font-weight:700;text-align:center;">
        Welcome to <span style="color:#818cf8;">MoM.AI</span>
      </h1>
      <p style="font-size:15px;color:#94a3b8;text-align:center;">
        You’ve just joined the next generation of meetings.
      </p>

      <p>Hey ${name || "there"}, 👋</p>
      <p>
        Thanks for joining the <strong>MoM.AI Early Access</strong> waitlist!  
        You’re officially on our insider list and will be among the first to experience how AI can take notes, summarize, and manage meetings — better than a human assistant.
      </p>

      <p style="margin-top:22px;">
        We’re currently preparing for launch, and you’ll be the first to know once MoM.AI goes live.
      </p>

      <div style="text-align:center;margin-top:32px;">
        <a href="https://twitter.com/MoMAI156002" 
           style="background:linear-gradient(to right,#6366f1,#8b5cf6);color:white;padding:12px 28px;border-radius:9999px;text-decoration:none;font-weight:600;">
           Follow Us on X (Twitter)
        </a>
      </div>

      <p style="text-align:center;color:#94a3b8;font-size:13px;margin-top:32px;">
        Stay tuned — we’ll send you one email as soon as MoM.AI launches (no spam, promise).
      </p>
    </div>
  `,
});


    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error sending email:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;





