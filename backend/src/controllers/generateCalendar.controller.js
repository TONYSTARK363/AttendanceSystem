import Calendar from "../models/calendarSchema.js";

export const generateCalendar = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Start and End date required" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Optional: clear existing calendar first
    await Calendar.deleteMany({});

    let current = new Date(start);
    let dates = [];

    while (current <= end) {
      const day = current.getDay(); // 0 Sunday, 6 Saturday

      let type = "working";

      if (day === 0) type = "holiday";
      if (day === 6) type = "holiday";

      dates.push({
        date: current.toISOString().split("T")[0],
        type
      });

      current.setDate(current.getDate() + 1);
    }

    await Calendar.insertMany(dates);

    res.status(201).json({ message: "Calendar Generated Successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};