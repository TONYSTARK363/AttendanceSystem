import express from "express";
import { markAttendance, getAttendanceByDate } from "../controllers/attendance.controller.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { isTeacher } from "../middleware/authMiddleware.js"; // optional middleware

const router = express.Router();


router.post("/mark", verifyToken, isTeacher, markAttendance);

router.get("/:date", verifyToken, isTeacher, getAttendanceByDate);

export default router;