import Attendance from "../models/attendanceSchema.js";
import Student from "../models/studentSchema.js";


// =============================
// Check which department/year did NOT mark attendance today
// =============================
export const attendanceAlertToday = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0,10);

    // Get all department/year combinations from students
    const deptYears = await Student.aggregate([
      {
        $group: {
          _id: { department: "$department", year: "$year" }
        }
      }
    ]);

    const missingClasses = [];

    for (let dy of deptYears) {
      const { department, year } = dy._id;

      // Check if Attendance exists for this department + year + date
      const exists = await Attendance.findOne({ department, year, date: today });
      if (!exists) {
        missingClasses.push({ department, year });
      }
    }

    res.json({
      date: today,
      missingClasses
    });

  } catch(err) {
    console.error("Attendance alert error:", err);
    res.status(500).json({ message: "Server error" });
  }
};