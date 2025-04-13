import HttpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { CourseServices } from './course.service';
import sendResponse from '../../utils/sendResponse';

const createCourse = catchAsync(async (req, res) => {
  const result = await CourseServices.createCourseIntoDB(req.body);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Course is created succesfully!!',
    data: result,
  });
});

const getAllCourses = catchAsync(async (req, res) => {
  const result = await CourseServices.getAllCoursesFromDB(req.query);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Courses are retrived succesfully!!',
    data: result,
  });
});

const getSingleCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.getSingleCourseFromDB(id);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Course is retrived succesfully!!',
    data: result,
  });
});

const updateCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.updateCourseIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Course is updated succesfully!!',
    data: result,
  });
});

const deleteCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.deleteCourseFromDB(id);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Course is deleted succesfully!!',
    data: result,
  });
});

const assignFacultiesWithCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { faculties } = req.body;
  const result = await CourseServices.assignFacultiesWithCourseIntoDB(
    courseId,
    faculties,
  );

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'CourseFaculty assign succesfully!!',
    data: result,
  });
});


const removeFacultiesFromCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { faculties } = req.body;
  const result = await CourseServices.removeFacultiesFromCourseFromDB(
    courseId,
    faculties,
  );

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Faculty removed succesfully!!',
    data: result,
  });
});

export const CourseControllers = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse,
  assignFacultiesWithCourse,
  removeFacultiesFromCourse
};
