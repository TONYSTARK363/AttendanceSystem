import express from "express";
import { generateCalendar } from "../controllers/generateCalendar.controller.js";
import { verifyToken } from "../middleware/authMiddleware.js";
//import { isAdmin } from "../middleware/DepartmentAdmin.js";
import Calendar from "../models/calendarSchema.js";

const router = express.Router();


//Generate full academic calendar
router.post("/generate", verifyToken, generateCalendar);


//Get full calendar
router.get("/", verifyToken, isAdmin, async (req, res) => {
  const data = await Calendar.find().sort({ date: 1 });
  res.json(data);
});


//Toggle working / holiday
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  const { type } = req.body;

  await Calendar.findByIdAndUpdate(req.params.id, { type });

  res.json({ message: "Updated successfully" });
});

export default router;