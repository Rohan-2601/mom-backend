import mongoose from "mongoose";

const audioFileSchema = new mongoose.Schema({
  meetingId: { type: mongoose.Schema.Types.ObjectId, ref: "Meeting", required: true },
  filePath: { type: String, required: true }, // e.g., "/uploads/audio123.wav"
  format: { type: String },
  duration: { type: Number },
  processed: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("AudioFile", audioFileSchema);
