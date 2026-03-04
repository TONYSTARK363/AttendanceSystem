import mongoose from "mongoose";

const calendarSchema = new mongoose.Schema({
  date: {
    type: String, // "2026-03-05"
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ["working", "holiday"],
    required: true
  },
  reason: {
    type: String
  }
});

export default mongoose.model("Calendar", calendarSchema);