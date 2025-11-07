import Meeting from "../models/Meeting.js";
import AudioFile from "../models/AudioFile.js";
import Transcript from "../models/Transcript.js";


export const createMeeting = async (req, res) => {
  try {
    const { title, date, createdBy } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Meeting title is required" });
    }

    const meeting = await Meeting.create({
      title,
      date: date || Date.now(),
      createdBy,
    });

    res.status(201).json({ success: true, meeting });
  } catch (error) {
    console.error("Error creating meeting:", error);
    res.status(500).json({ error: "Server error while creating meeting" });
  }
};


export const getAllMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: meetings.length, meetings });
  } catch (error) {
    console.error("Error fetching meetings:", error);
    res.status(500).json({ error: "Server error while fetching meetings" });
  }
};


export const getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate("createdBy", "name email")
      .lean();

    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found" });
    }

    const audioFiles = await AudioFile.find({ meetingId: meeting._id });
    const transcripts = await Transcript.find({ meetingId: meeting._id });

    res.status(200).json({
      success: true,
      meeting,
      audioFiles,
      transcripts,
    });
  } catch (error) {
    console.error("Error getting meeting:", error);
    res.status(500).json({ error: "Server error while fetching meeting" });
  }
};


export const deleteMeeting = async (req, res) => {
  try {
    const meetingId = req.params.id;

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found" });
    }

    // Optionally delete linked data (audio & transcripts)
    await AudioFile.deleteMany({ meetingId });
    await Transcript.deleteMany({ meetingId });

    await meeting.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Meeting and related data deleted" });
  } catch (error) {
    console.error("Error deleting meeting:", error);
    res.status(500).json({ error: "Server error while deleting meeting" });
  }
};
