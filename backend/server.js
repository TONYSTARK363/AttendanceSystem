import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

//routes import
import connectDB from './config/dataBaseConnection.js';
import authRoutes from './routes/auth.routes.js';
import studentRoutes from './routes/student.routes.js';
import AttendanceRoutes from './routes/attendance.route.js';
import ReportRoutes from './routes/report.route.js';
import GenerateCalander from './routes/calenderGenerate.route.js';
dotenv.config();

const app = express();


//Middleware
app.use(cors());
app.use(express.json());

//Connect to MongoDB
connectDB();

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', AttendanceRoutes);
app.use('/api/report', ReportRoutes);
app.use('/api/calendar', GenerateCalander);

app.get('/',(req,res)=>{
    res.send("server Workking")
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log("Process Exit Press Ctrl + C");
    console.log(`Server Running on PORT: ${PORT}`)
})