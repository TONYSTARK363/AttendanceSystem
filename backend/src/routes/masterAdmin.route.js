// routes/masterAdminRoutes.js
import express from "express";
import {verifyToken} from "../middleware/authMiddleware.js";
import masterAdminAuth from "../middleware/masterAdminAuth.js"; 

import {attendanceAlertToday,} from "../controllers/attendanceAlertLogic.controller.js";
import {
      getAttendanceLog,
      getDepartments,
      getStudentsByDepartmentYear,
    updateStudentDetails
} from '../controllers/attendanceLog.controller.js'



const router = express.Router();

router.get("/departments", verifyToken, masterAdminAuth, getDepartments);
router.get("/students/:department/:year", verifyToken, masterAdminAuth, getStudentsByDepartmentYear);
router.put("/student/:id", verifyToken, masterAdminAuth, updateStudentDetails);
router.get("/attendance-log", verifyToken, masterAdminAuth, getAttendanceLog);
router.get("/attendance-alert", verifyToken, masterAdminAuth, attendanceAlertToday);

export default router;