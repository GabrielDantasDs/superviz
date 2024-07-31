import express from "express";
import dotenv from "dotenv";
import ListController from "../controllers/list";

dotenv.config();

const router = express.Router();
const listController = new ListController();

router.post("/", listController.create);
router.get("/", listController.getAll);

export default router;