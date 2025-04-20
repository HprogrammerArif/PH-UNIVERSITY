import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';
import { Course } from '../Course/course.model';
import { Faculty } from '../Faculty/faculty.model';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { TOfferedCourse } from './OfferedCourse.interface';
import { hasTimeConflict } from './OfferedCourse.utils';
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
    section,
    days,
    startTime,
    endTime,
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

  const academicSemester = isSemesterRegestrationExists.academicSemester;

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

  // Check if the department is belong to the faculty
  // academic department e ki academic faculty ta ace?
  const isDepartmentBelongToFaculty = await AcademicDepartment.findOne({
    _id: academicDepartment,
    academicFaculty,
  });

  if (!isDepartmentBelongToFaculty) {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      `This ${isAcademicDepartmentExists.name} is not belong to this ${isAcademicFacultyExists.name}`,
    );
  }

  // Check if the same Offered course same section in same registered semester exists
  const isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection =
    await OfferedCourse.findOne({
      semesterRegestration,
      course,
      section,
    });
  if (isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection) {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      `Offered Course with same section is already exists!!`,
    );
  }

  // TIME CONFLICT SOLVE (A LECTURER CAN NOT TAKE CLASS SAME TIME AT SAME DAY)
  // get the schedules of the faculties
  const assignedSchedules = await OfferedCourse.find({
    semesterRegestration,
    days: { $in: days },
    faculty,
  }).select('days startTime endTime');
  console.log(assignedSchedules);

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  // console.log(hasTimeConflict(assignedSchedules, newSchedule));
  if (hasTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      HttpStatus.CONFLICT,
      `This faculty is not abaivle at that time! Choose other time or day!!`,
    );
  }

  const result = await OfferedCourse.create({ ...payload, academicSemester });
  return result;
};

const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>,
) => {
  const { faculty, days, startTime, endTime } = payload;

  const isOfferedCourseExists = await OfferedCourse.findById(id);
  if (!isOfferedCourseExists) {
    throw new AppError(HttpStatus.NOT_FOUND, 'Offered course not found!');
  }

  const isFacultyExists = await Faculty.findById(faculty);
  if (!isFacultyExists) {
    throw new AppError(HttpStatus.NOT_FOUND, 'Faculty not found!');
  }

  const semesterRegestration = isOfferedCourseExists.semesterRegestration;

  const semesterRegestrationStatus =
    await SemesterRegistration.findById(semesterRegestration);

  if (semesterRegestrationStatus?.status !== 'UPCOMING') {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      `You can not update this offered course as it is ${semesterRegestrationStatus?.status}`,
    );
  }

  // get the schedules of the faculties
  const assignedSchedules = await OfferedCourse.find({
    semesterRegestration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');
  console.log(assignedSchedules);

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  // console.log(hasTimeConflict(assignedSchedules, newSchedule));
  if (hasTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      HttpStatus.CONFLICT,
      `This faculty is not abaivle at that time! Choose other time or day!!`,
    );
  }

  const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const getAllOfferedCoursesFromDB = async (query: Record<string, unknown>) => {
  const offeredCourseQuery = new QueryBuilder(OfferedCourse.find(), query)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await offeredCourseQuery.modelQuery;
  return result;
};

const getSingleOfferedCourseFromDB = async (id: string) => {
  const offeredCourse = await OfferedCourse.findById(id);
  if (!offeredCourse) {
    throw new AppError(HttpStatus.NOT_FOUND, 'Offered course not found!');
  }
  return offeredCourse;
};

const deleteOfferedCourseFromDB = async (id: string) => {
  const isOfferedCourseExists = await OfferedCourse.findById(id);
  if (!isOfferedCourseExists) {
    throw new AppError(HttpStatus.NOT_FOUND, 'Offered course not found!');
  }

  const semesterRegestration = isOfferedCourseExists.semesterRegestration;

  const semesterRegestrationStatus =
    await SemesterRegistration.findById(semesterRegestration);

  if (semesterRegestrationStatus?.status !== 'UPCOMING') {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      `You can not delete this offered course as it is ${semesterRegestrationStatus?.status}`,
    );
  }

  const result = await OfferedCourse.findByIdAndDelete(id);
  return result;
};

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
  updateOfferedCourseIntoDB,
  getAllOfferedCoursesFromDB,
  getSingleOfferedCourseFromDB,
  deleteOfferedCourseFromDB,
};
