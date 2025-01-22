import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import HttpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

const createStudent = catchAsync(async (req, res) => {
  //create a schema validation using zod
  const { password, student: studentData } = req.body;

  //const zodParsedData = studentValidationSchema.parse(studentData);

  const result = await UserServices.createStudentIntoDB(password, studentData);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Student is created succesfully!!',
    data: result,
  });
});

export const UserControllers = {
  createStudent,
};
