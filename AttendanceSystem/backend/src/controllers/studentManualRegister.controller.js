import Student from "../models/studentSchema.js";

// Register Student
export const registerStudent = async (req, res) => {
  try {
    let { studentName, studentId, year } = req.body;  // <-- get year from body
    if (!studentName || !studentId || !year) {
      return res.status(400).json({ message: "All fields including year are required" });
    }

    studentName = studentName.trim().replace(/\s+/g, " ").toUpperCase();
    studentId = studentId.trim().toUpperCase();

    const student = await Student.create({
       studentName,           // your schema field
       studentId,           // your schema field
      department: req.user.department,
      year: Number(year)
    });

    res.status(201).json(student);

  } catch (error) {
    console.error("RegisterStudent Error:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Student ID already exists" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL STUDENTS for a given year
export const getStudents = async (req, res) => {
  try {
    // Get year either from query or body
    const year = req.query.year || req.body.year;
    if (!year) {
      return res.status(400).json({ message: "Year is required to fetch students" });
    }

    const students = await Student.find({
      department: req.user.department,
      year: Number(year)
    }).sort({ createdAt: -1 });

    res.status(200).json(students);

  } catch (error) {
    console.error("GetStudents Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};