import User from '../models/userSchema.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Login controller
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Validate if the user’s year matches the year field in the database
    if (![1, 2, 3].includes(user.year)) {
      return res.status(400).json({ message: "Year must be 1, 2, or 3" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Create a JWT token
    const token = jwt.sign(
      {
        id: user._id,
        department: user.department,
        year: user.year,
        role: user.role  // Include the user's role in the token
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }  // Token expires in 1 day
    );

    // Send the response with token and user details
    res.json({
      token,
      department: user.department,
      year: user.year,
      role: user.role  // Return the user's role in the response
    });

  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Server error" });
  }
};