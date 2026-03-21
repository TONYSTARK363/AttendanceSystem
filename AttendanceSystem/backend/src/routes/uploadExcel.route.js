import express from 'express';
import { uploadStudentsExcel } from '../controllers/uploadExcel.controller.js';
import multer from 'multer';
import { verifyToken } from '../middleware/authMiddleware.js';
import { isDepartmentAdmin } from '../middleware/DepartmentAdmin.js'


const router = express.Router();

const upload = multer({dest: "/uploads"});

router.post('/', verifyToken, isDepartmentAdmin ,upload.single("file") ,uploadStudentsExcel);


export default router;
