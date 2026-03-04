import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    department: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    date: {
      type: String, // "2026-03-03"
      required: true
    },
    records: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
          required: true
        },
        status: {
          type: String,
          enum: ["present", "absent"],
          required: true
        }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", attendanceSchema);