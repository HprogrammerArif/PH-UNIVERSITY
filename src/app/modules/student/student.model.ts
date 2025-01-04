import { Schema, model } from 'mongoose';
import {
  //StudentMethods,
  StudentModel,
  TGuardian,
  TLocalGuardian,
  TStudent,
  TUserName,
} from './student.interface';
import validator from 'validator';
import bcrypt from 'bcrypt';
import config from '../../config';

// 2. Create a Schema corresponding to the document interface.

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'First name is required!'],
    maxlength: [20, 'Max length can not be more then 20'],
    minlength: 3,
    trim: true,
    validate: {
      validator: function (value: string) {
        const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1);
        return firstNameStr === value;
      },
      message: '{VALUE} is not in capitalize formate!!',
    },
  },
  middleName: { type: String, trim: true },
  lastName: {
    type: String,
    required: [true, 'Last name is required!'],
    validate: {
      validator: (value: string) => validator.isAlpha(value),
      message: '{VALUE} is not valid',
    },
  },
});

const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    required: [true, "Father's name is required!"],
    trim: true,
  },
  fatherOccupation: {
    type: String,
    required: [true, "Father's occupation is required!"],
    trim: true,
  },
  fatherContactNo: {
    type: String,
    required: [true, "Father's contact number is required!"],
    trim: true,
  },
  motherName: {
    type: String,
    required: [true, "Mother's name is required!"],
    trim: true,
  },
  motherOccupation: {
    type: String,
    required: [true, "Mother's occupation is required!"],
    trim: true,
  },
  motherContactNo: {
    type: String,
    required: [true, "Mother's contact number is required!"],
    trim: true,
  },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: {
    type: String,
    required: [true, "Local guardian's name is required!"],
    trim: true,
  },
  occupation: {
    type: String,
    required: [true, "Local guardian's occupation is required!"],
    trim: true,
  },
  contactNo: {
    type: String,
    required: [true, "Local guardian's contact number is required!"],
    trim: true,
  },
  address: {
    type: String,
    required: [true, "Local guardian's address is required!"],
    trim: true,
  },
});

const studentSchema = new Schema<TStudent, StudentModel>({
  id: {
    type: String,
    required: [true, 'Student ID is required!'],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required!'],
    maxlength: [20, 'Password can not be more than 20 characters!!!'],
  },
  name: {
    type: userNameSchema,
    required: [true, 'Name is required!'],
  },
  gender: {
    type: String,
    enum: {
      values: ['male', 'female', 'others'],
      message:
        "'{VALUE}' is invalid. Gender must be 'male', 'female', or 'others'.",
    },
    required: [true, 'Gender is required!'],
    trim: true,
  },
  dateOfBirth: { type: String },
  email: {
    type: String,
    required: [true, 'Email is required!'],
    unique: true,
    trim: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: '{VALUE} is not a valid email type!!',
    },
  },
  contactNo: {
    type: String,
    required: [true, 'Contact number is required!'],
  },
  emergencyContactNo: {
    type: String,
    required: [true, 'Emergency contact number is required!'],
  },
  bloodGroup: {
    type: String,
    enum: {
      values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      message:
        "'{VALUE}' is invalid. Blood group must be one of 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'.",
    },
  },
  presentAddress: {
    type: String,
    required: [true, 'Present address is required!'],
  },
  permanentAddress: {
    type: String,
    required: [true, 'Permanent address is required!'],
  },
  guardian: {
    type: guardianSchema,
    required: [true, 'Guardian information is required!'],
  },
  localGuardian: {
    type: localGuardianSchema,
    required: [true, 'Local guardian information is required!'],
  },
  profileImg: { type: String },
  isActive: {
    type: String,
    enum: {
      values: ['active', 'blocked'],
      message: "'{VALUE}' is invalid. Status must be 'active' or 'blocked'.",
    },
    default: 'active',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, {
  toJSON: {
    virtuals: true
  }
});

//Mongoose virtual
studentSchema.virtual('fullName').get(function () {
  return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`;
});

//pre save middleware/ hook : will work on create(), save()
studentSchema.pre('save', async function (next) {
  //console.log(this, 'We will save data!!');
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  //using bcrypt for hasing password and save into db
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

//post save middleware/ hook
studentSchema.post('save', function (doc, next) {
  //console.log(this, 'post hook: We saved our data!!');
  doc.password = '';
  next();
});

//query milldeware
studentSchema.pre('find', async function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

studentSchema.pre('findOne', async function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
//use for aggreaget
// [ { '$match': { id: '1234579' } } ]
//console.log(this.pipeline());
studentSchema.pre('aggregate', async function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

//B. creating a custom static method
studentSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Student.findOne({ id });
  return existingUser;
};

// A. //creating a custom instance method
// studentSchema.methods.isUserExists = async function (id:string) {
//   const existingUser = await Student.findOne({id})
//   return existingUser
// }

// 3. Create a Model.
export const Student = model<TStudent, StudentModel>('Student', studentSchema);
