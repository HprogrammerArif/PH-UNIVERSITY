import { StudentServices } from './student.service';
import sendResponse from '../../utils/sendResponse';
import HttpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

//GET ALL STUDENT
const getAllStudents = catchAsync(async (req, res) => {

  console.log(req.query);

  const result = await StudentServices.getAllStudentsFromDB(req.query);

  //send response to client
  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Students are retrived succesfully!!',
    data: result,
  });
});

//GET SINGLE STUDENT
const getSingleStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StudentServices.getSingleStudentFromDB(id);

  //send response to client
  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Student is retrive succesfully!!',
    data: result,
  });
});

//Update a SINGLE STUDENT
const updateStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const {student} = req.body;
  const result = await StudentServices.updateStudentIntoDB(id, student);

  //send response to client
  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Student is updated succesfully!!',
    data: result,
  });
});


//Delete a SINGLE STUDENT
const deleteStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StudentServices.deleteStudentFromDB(id);

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
  updateStudent
};
