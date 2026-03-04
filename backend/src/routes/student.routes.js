import express from "express";
import {
  registerStudent,
  getStudents
} from "../controllers/student.controller.js";
import {verifyToken} from "../middleware/authMiddleware.js";

const router = express.Router();

//Register student
router.post("/register", verifyToken, registerStudent);

//Get students
router.get("/", verifyToken, getStudents);

export default router;