import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, default: Date.now },
  duration: { type: Number },
  status: {
    type: String,
    enum: ["uploaded", "processing", "transcribed", "completed"],
    default: "uploaded",
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export default mongoose.model("Meeting", meetingSchema);