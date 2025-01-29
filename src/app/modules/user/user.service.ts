import mongoose from 'mongoose';
import config from '../../config';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';
import HttpStatus from 'http-status';

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  //create a user object
  const userData: Partial<TUser> = {};

  // if password is not given, use default password!
  userData.password = password || (config.default_password as string);

  // if(!password) {
  //   userData.password = config.default_password as string
  // } else {
  //   userData.password = password
  // }

  //set student role
  userData.role = 'student';

  //find academic semester info
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  //creating isolated enviorment for start session (transcation and rollback)
  const session = await mongoose.startSession(); // 1->

  try {
    session.startTransaction(); // 2->

    //set manualy generated id
    //userData.id = '2030100001';
    if (admissionSemester) {
      userData.id = await generateStudentId(admissionSemester);
    } else {
      throw new AppError(
        HttpStatus.NOT_FOUND,
        'admissionSemester is null or undefined.',
      );
    }

    //create a user (transcation-1) // 3->
    const newUser = await User.create([userData], { session }); //array
    console.log(newUser);

    //create a student
    if (!newUser.length) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Failed to create user!!');
    }
    //set id, _id as user
    payload.id = newUser[0].id; // embading id
    payload.user = newUser[0]._id; //reference _id

    //create a student (transcation-2) // 4->
    const newStudent = await Student.create([payload], { session });

    if (!newStudent.length) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Failed to create student!!');
    }

    await session.commitTransaction(); // 5 -> will parmanately save in database
    await session.endSession();
    return newStudent;
  } catch (err) {
    session.abortTransaction(); // 6 ->
    session.endSession();
    console.log(err);
  }
};

export const UserServices = {
  createStudentIntoDB,
};
