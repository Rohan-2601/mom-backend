import mongoose from "mongoose";

const waitlistSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

export const Waitlist = mongoose.model("Waitlist", waitlistSchema);
