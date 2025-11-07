import express from "express";
import { Waitlist } from "../models/waitlist.js";
import nodemailer from "nodemailer";

const router = express.Router();

// POST /api/waitlist
router.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!email) return res.status(400).json({ error: "Email required" });

    // Save to MongoDB
    const existing = await Waitlist.findOne({ email });
    if (!existing) await Waitlist.create({ name, email });

    // Send welcome email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

await transporter.sendMail({
  from: `"MoM.AI Team" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: "Welcome to MoM.AI — Your Early Access Awaits 🚀",
  html: `
  <div style="
    background-color: #0f172a;
    color: #e2e8f0;
    font-family: 'Inter', Arial, sans-serif;
    padding: 48px 32px;
    border-radius: 16px;
    max-width: 640px;
    margin: 40px auto;
    box-shadow: 0 0 35px rgba(99,102,241,0.15);
    background-image: radial-gradient(circle at top right, rgba(99,102,241,0.12), transparent 50%), 
                      radial-gradient(circle at bottom left, rgba(147,51,234,0.08), transparent 50%);
  ">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <img 
        src="https://cdn-icons-png.flaticon.com/512/4712/4712079.png"
        alt="MoM.AI Logo"
        style="width: 58px; height: 58px; margin-bottom: 16px;"
      />
      <h1 style="
        color: #a5b4fc;
        font-size: 28px;
        font-weight: 700;
        letter-spacing: -0.3px;
        margin: 0;
      ">
        Welcome to <span style="color: #818cf8;">MoM.AI</span>
      </h1>
      <p style="font-size: 15px; color: #94a3b8; margin-top: 6px;">
        You’ve just joined the next generation of meetings.
      </p>
    </div>

    <!-- Body -->
    <div style="margin-top: 20px; line-height: 1.8; font-size: 15px;">
      <p>Hey ${name || "there"}, 👋</p>
      <p>
        Welcome aboard! You’ve secured your spot on the <strong>MoM.AI Early Access</strong> list —
        and you’ll soon experience how AI can take notes, track action items, 
        and summarize meetings <em>better than a human assistant.</em>
      </p>

      <p style="margin-top: 22px;">Here’s what’s coming your way:</p>
      <div style="
        background: rgba(30,41,59,0.8);
        border: 1px solid rgba(99,102,241,0.25);
        border-radius: 10px;
        padding: 18px 22px;
        margin-top: 12px;
      ">
        <ul style="margin: 0; padding-left: 20px; color: #cbd5e1;">
          <li>🧠 Smart AI that attends and understands meetings in real time</li>
          <li>📝 Automatic summaries, decisions, and task extraction</li>
          <li>🔗 Deep integrations with Notion, HubSpot, and Linear</li>
          <li>🌍 Multi-language transcripts powered by Google Cloud AI</li>
        </ul>
      </div>

      <p style="margin-top: 24px;">
        You’ll get one email when MoM.AI goes live — no spam, no noise.  
        Just pure progress, straight to your inbox.
      </p>

      // <div style="text-align: center; margin-top: 40px;">
      //   <a 
      //     href="https://mom-ai.vercel.app" 
      //     style="
      //       background: linear-gradient(to right, #6366f1, #8b5cf6);
      //       color: white;
      //       padding: 12px 28px;
      //       border-radius: 9999px;
      //       text-decoration: none;
      //       font-weight: 600;
      //       box-shadow: 0 0 15px rgba(99,102,241,0.3);
      //       transition: all 0.3s ease;
      //       display: inline-block;
      //     "
      //   >
      //     Visit MoM.AI
      //   </a>
      // </div>
    </div>

    <!-- Footer -->
    <hr style="margin: 40px 0; border: none; border-top: 1px solid #1e293b;" />
    <div style="text-align: center; font-size: 13px; color: #64748b;">
      <p>© ${new Date().getFullYear()} <span style="color:#818cf8;">MoM.AI</span> — Built for clarity.</p>
      <p style="margin: 0;">You received this email because you joined our early access list.</p>
    </div>
  </div>
  `,
});




    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

