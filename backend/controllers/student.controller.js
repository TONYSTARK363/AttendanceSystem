import Student from "../models/studentSchema.js";

//Register Student
export const registerStudent = async (req, res) => {
  try {
    let { studentName, studentId } = req.body;
     if(!studentName || !studentId){
    return res.status(400).json({message:"All feailds are required"})
     }
      studentName = studentName.trim().replace(/\s+/g, " ").toUpperCase();
     studentId = studentId.trim().toUpperCase();
     
    const student = await Student.create({
      studentName,
      studentId,
      department: req.user.department,
      year: req.user.year
    });

    res.status(201).json(student);

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Student ID already exists" });
    }

    res.status(500).json({ message: "Server error" });
  }
};

//GET ALL STUDENTS (NEW)
export const getStudents = async (req, res) => {
  try {
    const students = await Student.find({
      department: req.user.department,
      year: req.user.year
    }).sort({ createdAt: -1 });

    res.status(200).json(students);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};