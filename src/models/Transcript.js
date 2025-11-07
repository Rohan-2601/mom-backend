// models/Transcript.js
import mongoose from "mongoose";

const transcriptSchema = new mongoose.Schema({
  meetingId: { type: mongoose.Schema.Types.ObjectId, ref: "Meeting", required: true },
  speaker: { type: String },       // e.g., "Speaker 1"
  startTime: { type: Number },     // seconds
  endTime: { type: Number },
  text: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Transcript", transcriptSchema);
