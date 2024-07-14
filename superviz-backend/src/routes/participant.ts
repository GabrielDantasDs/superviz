import express from "express";
import dotenv from "dotenv";
import ParticipantController from "../controllers/participant";

dotenv.config();

const router = express.Router();
const participantController = new ParticipantController();

router.post("/", participantController.get);

export default router;