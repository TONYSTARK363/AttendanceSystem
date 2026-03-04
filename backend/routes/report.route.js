
import express from "express";
import { generateReport } from '../controllers/report.controller.js'
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, generateReport);

export default router;