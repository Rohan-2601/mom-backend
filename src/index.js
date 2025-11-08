import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import router from "./routes/meetingRoutes.js";
import audioRouter from "./routes/audioRoutes.js";
import transcriptionRoutes from "./routes/transcriptionRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";

dotenv.config();

const app = express();

// ✅ CORS setup
const allowedOrigins = [
  "http://localhost:3000", // for local dev
  "https://mom-frontend-kappa.vercel.app" // your deployed frontend URL

];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use(express.json());

// ✅ Connect DB
connectDB();

// ✅ Routes
app.use("/api/meetings", router);
app.use("/api/audio", audioRouter);
app.use("/api/transcription", transcriptionRoutes);
app.use("/api/waitlist", webhookRoutes);

// ✅ Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

