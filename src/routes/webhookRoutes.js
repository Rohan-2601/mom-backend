import express from "express";
import { Waitlist } from "../models/waitlist.js";
import { Resend } from "resend";

const router = express.Router();

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// POST /api/waitlist
router.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!email) return res.status(400).json({ error: "Email required" });

    // Save to MongoDB
    const existing = await Waitlist.findOne({ email });
    if (!existing) await Waitlist.create({ name, email });

    // Send welcome email with Resend
    await resend.emails.send({
      from: "MoM.AI <onboarding@resend.dev>",
      to: email,
      subject: "Welcome to MoM.AI — Your Early Access Awaits",
      html: `
        <div style="background-color:#0f172a;color:#e2e8f0;font-family:'Inter',Arial,sans-serif;padding:48px 32px;border-radius:16px;max-width:640px;margin:40px auto;box-shadow:0 0 35px rgba(99,102,241,0.15);">
          <h1 style="color:#a5b4fc;font-size:28px;font-weight:700;text-align:center;">Welcome to <span style="color:#818cf8;">MoM.AI</span></h1>
          <p style="font-size:15px;color:#94a3b8;text-align:center;">You’ve just joined the next generation of meetings.</p>
          <p>Hey ${name || "there"}, 👋</p>
          <p>Welcome aboard! You’ve secured your spot on the <strong>MoM.AI Early Access</strong> list.</p>
          <p>We’ll notify you as soon as we go live — no spam, just pure progress 🚀</p>
          <div style="text-align:center;margin-top:32px;">
            <a href="https://mom-ai.vercel.app" style="background:linear-gradient(to right,#6366f1,#8b5cf6);color:white;padding:12px 28px;border-radius:9999px;text-decoration:none;font-weight:600;">Visit MoM.AI</a>
          </div>
        </div>
      `,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error in waitlist route:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;


