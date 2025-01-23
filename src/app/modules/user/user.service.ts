import config from '../../config';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';

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

  //set manualy generated id
  //userData.id = '2030100001';
  if (admissionSemester) {
    userData.id = await generateStudentId(admissionSemester);
  } else {
    throw new Error("admissionSemester is null or undefined.");
  }


  //create a user
  const newUser = await User.create(userData);

  //create a student
  if (Object.keys(newUser).length) {
    //set id, _id as user
    payload.id = newUser.id; // embading id
    payload.user = newUser._id; //reference _id

    const newStudent = await Student.create(payload);
    return newStudent;
  }
};

export const UserServices = {
  createStudentIntoDB,
};
