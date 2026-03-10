import express from 'express';
import { uploadStudentsExcel } from '../controllers/uploadExcel.controller.js';
import multer from 'multer';
import { verifyToken } from '../middleware/authMiddleware.js';


const router = express.Router();

const upload = multer({dest: "/uploads"});

router.post('/', verifyToken ,upload.single("file") ,uploadStudentsExcel);


export default router;
