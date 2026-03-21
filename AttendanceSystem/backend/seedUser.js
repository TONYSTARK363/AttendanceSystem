import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/models/userSchema.js';
import dotenv from 'dotenv';
import dns from 'node:dns';

dns.setServers(['1.1.1.1', '8.8.8.8'])
dotenv.config();



mongoose.connect(process.env.MONGO_URI);

async function createUser() {
  const hashedPassword = await bcrypt.hash("English123", 10);

  await User.create({
    username: "English1",
    password: hashedPassword,
    role: "teacher",
    department: "English",
    year:1
    });

  console.log("User Created" );
  process.exit();
}

createUser();