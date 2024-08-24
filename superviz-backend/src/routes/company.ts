import express from "express";
import dotenv from "dotenv";
import CompanyController from "../controllers/company";


dotenv.config();

const router = express.Router();
const companyController = new CompanyController();

router.get("/:id", companyController.get);
router.post("/", companyController.create);

export default router;