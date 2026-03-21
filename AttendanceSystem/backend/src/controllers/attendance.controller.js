import Attendance from "../models/attendanceSchema.js";

// Helper to normalize date  YYYY-MM-DD
const formatDate = (d) => {
  return new Date(d).toISOString().slice(0, 10);
};

// Helper to create local date (avoids UTC bug)
const createLocalDate = (dateStr) => {
  return new Date(dateStr + "T00:00:00");
};

export const markAttendance = async (req, res) => {
  try {
    const { date, records } = req.body;

    if (!date || !records) {
      return res.status(400).json({ message: "Date and records required" });
    }

    const selectedDateObj = createLocalDate(date);

    // Prevent weekends
    const dayOfWeek = selectedDateObj.getDay(); // 0 = Sun, 6 = Sat
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return res.status(400).json({
        message: "Attendance cannot be marked on weekends (Saturday/Sunday)"
      });
    }

    const department = req.user.department;
    const year = req.user.year;

    // Prevent duplicate
    const existing = await Attendance.findOne({
      department,
      year,
      date: formatDate(selectedDateObj)
    });

    if (existing) {
      return res.status(400).json({
        message: "Attendance already marked for this date"
      });
    }

    // Get last attendance
    const lastAttendance = await Attendance.find({ department, year })
      .sort({ date: -1 })
      .limit(1);

    if (lastAttendance.length > 0) {
      const lastDateObj = createLocalDate(lastAttendance[0].date);

      let expectedNextDate = new Date(lastDateObj);
      expectedNextDate.setDate(expectedNextDate.getDate() + 1);

      //Skip weekends
      let nextDay = expectedNextDate.getDay();

      if (nextDay === 6) {
        expectedNextDate.setDate(expectedNextDate.getDate() + 2);
      } else if (nextDay === 0) {
        expectedNextDate.setDate(expectedNextDate.getDate() + 1);
      }

      // Normalize before compare
      const selectedFormatted = formatDate(selectedDateObj);
      const expectedFormatted = formatDate(expectedNextDate);

      console.log("Selected:", selectedFormatted);
      console.log("Expected:", expectedFormatted);

      if (selectedFormatted !== expectedFormatted) {
        return res.status(400).json({
          message: `Next attendance must be for ${expectedFormatted}`
        });
      }
    }

    //Save attendance
    await Attendance.create({
      department,
      year,
      date: formatDate(selectedDateObj),
      records
    });

    res.status(201).json({ message: "Attendance Marked" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

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