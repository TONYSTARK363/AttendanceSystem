import Attendance from "../models/attendanceSchema.js";
import Student from "../models/studentSchema.js";

export const generateReport = async (req, res) => {
  try {
    const { from, to, year } = req.body;

    if (!from || !to || !year) {
      return res.status(400).json({ message: "From, To, and Year are required" });
    }

    // Get all attendance records for the range
    const attendances = await Attendance.find({
      department: { $regex: `^${req.user.department}$`, $options: "i" },
      year: Number(year),
      date: { $gte: from, $lte: to }
    });

    const students = await Student.find({
      department: { $regex: `^${req.user.department}$`, $options: "i" },
      year: Number(year)
    });

    // Create a set of all unique dates in the range that have attendance
    const workingDates = [...new Set(attendances.map(a => a.date))];
    const totalDays = workingDates.length; // total working days

    const report = students.map(student => {
      let absentCount = 0;

      attendances.forEach(day => {
        const record = day.records.find(
          r => r.student && r.student.toString() === student._id.toString()
        );
        if (record && record.status === "absent") {
          absentCount++;
        }
      });

      // If student has no record on a date, assume present
      const presentCount = totalDays - absentCount;
      const percentage = totalDays === 0 ? 0 : ((presentCount / totalDays) * 100).toFixed(2);

      return {
        studentName: student.studentName,
        studentId: student.studentId,
        totalDays,
        presentDays: presentCount,
        absentDays: absentCount,
        percentage
      };
    });

    res.json(report);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};