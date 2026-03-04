import Attendance from "../models/attendanceSchema.js";

//Present Or Absent Operation
export const markAttendance = async (req, res) => {
  try {
    const { date, records } = req.body;

    if (!date || !records) {
      return res.status(400).json({ message: "Date and records required" });
    }

    const existing = await Attendance.findOne({
      department: req.user.department,
      year: req.user.year,
      date
    });

    if (existing) {
      existing.records = records;
      await existing.save();
      return res.status(200).json({ message: "Attendance Updated" });
    }

    await Attendance.create({
      department: req.user.department,
      year: req.user.year,
      date,
      records
    });

    res.status(201).json({ message: "Attendance Marked" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//fetch/get Attendence By Date
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
    res.status(500).json({ message: "Server error" });
  }
};