import express from "express";
import dotenv from "dotenv";
import UserController from "../controllers/user";
import authenticateToken from "../middlewares/auth";


dotenv.config();

const router = express.Router();
const userController = new UserController();

router.get("/:id", userController.get);
router.post("/register", userController.create);
router.post("/login", userController.auth)
router.get("/all/:id", authenticateToken, userController.getAllByCompany)

export default router;