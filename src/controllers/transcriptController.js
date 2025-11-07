import { exec } from "child_process";
import fs from "fs";
import AudioFile from "../models/AudioFile.js";
import Transcript from "../models/Transcript.js";
import Meeting from "../models/Meeting.js";

export const transcribeMeeting = async (req, res) => {
  try {
    const { meetingId } = req.body;

    // 1) Get audio file from DB
    const audioFile = await AudioFile.findOne({ meetingId });
    if (!audioFile) {
      return res.status(404).json({ error: "No audio file found for this meeting." });
    }

    const cloudUrl = audioFile.filePath;

    // 2) Define temp filenames
    const timestamp = Date.now();
    const localAudio = `temp_${timestamp}.mp3`;
    const outputPrefix = `result_${timestamp}`;
    const outputText = `${outputPrefix}.txt`;

    // 3) Download audio from Cloudinary
    exec(`curl -L "${cloudUrl}" -o ${localAudio}`, (err) => {
      if (err) return res.status(500).json({ error: "Error downloading audio file" });

      // 4) Run Whisper
      const whisperExe = `"C:\\Users\\rjha0\\Desktop\\whisper-local\\Release\\whisper-cli.exe"`;
      const cmd = `${whisperExe} -m ../model/ggml-tiny.en.bin -f ${localAudio} -otxt -of ${outputPrefix} --no-timestamps`;

      exec(cmd, async (err2) => {
        if (err2) return res.status(500).json({ error: "Error running whisper" });

        // 5) Read transcript
        const transcriptText = fs.readFileSync(outputText, "utf8");

        // 6) Save to MongoDB
        await Transcript.create({ meetingId, text: transcriptText });
        await Meeting.findByIdAndUpdate(meetingId, { status: "transcribed" });

        // 7) Cleanup temp files
        fs.unlinkSync(localAudio);
        fs.unlinkSync(outputText);

        return res.json({
          success: true,
          message: "Transcription completed",
          transcript: transcriptText
        });
      });
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
