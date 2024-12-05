import { Request, Response } from 'express';
import { StudentServices } from './student.service';

const createStudent = async (req: Request, res: Response) => {
  try {
    const { student: studentData } = req.body;
    //will call service func to send this data
    const result = await StudentServices.createStudentIntoDB(studentData);
    //send response to client
    res.status(200).json({
      success: true,
      message: 'Student is created succesfully!!',
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

//GET ALL STUDENT
const getAllStudents = async (req: Request, res: Response) => {
  try {
    const result = await StudentServices.getAllStudentsFromDB();

    //send response to client
    res.status(200).json({
      success: true,
      message: 'Student is created succesfully!!',
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

//GET SINGLE STUDENT
const getSingleStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const result = await StudentServices.getSingleStudentFromDB(studentId);

    //send response to client
    res.status(200).json({
      success: true,
      message: 'Student is created succesfully!!',
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

export const StudentControllers = {
  createStudent,
  getAllStudents,
  getSingleStudent,
};
