import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from 'node:dns';

//DNS Config 
dns.setServers(['1.1.1.1', '8.8.8.8']);
dotenv.config();


const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    }catch(error){
        console.error("MongoDB connection failed:", error);
        process.exit(1);
      }
}
export default  connectDB;