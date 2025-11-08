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
  "http://localhost:3000",
  "https://mom-frontend-kappa.vercel.app"
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use(express.json());

// ✅ Connect DB only if not already connected (prevents multiple connections)
let isConnected = false;
const ensureDBConnected = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
};
await ensureDBConnected();

// ✅ Routes
app.use("/api/meetings", router);
app.use("/api/audio", audioRouter);
app.use("/api/transcription", transcriptionRoutes);
app.use("/api/waitlist", webhookRoutes);

// ✅ Export for Vercel serverless
export default app;

// ✅ Local run (for development)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running locally on port ${PORT}`));
}

