import cloudinary from "../config/cloudinary.js";
import AudioFile from "../models/AudioFile.js";
import Meeting from "../models/Meeting.js";
import multer from "multer";

// Multer memory storage
const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const uploadAudioFile = async (req, res) => {
  try {
    const meetingId = req.body.meetingId;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    // Verify meeting exists
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found" });
    }

    // Cloudinary upload (audio/video)
    const cloudUpload = new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "video" },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      stream.end(file.buffer);
    });

    const uploadResult = await cloudUpload;

    // Save AudioFile doc
    const audioFile = await AudioFile.create({
      meetingId,
      filePath: uploadResult.secure_url,
      format: uploadResult.format,
      duration: uploadResult.duration,
      processed: false,
    });

    // Update meeting status
    meeting.status = "uploaded";
    await meeting.save();

    res.status(200).json({
      success: true,
      message: "Audio uploaded and linked successfully",
      audioFile,
    });

  } catch (error) {
    console.error("Audio upload error:", error);
    res.status(500).json({ error: "Error uploading audio file" });
  }
};
