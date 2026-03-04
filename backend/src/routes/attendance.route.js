import express from "express";
import { markAttendance, getAttendanceByDate } from "../controllers/attendance.controller.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/mark", verifyToken, markAttendance);
router.get("/:date", verifyToken, getAttendanceByDate);

export default router;