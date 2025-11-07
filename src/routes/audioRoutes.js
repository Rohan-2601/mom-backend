import express from "express";
import { upload, uploadAudioFile } from "../controllers/audioController.js";

const router = express.Router();

router.post("/upload", upload.single("file"), uploadAudioFile);

export default router;
