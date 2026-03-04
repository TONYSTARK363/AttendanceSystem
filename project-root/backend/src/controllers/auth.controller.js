import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/userSchema.js";
import dotenv from 'dotenv';

dotenv.config()

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate token
    const token = jwt.sign(
      {
        id: user._id,
        department: user.department,
        year: user.year
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      department: user.department,
      year: user.year,
      token,
      role: user.role
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};