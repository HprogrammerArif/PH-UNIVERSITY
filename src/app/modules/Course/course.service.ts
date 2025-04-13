import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { CourseSearchableFields } from './course.constant';
import { TCourse, TCourseFaculty } from './course.interface';
import { Course, CourseFaculty } from './course.model';
import AppError from '../../errors/AppError';
import HttpStatus from 'http-status';

const createCourseIntoDB = async (payload: TCourse) => {
  const result = await Course.create(payload);
  return result;
};

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    Course.find().populate('preRequisiteCourses.course'),
    query,
  )
    .search(CourseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await courseQuery.modelQuery;
  return result;
};

const getSingleCourseFromDB = async (id: string) => {
  const result = await Course.findById(id).populate(
    'preRequisiteCourses.course',
  );
  return result;
};

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  const { preRequisiteCourses, ...courseReminingData } = payload;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    //step-1: Basic course info update
    const updateBasicCourseInfo = await Course.findByIdAndUpdate(
      id,
      courseReminingData,
      { new: true, runValidators: true, session },
    );

    if (!updateBasicCourseInfo) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Failed to update course');
    }

    // console.log(preRequisiteCourses);
    // check if there is any pre requisite courses to update

    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      //filter out the deleted fields
      const deletePreRequisites = preRequisiteCourses
        .filter((el) => el.course && el.isDeleted)
        .map((el) => el.course);
      console.log(deletePreRequisites);

      const deletePreRequisiteCourses = await Course.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: { course: { $in: deletePreRequisites } },
          },
        },
        { new: true, runValidators: true, session },
      );

      if (!deletePreRequisiteCourses) {
        throw new AppError(HttpStatus.BAD_REQUEST, 'Failed to update course');
      }

      //filter out the new course field for add
      const newPreRequisites = preRequisiteCourses?.filter(
        (el) => el.course && !el.isDeleted,
      );
      console.log(newPreRequisites);
      const newPreRequisiteCourses = await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: { preRequisiteCourses: { $each: newPreRequisites } },
        },
        { new: true, runValidators: true, session },
      );

      if (!newPreRequisiteCourses) {
        throw new AppError(HttpStatus.BAD_REQUEST, 'Failed to update course');
      }

      const result = await Course.findById(id).populate(
        'preRequisiteCourses.course',
      );

      return result;
    }

    await session.commitTransaction();
    await session.endSession();
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(HttpStatus.BAD_REQUEST, 'Failed to update course!');
  }
};

const deleteCourseFromDB = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

const assignFacultiesWithCourseIntoDB = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      course: id,
      $addToSet: { faculties: { $each: payload } },
    },
    {
      upsert: true,
      new: true,
    },
  );
  return result;
};


const removeFacultiesFromCourseFromDB = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      $pull: {faculties: {$in: payload}}
    },
    {
      
      new: true,
    },
  );
  return result;
};

export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  updateCourseIntoDB,
  deleteCourseFromDB,
  assignFacultiesWithCourseIntoDB,
  removeFacultiesFromCourseFromDB
};
