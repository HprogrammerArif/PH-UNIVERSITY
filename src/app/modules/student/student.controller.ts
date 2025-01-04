import { Request, Response } from 'express';
import { StudentServices } from './student.service';
// import studentValidationSchema from './student.validation';
//import { z } from 'zod';
import studentValidationSchema from './student.validation';

const createStudent = async (req: Request, res: Response) => {
  try {
    // //create a schema validation using joi
    // const { student: studentData } = req.body;
    // //data validation using joi
    // const { error, value } = studentValidationSchema.validate(studentData);
    // // console.log({error}, {value});

    //  //will call service func to send this data
    //  const result = await StudentServices.createStudentIntoDB(value);
    // if (error) {
    //   res.status(500).json({
    //     success: false,
    //     message: 'Something went wrong!!',
    //     error: error,
    //   });
    // }

    //create a schema validation using zod
    const { student: studentData } = req.body;

    const zodParsedData = studentValidationSchema.parse(studentData);

    const result = await StudentServices.createStudentIntoDB(zodParsedData);

    //send response to client
    res.status(200).json({
      success: true,
      message: 'Student is created succesfully!!',
      data: result,
    });
  } catch (err:any) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message || 'Something went wrong!!',
      error: err,
    });
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong!!',
      error: error,
    });
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
      message: 'Student is retrive succesfully!!',
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Something went wrong!!',
      error: err,
    });
  }
};

//Update or Delete a SINGLE STUDENT
const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const result = await StudentServices.deleteStudentFromDB(studentId);

    //send response to client
    res.status(200).json({
      success: true,
      message: 'Student is deleted succesfully!!',
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Something went wrong!!',
      error: err,
    });
  }
};

export const StudentControllers = {
  createStudent,
  getAllStudents,
  getSingleStudent,
  deleteStudent
};
