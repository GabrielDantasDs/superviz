import express from "express";
import dotenv from "dotenv";
import TaskController from "../controllers/task";

dotenv.config();

const router = express.Router();
const taskController = new TaskController();

router.put("/:id", taskController.setTaskCompleted);

export default router;