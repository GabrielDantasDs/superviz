import express from "express";
import dotenv from "dotenv";
import TagController from "../controllers/tag";

dotenv.config();

const router = express.Router();
const tagController = new TagController();

router.post("/", tagController.store);

export default router;