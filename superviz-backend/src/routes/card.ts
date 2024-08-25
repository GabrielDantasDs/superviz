import express from "express";
import dotenv from "dotenv";
import CardController from "../controllers/card";

dotenv.config();

const router = express.Router();
const cardController = new CardController();

router.post("/", cardController.create)
router.post("/task", cardController.addTask);
router.post("/add-tag", cardController.addTag);
router.put("/:id", cardController.update);
router.patch("/reorder", cardController.reorder);
router.patch("/asign", cardController.asignUser);
router.delete("/:id", cardController.removeCard)

export default router;