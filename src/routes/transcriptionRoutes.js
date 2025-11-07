import express from "express";
import { transcribeMeeting } from "../controllers/transcriptController.js";

const router = express.Router();

router.post("/run", transcribeMeeting);

export default router;
