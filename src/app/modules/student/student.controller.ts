import { StudentServices } from './student.service';
import sendResponse from '../../utils/sendResponse';
import HttpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

//GET ALL STUDENT
const getAllStudents = catchAsync(async (req, res) => {
  const result = await StudentServices.getAllStudentsFromDB();

  //send response to client
  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Student is created succesfully!!',
    data: result,
  });
});

//GET SINGLE STUDENT
const getSingleStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const result = await StudentServices.getSingleStudentFromDB(studentId);

  //send response to client
  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Student is retrive succesfully!!',
    data: result,
  });
});

//Update or Delete a SINGLE STUDENT
const deleteStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const result = await StudentServices.deleteStudentFromDB(studentId);

  //send response to client
  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Student is deleted succesfully!!',
    data: result,
  });
});

export const StudentControllers = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
};
