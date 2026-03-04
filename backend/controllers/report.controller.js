import Attendance from "../models/attendanceSchema.js";
import Student from "../models/studentSchema.js";

export const generateReport = async (req, res) => {
  try {
    const { from, to } = req.body;

    if (!from || !to) {
      return res.status(400).json({ message: "From and To dates required" });
    }

    // Get all attendance between dates
    const attendances = await Attendance.find({
      department: req.user.department,
      year: req.user.year,
      date: { $gte: from, $lte: to }
    });

    const students = await Student.find({
      department: req.user.department,
      year: req.user.year
    });

    const totalDays = attendances.length;

    const report = students.map(student => {
      let presentCount = 0;

      attendances.forEach(day => {
        const record = day.records.find(
          r => r.student.toString() === student._id.toString()
        );

        if (record && record.status === "present") {
          presentCount++;
        }
      });

      const percentage =
        totalDays === 0 ? 0 :
        ((presentCount / totalDays) * 100).toFixed(2);

      return {
        studentName: student.studentName,
        studentId: student.studentId,
        totalDays,
        presentDays: presentCount,
        percentage
      };
    });

    res.status(200).json(report);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};