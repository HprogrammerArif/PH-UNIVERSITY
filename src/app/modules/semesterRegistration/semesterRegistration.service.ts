/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpStatus from 'http-status';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import AppError from '../../errors/AppError';
import { SemesterRegistration } from './semesterRegistration.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { RegistrationStatus } from './semesterRegistration.constant';
import mongoose from 'mongoose';
import { OfferedCourse } from '../OfferedCourse/OfferedCourseModel';

const createSemesterRegistrationIntoDb = async (
  payload: TSemesterRegistration,
) => {
  const academicSemester = payload?.academicSemester;

  // check if there are any registered semester that is already 'UPCOMMING' | 'ONGOING'
  const isThereAnyUpcomingOrOngoingSemester =
    await SemesterRegistration.findOne({
      $or: [
        { status: RegistrationStatus.UPCOMING },
        { status: RegistrationStatus.ONGOING },
      ],
    });

  if (isThereAnyUpcomingOrOngoingSemester) {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      `There is already an '${isThereAnyUpcomingOrOngoingSemester.status}' registered semester!`,
    );
  }

  // Check if the semester is exists
  const isAcademicSemesterExists =
    await AcademicSemester.findById(academicSemester);
  if (!isAcademicSemesterExists) {
    throw new AppError(
      HttpStatus.NOT_FOUND,
      'This academic semester not found!',
    );
  }
  // Check if the semester is already registered!
  const isSemesterRegistrationExists = await SemesterRegistration.findOne({
    academicSemester,
  });
  if (isSemesterRegistrationExists) {
    throw new AppError(
      HttpStatus.CONFLICT,
      'This semester is already registered!',
    );
  }

  const result = await SemesterRegistration.create(payload);
  return result;
};

const getAllSemesterRegistrationsFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate('academicSemester'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await semesterRegistrationQuery.modelQuery;
  return result;
};

const getSingleSemesterRegistrationFromDB = async (id: string) => {
  const result = await SemesterRegistration.findById(id);
  //const result = await AcademicSemester.aggregate([{ $match: { id: id } }]);
  return result;
};

const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  // check if the requested registered semester is exists
  const isSemesterRegistrationExists = await SemesterRegistration.findById(id);
  if (!isSemesterRegistrationExists) {
    throw new AppError(HttpStatus.NOT_FOUND, 'This semester is not found!');
  }
  // if the requested semester registration is ended, we will not update anything
  const currentSemesterStatus = isSemesterRegistrationExists?.status;
  const requestedSemesterStatus = payload?.status;

  if (currentSemesterStatus === RegistrationStatus.ENDED) {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      `This semester is already '${currentSemesterStatus}`,
    );
  }

  // UPCOMING --> ONGOING --> ENDED
  if (
    currentSemesterStatus === RegistrationStatus.UPCOMING &&
    requestedSemesterStatus === RegistrationStatus.ENDED
  ) {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      `You can not directly change status from '${currentSemesterStatus} to '${requestedSemesterStatus}'`,
    );
  }

  if (
    currentSemesterStatus === RegistrationStatus.ONGOING &&
    requestedSemesterStatus === RegistrationStatus.UPCOMING
  ) {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      `You can not directly change status from '${currentSemesterStatus} to '${requestedSemesterStatus}'`,
    );
  }

  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteSemesterRegistrationFromDB = async (id: string) => {
  /** 
  * Step1: Delete associated offered courses.
  * Step2: Delete semester registraton when the status is 
  'UPCOMING'.
  **/

  // checking if the semester registration is exist
  const isSemesterRegistrationExists = await SemesterRegistration.findById(id);

  if (!isSemesterRegistrationExists) {
    throw new AppError(
      HttpStatus.NOT_FOUND,
      'This registered semester is not found !',
    );
  }

  // checking if the status is still "UPCOMING"
  const semesterRegistrationStatus = isSemesterRegistrationExists.status;

  if (semesterRegistrationStatus !== 'UPCOMING') {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      `You can not update as the registered semester is ${semesterRegistrationStatus}`,
    );
  }

  const session = await mongoose.startSession();

  //deleting associated offered courses

  try {
    session.startTransaction();

    const deletedOfferedCourse = await OfferedCourse.deleteMany(
      {
        semesterRegistration: id,
      },
      {
        session,
        new: true,
      },
    );

    if (!deletedOfferedCourse) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        'Failed to delete semester registration !',
      );
    }

    const deletedSemisterRegistration =
      await SemesterRegistration.findByIdAndDelete(id, {
        session,
        new: true,
      });

    if (!deletedSemisterRegistration) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        'Failed to delete semester registration !',
      );
    }

    await session.commitTransaction();
    await session.endSession();

    return null;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const SemesterRegistrationService = {
  createSemesterRegistrationIntoDb,
  getAllSemesterRegistrationsFromDB,
  getSingleSemesterRegistrationFromDB,
  updateSemesterRegistrationIntoDB,
  deleteSemesterRegistrationFromDB,
};
