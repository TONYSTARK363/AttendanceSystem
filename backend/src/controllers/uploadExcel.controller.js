import ExcelJS from "exceljs";
import Student from "../models/studentSchema.js";

export const uploadStudentsExcel = async (req, res) => {
  try {

    const { department } = req.user;
    const year = req.body.year; 

    if (!department || !year) {
      return res.status(400).json({
        message: "department and year are required"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Excel file required"
      });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);

    const worksheet = workbook.worksheets[0];

    const students = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber ===1 ) return;
       const studentName = row.getCell(1).text;
    const studentId = row.getCell(2).text;

      students.push({
        studentName: studentName,
        studentId: studentId,
        department: department,
        year: year,
      });
    });

    const savedStudents = await Student.insertMany(students, {
      ordered: false
    });

    res.status(201).json({
      message: "Students uploaded successfully",
      count: savedStudents.length
    });

  } catch (error) {
    res.status(500).json({
      message: "Upload failed",
      error: error.message
    });
  }
};