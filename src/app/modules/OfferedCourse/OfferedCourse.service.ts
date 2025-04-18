import AppError from '../../errors/AppError';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';
import { Course } from '../Course/course.model';
import { Faculty } from '../Faculty/faculty.model';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { TOfferedCourse } from './OfferedCourse.interface';
import { OfferedCourse } from './OfferedCourseModel';
import HttpStatus from 'http-status';

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegestration,
    // academicSemester, will not come from the client side
    academicFaculty,
    academicDepartment,
    course,
    faculty,
  } = payload;


  // Check if the semester registration id exists in the database
  const isSemesterRegestrationExists =
    await SemesterRegistration.findById(semesterRegestration);
  if (!isSemesterRegestrationExists) {
    throw new AppError(
      HttpStatus.NOT_FOUND,
      'Semester registration not found!',
    );
  }

  const academicSemester = isSemesterRegestrationExists.academicSemester

  const isAcademicFacultyExists =
    await AcademicFaculty.findById(academicFaculty);
  if (!isAcademicFacultyExists) {
    throw new AppError(HttpStatus.NOT_FOUND, 'Academic Faculty not found!');
  }

  const isAcademicDepartmentExists =
    await AcademicDepartment.findById(academicDepartment);
  if (!isAcademicDepartmentExists) {
    throw new AppError(HttpStatus.NOT_FOUND, 'Academic Department not found!');
  }

  const isCourseExists = await Course.findById(course);
  if (!isCourseExists) {
    throw new AppError(HttpStatus.NOT_FOUND, 'Course not found!');
  }

  const isFacultyExists = await Faculty.findById(faculty);
  if (!isFacultyExists) {
    throw new AppError(HttpStatus.NOT_FOUND, 'Faculty not found!');
  }


  const result = await OfferedCourse.create({...payload, academicSemester});
  return result;
};

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
};
