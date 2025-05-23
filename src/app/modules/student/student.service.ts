import mongoose from 'mongoose';
import { Student } from './student.model';
import AppError from '../../errors/AppError';
import HttpStatus from 'http-status';
import { User } from '../user/user.model';
import { TStudent } from './student.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import { studentSearchableFields } from './student.constant';

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  // const querObj = { ...query }; //COPY

  // //{ email: {$reqex: query.searchTerm , $options: i }}
  // //{ presentAddress: {$reqex: query.searchTerm , $options: i }}
  // //{ name.firstName: {$reqex: query.searchTerm , $options: i }}

  // const studentSearchableFields = ['email', 'name.firstName', 'presentAddress'];

  // let searchTerm = '';
  // if (query?.searchTerm) {
  //   searchTerm = query?.searchTerm as string;
  // }

  // //1. SEARCH QUERY (METHOD CHAINING)
  // const searchQuery = Student.find({
  //   $or: studentSearchableFields.map((field) => ({
  //     [field]: { $regex: searchTerm, $options: 'i' },
  //   })),
  // });

  // //2. FILTERING QUERY
  // const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];

  // excludeFields.forEach((el) => delete querObj[el]);

  // console.log({ query }, { querObj });

  // const filterQuery = searchQuery
  //   .find(querObj)
  //   .populate('admissionSemester')
  //   .populate({
  //     path: 'academicDepartment',
  //     populate: {
  //       path: 'academicFaculty',
  //     },
  //   });

  // //SORT
  // let sort = '-createdAt';
  // if (query.sort) {
  //   sort = query.sort as string;
  // }
  // const sortQuery = filterQuery.sort(sort);

  // //LIMIT & PAGINATE
  // let page = 1;
  // let limit = 1;
  // let skip = 0;

  // if (query.limit) {
  //   limit = Number(query.limit);
  // }

  // if (query.page) {
  //   page = Number(query.page);
  //   skip = Number(page - 1) * limit;
  // }

  // const paginateQuery = sortQuery.skip(skip);

  // const limitQuery = paginateQuery.limit(limit);

  // //FIELD LIMITING
  // let fields = '__v';

  // //{ fields: 'name,email' }
  // //{ fields: 'name email' }

  // if (query.fields) {
  //   fields = (query.fields as string).split(',').join(' ');
  //   console.log({ fields });
  // }

  // const fieldQuery = await limitQuery.select(fields);

  // return fieldQuery;

  const studentQuery = new QueryBuilder(
    Student.find()
    .populate('user')
      .populate('admissionSemester')
      .populate({
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
        },
      }),
    query,
  )
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await studentQuery.modelQuery;
  console.log(result);
  return result;
};

const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
  const { name, guardian, localGuardian, ...remainingStudentData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  /*
  guardian : {
  fatherOccupation: "Teacher"
  }
  guardian.fatherOccupation = "teacher"

  name.lastName = 'Abedin'
  */

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }

  console.log(modifiedUpdatedData);

  const result = await Student.findByIdAndUpdate( id , modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  // const result = await Student.findOne({ id });
  // http://localhost:5000/api/v1/students/1234579 will send id not _id
  //const result = await Student.aggregate([{ $match: { id: id } }]);
  // const result = await Student.findById(id)
  const result = await Student.findById( id )
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};

const deleteStudentFromDB = async (id: string) => {
  //TRANSCATION AND ROLLBACK
  const session = await mongoose.startSession(); // 1

  try {
    session.startTransaction(); //2
    const deleteStudent = await Student.findByIdAndUpdate(
      id ,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deleteStudent) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Failed to delete student!!');
    }

    //get user -id from deleteStudent
    const userId = deleteStudent.user

    const deletedUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Failed to delete user!!');
    }

    await session.commitTransaction(); //3
    await session.endSession();

    return deleteStudent;
  } catch (err) {
    await session.abortTransaction(); //4
    await session.endSession();
    throw new AppError(HttpStatus.BAD_REQUEST, 'Failed to delete student!!');
    console.log(err);
  }
};

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
  updateStudentIntoDB,
};

// const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
//   const querObj = { ...query }; //COPY

//   //{ email: {$reqex: query.searchTerm , $options: i }}
//   //{ presentAddress: {$reqex: query.searchTerm , $options: i }}
//   //{ name.firstName: {$reqex: query.searchTerm , $options: i }}

//   const studentSearchableFields = ['email', 'name.firstName', 'presentAddress'];

//   let searchTerm = '';
//   if (query?.searchTerm) {
//     searchTerm = query?.searchTerm as string;
//   }

//   //1. SEARCH QUERY (METHOD CHAINING)
//   const searchQuery = Student.find({
//     $or: studentSearchableFields.map((field) => ({
//       [field]: { $regex: searchTerm, $options: 'i' },
//     })),
//   });

//   //2. FILTERING QUERY
//   const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];

//   excludeFields.forEach((el) => delete querObj[el]);

//   console.log({ query }, { querObj });

//   const filterQuery = searchQuery
//     .find(querObj)
//     .populate('admissionSemester')
//     .populate({
//       path: 'academicDepartment',
//       populate: {
//         path: 'academicFaculty',
//       },
//     });

//   //SORT
//   let sort = '-createdAt';
//   if (query.sort) {
//     sort = query.sort as string;
//   }
//   const sortQuery = filterQuery.sort(sort);

//   //LIMIT & PAGINATE
//   let page = 1;
//   let limit = 1;
//   let skip = 0;

//   if (query.limit) {
//     limit = Number(query.limit);
//   }

//   if (query.page) {
//     page = Number(query.page);
//     skip = Number(page - 1) * limit;
//   }

//   const paginateQuery = sortQuery.skip(skip);

//   const limitQuery = paginateQuery.limit(limit);

//   //FIELD LIMITING
//   let fields = '__v';

//   //{ fields: 'name,email' }
//   //{ fields: 'name email' }

//   if (query.fields) {
//     fields = (query.fields as string).split(',').join(' ');
//     console.log({ fields });
//   }

//   const fieldQuery = await limitQuery.select(fields);

//   return fieldQuery;
// };
