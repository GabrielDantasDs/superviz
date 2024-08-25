import express from "express";
import dotenv from "dotenv";
import SprintController from "../controllers/sprint";

dotenv.config();

const router = express.Router();
const sprintController = new SprintController();

router.post("/", sprintController.create);
router.get("/", sprintController.getAll);
router.get("/closed", sprintController.getClosedSprints);
router.get("/:id", sprintController.get);
router.get("/closed/:id", sprintController.getClosedSprint);
router.patch("/close/:id", sprintController.close);

export default router;