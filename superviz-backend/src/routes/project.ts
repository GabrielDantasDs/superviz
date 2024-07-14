import express from "express";
import dotenv from "dotenv";
import ProjectController from "../controllers/project";

dotenv.config();

const router = express.Router();
const projectController = new ProjectController();

router.post("/", projectController.store);
router.get("/:id", projectController.get)
router.post("/card", projectController.addCard);

export default router;