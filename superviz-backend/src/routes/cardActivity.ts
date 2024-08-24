import express from "express";
import dotenv from "dotenv";
import CardController from "../controllers/card";
import CardActivityController from "../controllers/cardActivity";

dotenv.config();

const router = express.Router();
const cardActivityController = new CardActivityController();

router.post("/", cardActivityController.create);
router.get("/:id", cardActivityController.get);
router.get("/card/:id", cardActivityController.getAllByCard);
router.get("/project/:id", cardActivityController.getAllByProject);

export default router;