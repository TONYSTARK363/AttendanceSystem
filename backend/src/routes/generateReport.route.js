
import express from "express";
import { generateReport } from '../controllers/report.controller.js'
import { verifyToken } from "../middleware/authMiddleware.js";
import { isDepartmentAdmin } from '../middleware/DepartmentAdmin.js';

const router = express.Router();

router.post("/", verifyToken, isDepartmentAdmin,generateReport);

export default router;