import Attendance from "../models/attendanceSchema.js";

// ================================
// MARK ATTENDANCE (with sequential check)
// ================================
export const markAttendance = async (req, res) => {
  try {
    const { date, records } = req.body;

    if (!date || !records) {
      return res.status(400).json({ message: "Date and records required" });
    }

    const department = req.user.department;
    const year = req.user.year;

    // 1️⃣ Check if attendance already exists for this date
    const existing = await Attendance.findOne({ department, year, date });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Attendance already marked for this date" });
    }

    // 2️⃣ Check sequential attendance: get last marked date
    const lastAttendance = await Attendance.find({ department, year })
      .sort({ date: -1 }) // latest date first
      .limit(1);

    if (lastAttendance.length > 0) {
      const lastDate = lastAttendance[0].date; // e.g., "2026-03-11"
      const lastDateObj = new Date(lastDate);
      const expectedNextDate = new Date(lastDateObj);
      expectedNextDate.setDate(lastDateObj.getDate() + 1);

      const selectedDateObj = new Date(date);

      if (selectedDateObj.getTime() !== expectedNextDate.getTime()) {
        return res.status(400).json({
          message: `Next attendance must be for ${expectedNextDate.toISOString().slice(0, 10)}`
        });
      }
    }

    // 3️⃣ Save attendance
    await Attendance.create({
      department,
      year,
      date,
      records
    });

    res.status(201).json({ message: "Attendance Marked" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================================
// FETCH ATTENDANCE BY DATE
// ================================
export const getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.params;

    const attendance = await Attendance.findOne({
      department: req.user.department,
      year: req.user.year,
      date
    }).populate("records.student");

    res.status(200).json(attendance);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};