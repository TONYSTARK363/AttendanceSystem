import User from '../models/userSchema.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//Login controller
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    //Year validation <3 years
    const year = parseInt(username.slice(-1));
       if (![1, 2, 3].includes(year)) {
     return res.status(400).json({ message: "Year must be 1, 2, or 3" });
  }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      {
        id: user._id,
        department: user.department,
        year: user.year
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({
      token,
      department: user.department,
      year: user.year
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};