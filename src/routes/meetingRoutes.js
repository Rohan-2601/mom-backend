import express from "express";
import {
  createMeeting,
  getAllMeetings,
  getMeetingById,
  deleteMeeting,
} from "../controllers/meetingController.js";

const router = express.Router();

router.post("/create", createMeeting);
router.get("/", getAllMeetings);
router.get("/:id", getMeetingById);
router.delete("/:id", deleteMeeting);

export default router;
