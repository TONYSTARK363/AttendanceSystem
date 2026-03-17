import express from "express";
import {
  registerStudent
} from "../controllers/studentManualRegister.controller.js";
import { verifyToken, isTeacher } from "../middleware/authMiddleware.js";
import { isDepartmentAdmin } from '../middleware/DepartmentAdmin.js';import Student from "../models/studentSchema.js";

const router = express.Router();

// ----------------- Admin Routes -----------------

// Register student (Admin only)
router.post("/register", verifyToken, isDepartmentAdmin, registerStudent);

// Get all students (Admin only)
router.get("/", verifyToken, isDepartmentAdmin, async (req, res) => {
  try {
    const students = await Student.find({
      department: req.user.department
    }).sort({ createdAt: -1 });
    res.status(200).json(students);
  } catch (error) {
    console.error("GetAllStudents Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Get students for teacher (assigned year)
router.get("/teacher", verifyToken, isTeacher, async (req, res) => {
  try {
    const students = await Student.find({
      department: req.user.department,
      year: req.user.year // teacher's assigned year
    }).sort({ createdAt: -1 });

    res.status(200).json(students);
  } catch (error) {
    console.error("TeacherGetStudents Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

// Get students by year (Admin only)
router.get('/:year', verifyToken, isDepartmentAdmin, async (req, res) => {
  const year = Number(req.params.year);
  if (!year) {
    return res.status(400).json({ message: "Year is required" });
  }

  try {
    const students = await Student.find({
      department: req.user.department,
      year: year
    }).sort({ createdAt: -1 });

    res.status(200).json(students);
  } catch (error) {
    console.error("GetStudentsByYear Error:", error);
    res.status(500).json({
      message: 'Error fetching students for year ' + year,
      error: error.message
    });
  }
});

