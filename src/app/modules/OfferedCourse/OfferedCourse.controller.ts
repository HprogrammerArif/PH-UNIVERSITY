import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import HttpStatus from 'http-status';
import { OfferedCourseServices } from './OfferedCourse.service';

const createOfferedCourse = catchAsync(async (req, res) => {
  const result = await OfferedCourseServices.createOfferedCourseIntoDB(
    req.body,
  );

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Offered Course is created succesfully!!',
    data: result,
  });
});

const getAllOfferedCourses = catchAsync(async (req, res) => {
  const result = await OfferedCourseServices.getAllOfferedCoursesFromDB(
    req.query,
  );
  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Offered Courses are retrieved successfully!',
    data: result,
  });
});

const getSingleOfferedCourse = catchAsync(async (req, res) => {
  const result = await OfferedCourseServices.getSingleOfferedCourseFromDB(
    req.params.id,
  );
  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Offered Course is retrieved successfully!',
    data: result,
  });
});

const updateOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OfferedCourseServices.updateOfferedCourseIntoDB(
    id,
    req.body,
  );
  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Offered Course is updated successfully!',
    data: result,
  });
});

const deleteOfferedCourse = catchAsync(async (req, res) => {
  const result = await OfferedCourseServices.deleteOfferedCourseFromDB(
    req.params.id,
  );
  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Offered Course is deleted successfully!',
    data: result,
  });
});

export const OfferedCourseControllers = {
  createOfferedCourse,
  getAllOfferedCourses,
  getSingleOfferedCourse,
  updateOfferedCourse,
  deleteOfferedCourse,
};
