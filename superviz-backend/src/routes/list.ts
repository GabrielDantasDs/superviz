import express from "express";
import dotenv from "dotenv";
import ListController from "../controllers/list";

dotenv.config();

const router = express.Router();
const listController = new ListController();

router.post("/", listController.create);
router.get("/", listController.getAll);
router.patch("/rename/:id", listController.rename)
router.patch("/reorder", listController.reorder)
router.delete("/:id", listController.remove)

export default router;