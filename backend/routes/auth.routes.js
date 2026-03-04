import express from "express";
import { loginUser } from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/login", loginUser);

//Logout 
router.post('/logout', (req, res)=>{
  res.status(200).send.json({message: "Logout Successfully"});
});
  
export default router;