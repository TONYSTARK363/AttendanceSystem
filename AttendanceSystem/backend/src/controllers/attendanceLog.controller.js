// controllers/masterAdminController.js
import Student from "../models/studentSchema.js";
import Attendance from "../models/attendanceSchema.js";

// Get all distinct departments
export const getDepartments = async (req, res) => {
  try {
    const departments = await Student.distinct("department");
    res.json(departments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get students by department and year
export const getStudentsByDepartmentYear = async (req, res) => {
  try {
    const { department, year } = req.params;
    const students = await Student.find({ department, year: Number(year) });
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// pdate student details by ID
export const updateStudentDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student updated successfully", student: updatedStudent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Attendance log (already done)
export const getAttendanceLog = async (req, res) => {
  try {
    const { date } = req.query;
    const logDate = date || new Date().toISOString().slice(0, 10);

    const departments = await Student.distinct("department");
    const log = [];

    for (let dept of departments) {
      const students = await Student.find({ department: dept });
      const totalStudents = students.length;

      const attendance = await Attendance.findOne({ department: dept, date: logDate });

      const present = attendance ? attendance.records.filter(r => r.status === "present").length : 0;
      const absent = totalStudents - present;

      log.push({
        department: dept,
        date: logDate,
        totalStudents,
        present,
        absent
      });
    }

    res.json(log);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//Attendance alert (already done)
export const attendanceAlertToday = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const departments = await Student.distinct("department");
    const alerts = [];

    for (let dept of departments) {
      const exist = await Attendance.findOne({ department: dept, date: today });
      if (!exist) alerts.push(dept);
    }

    res.json({ date: today, missingDepartments: alerts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};