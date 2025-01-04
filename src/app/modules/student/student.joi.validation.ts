import Joi from 'joi';

const userNameValidationSchema = Joi.object({
  firstName: Joi.string()
    .min(3)
    .max(20)
    .regex(/^[A-Z][a-zA-Z]*$/)
    .trim()
    .required()
    .messages({
      'string.empty': 'First name is required!',
      'string.min': 'First name must be at least 3 characters!',
      'string.max': 'First name cannot exceed 20 characters!',
      'string.pattern.base': '{#value} is not in capitalize format!',
    }),
  middleName: Joi.string().trim().optional(),
  lastName: Joi.string()
    .regex(/^[a-zA-Z]+$/)
    .trim()
    .required()
    .messages({
      'string.empty': 'Last name is required!',
      'string.pattern.base': '{#value} is not valid!',
    }),
});

// Define the Joi schema for `guardian`
const guardianValidationSchema = Joi.object({
  fatherName: Joi.string().trim().required().messages({
    'string.empty': "Father's name is required!",
  }),
  fatherOccupation: Joi.string().trim().required().messages({
    'string.empty': "Father's occupation is required!",
  }),
  fatherContactNo: Joi.string().trim().required().messages({
    'string.empty': "Father's contact number is required!",
  }),
  motherName: Joi.string().trim().required().messages({
    'string.empty': "Mother's name is required!",
  }),
  motherOccupation: Joi.string().trim().required().messages({
    'string.empty': "Mother's occupation is required!",
  }),
  motherContactNo: Joi.string().trim().required().messages({
    'string.empty': "Mother's contact number is required!",
  }),
});

// Define the Joi schema for `localGuardian`
const localGuardianValidationSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    'string.empty': "Local guardian's name is required!",
  }),
  occupation: Joi.string().trim().required().messages({
    'string.empty': "Local guardian's occupation is required!",
  }),
  contactNo: Joi.string().trim().required().messages({
    'string.empty': "Local guardian's contact number is required!",
  }),
  address: Joi.string().trim().required().messages({
    'string.empty': "Local guardian's address is required!",
  }),
});

// Define the Joi schema for `student`
const studentValidationSchema = Joi.object({
  id: Joi.string().trim().required().messages({
    'string.empty': 'Student ID is required!',
  }),
  name: userNameValidationSchema.required().messages({
    'any.required': 'Name is required!',
  }),
  gender: Joi.string()
    .valid('male', 'female', 'others')
    .trim()
    .required()
    .messages({
      'any.only':
        "'{#value}' is invalid. Gender must be 'male', 'female', or 'others'.",
      'string.empty': 'Gender is required!',
    }),
  dateOfBirth: Joi.string().optional(),
  email: Joi.string().email().trim().required().messages({
    'string.email': '{#value} is not a valid email type!',
    'string.empty': 'Email is required!',
  }),
  contactNo: Joi.string().trim().required().messages({
    'string.empty': 'Contact number is required!',
  }),
  emergencyContactNo: Joi.string().trim().required().messages({
    'string.empty': 'Emergency contact number is required!',
  }),
  bloodGroup: Joi.string()
    .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
    .optional()
    .messages({
      'any.only':
        "'{#value}' is invalid. Blood group must be one of 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'.",
    }),
  presentAddress: Joi.string().trim().required().messages({
    'string.empty': 'Present address is required!',
  }),
  permanentAddress: Joi.string().trim().required().messages({
    'string.empty': 'Permanent address is required!',
  }),
  guardian: guardianValidationSchema.required().messages({
    'any.required': 'Guardian information is required!',
  }),
  localGuardian: localGuardianValidationSchema.required().messages({
    'any.required': 'Local guardian information is required!',
  }),
  profileImg: Joi.string().optional(),
  isActive: Joi.string().valid('active', 'blocked').default('active').messages({
    'any.only': "'{#value}' is invalid. Status must be 'active' or 'blocked'.",
  }),
});

export default studentValidationSchema;
