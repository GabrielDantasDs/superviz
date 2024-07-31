import express from "express";
import dotenv from "dotenv";
import MeetingController from "../controllers/meeting";

dotenv.config();

const router = express.Router();
const meetingController = new MeetingController();

router.post("/", meetingController.create);
router.get("/", meetingController.getAll);
router.get("/:id", meetingController.get);
router.get("/close", meetingController.close);

export default router;