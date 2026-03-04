import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/userSchema.js';
import dotenv from 'dotenv'
dotenv.config();

mongoose.connect(process.env.MONGO_URI);

async function createUser() {
  const hashedPassword = await bcrypt.hash("Zoology123", 10);

  await User.create({
    username: "Zoology1",
    password: hashedPassword,
    year: 2,
    department: "Zoology"
  });

  console.log("User Created" );
  process.exit();
}

createUser();