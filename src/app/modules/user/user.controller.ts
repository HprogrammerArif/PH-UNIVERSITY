import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import HttpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

const createStudent = catchAsync(async (req, res) => {
  //console.log(req.file, 'FILE');
  // console.log(JSON.parse(req.body.data), 'DATA');

  //create a schema validation using zod
  const { password, student: studentData } = req.body;

  //const zodParsedData = studentValidationSchema.parse(studentData);

  const result = await UserServices.createStudentIntoDB(req.file, password, studentData);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Student is created succesfully!!',
    data: result,
  });
});

const createFaculty = catchAsync(async (req, res) => {
  const { password, faculty: facultyData } = req.body;

  const result = await UserServices.createFacultyIntoDB(password, facultyData);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Faculty is created succesfully',
    data: result,
  });
});

const createAdmin = catchAsync(async (req, res) => {
  const { password, admin: adminData } = req.body;

  const result = await UserServices.createAdminIntoDB(password, adminData);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Admin is created succesfully',
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  // const token = req.headers.authorization;
  // if (!token) {
  //   throw new AppError(HttpStatus.UNAUTHORIZED, 'Token not found');
  // }

  //console.log(req.user);
  const { userId, role } = req.user;

  const result = await UserServices.getMe(userId, role);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'User fetched successfully',
    data: result,
  });
});


const changeStatus = catchAsync(async (req, res) => {
  const { id } = req.params;


  const result = await UserServices.changeStatus(id, req.body);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'User status updated successfully',
    data: result,
  });
});

export const UserControllers = {
  createStudent,
  createFaculty,
  createAdmin,
  getMe,
  changeStatus,
};
