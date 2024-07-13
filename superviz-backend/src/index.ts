import express from "express";
import dotenv from "dotenv";
import ProjectController from "./controllers/project";

dotenv.config();

const router = express.Router();
const projectController = new ProjectController();
router.post("/project", projectController.store);

