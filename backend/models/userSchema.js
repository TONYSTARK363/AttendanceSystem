import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  department: {
    type: String,
      required: function () {
      return this.role === "teacher";
  }},
  year: {
    type: Number,
    enum: [1, 2, 3],
  required: function () {
    return this.role === "teacher";
  }
},
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
    role: {
  type: String,
  enum: ["admin", "teacher"],
  default: "teacher"
}
});

export default mongoose.model("User", userSchema);