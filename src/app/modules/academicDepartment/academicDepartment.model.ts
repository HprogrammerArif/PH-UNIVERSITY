import { model, Schema } from 'mongoose';
import { TAcademicDepartment } from './academicDepartment.interface';
import AppError from '../../errors/AppError';
import HttpStatus from 'http-status';

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicFaculty',
    },
  },
  {
    timestamps: true,
  },
);

//CHEAKING IS DEPARTMENT ALREADY EXISTS OR NOT
academicDepartmentSchema.pre('save', async function (next) {
  const isDepartmentExist = await AcademicDepartment.findOne({
    name: this.name,
  });

  if(isDepartmentExist) {
    throw new AppError(HttpStatus.NOT_FOUND,"This department already exists!!")
  }
  next()
})


//checking am i updating deleted department or not
academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery()
  //console.log(query);

  const isDepartmentExist = await AcademicDepartment.findOne(query);

  if(!isDepartmentExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "This department doesn't exists!!")
  }
  next()

})


export const AcademicDepartment = model<TAcademicDepartment>(
  'AcademicDepartment',
  academicDepartmentSchema,
);
