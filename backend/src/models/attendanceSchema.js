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
      type: String,
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
attendanceSchema.index({ department: 1, year: 1, date: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);