import express from "express";
import dotenv from "dotenv";
import UserController from "../controllers/user";


dotenv.config();

const router = express.Router();
const userController = new UserController();

router.get("/:id", userController.get);
router.post("/register", userController.create);
router.post("/login", userController.auth)

export default router;