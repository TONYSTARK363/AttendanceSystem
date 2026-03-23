import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

//routes import
import connectDB from './config/dataBaseConnection.js';
import authRoutes from './routes/auth.routes.js';
import studentRoutes from './routes/studentManualRegister.routes.js';
import AttendanceRoutes from './routes/attendance.route.js';
import ReportRoutes from './routes/generateReport.route.js';
//import GenerateCalander from './routes/calenderGenerate.route.js';
import UploadStudents from './routes/uploadExcel.route.js';

//Master
import masterAdminRoutes from './routes/masterAdmin.route.js';


dotenv.config();
const app = express();
//Cors Setup
app.use(
    cors({
   origin:['http://127.0.0.1:5500',
    'https://clgattendance1.netlify.app'],

   credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
     allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
})) 
//Middleware

app.use(express.json());

//Connect to MongoDB
connectDB();


//Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', AttendanceRoutes);
app.use('/api/report', ReportRoutes);
app.use('/api/upload', UploadStudents);
app.use('/api/master', masterAdminRoutes)

//app.use('/api/calendar', GenerateCalander);
//app.get('/',(req,res)=>{
  //  res.send("server Workking")
//})


//As Route check path is not a coorect path send as 404 res
app.use((req, res, next)=>{
 res.status(404).json({
  message:"API Route Not Found",
  success: false,
  path: req.originalUrl,
 })

});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log("Process Exit Press Ctrl + C");
    console.log(`Server Running on PORT: ${PORT}`)
})