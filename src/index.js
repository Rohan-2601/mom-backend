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

app.use(cors());
app.use(cors({ origin: "*" }));
app.use(express.json());

connectDB();
app.use("/api/meetings", router);
app.use("/api/audio", audioRouter);
app.use("/api/transcription", transcriptionRoutes);
app.use("/api/waitlist", webhookRoutes);





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
