import { z } from 'zod';

// UserName Schema
const createUserNameValidationSchema = z.object({
  firstName: z
    .string()
    .min(3, 'First name must be at least 3 characters')
    .max(20, 'First name cannot exceed 20 characters')
    .regex(/^[A-Z][a-zA-Z]*$/, 'First name must start with a capital letter')
    .trim(),
  middleName: z.string().trim().optional(),
  lastName: z
    .string()
    .min(3, 'Last name must be at least 3 characters')
    .regex(/^[a-zA-Z]+$/, 'Last name must contain only alphabets')
    .trim(),
});

// Guardian Schema
const createGuardianValidationSchema = z.object({
  fatherName: z.string().nonempty("Father's name is required").trim(),
  fatherOccupation: z
    .string()
    .nonempty("Father's occupation is required")
    .trim(),
  fatherContactNo: z
    .string()
    .nonempty("Father's contact number is required")
    .trim(),
  motherName: z.string().nonempty("Mother's name is required").trim(),
  motherOccupation: z
    .string()
    .nonempty("Mother's occupation is required")
    .trim(),
  motherContactNo: z
    .string()
    .nonempty("Mother's contact number is required")
    .trim(),
});

// Local Guardian Schema
const createLocalGuardianValidationSchema = z.object({
  name: z.string().nonempty("Local guardian's name is required").trim(),
  occupation: z
    .string()
    .nonempty("Local guardian's occupation is required")
    .trim(),
  contactNo: z
    .string()
    .nonempty("Local guardian's contact number is required")
    .trim(),
  address: z.string().nonempty("Local guardian's address is required").trim(),
});

// Student Schema
const createStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20),
    student: z.object({
      name: createUserNameValidationSchema,
      gender: z.enum(['male', 'female', 'other'], {
        invalid_type_error: "Gender must be 'male', 'female', or 'others'",
      }),
      dateOfBirth: z.string().optional(),
      email: z
        .string()
        .nonempty('Email is required')
        .email('Invalid email format')
        .trim(),
      contactNo: z.string().nonempty('Contact number is required').trim(),
      emergencyContactNo: z
        .string()
        .nonempty('Emergency contact number is required')
        .trim(),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
      presentAddress: z.string().nonempty('Present address is required').trim(),
      permanentAddress: z
        .string()
        .nonempty('Permanent address is required')
        .trim(),
      guardian: createGuardianValidationSchema,
      localGuardian: createLocalGuardianValidationSchema,
      admissionSemester: z.string(),
      profileImg: z.string(),
    }),
  }),
});

// UserName Schema for Update
const updateUserNameValidationSchema = z.object({
  firstName: z
    .string()
    .optional(),
  middleName: z.string().optional(),
  lastName: z
    .string()
    .optional(),
});

// Guardian Schema for Update
const updateGuardianValidationSchema = z.object({
  fatherName: z.string().trim().optional(),
  fatherOccupation: z.string().trim().optional(),
  fatherContactNo: z.string().trim().optional(),
  motherName: z.string().trim().optional(),
  motherOccupation: z.string().trim().optional(),
  motherContactNo: z.string().trim().optional(),
});

// Local Guardian Schema for Update
const updateLocalGuardianValidationSchema = z.object({
  name: z.string().trim().optional(),
  occupation: z.string().trim().optional(),
  contactNo: z.string().trim().optional(),
  address: z.string().trim().optional(),
});


// Update Student Schema
const updateStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20).optional(),
    student: z.object({
      name: updateUserNameValidationSchema.optional(),
      gender: z.enum(['male', 'female', 'other'], {
        invalid_type_error: "Gender must be 'male', 'female', or 'others'",
      }).optional(),
      dateOfBirth: z.string().optional(),
      email: z
        .string()
        .nonempty('Email is required')
        .email('Invalid email format')
        .trim()
        .optional(),
      contactNo: z.string().nonempty('Contact number is required').trim().optional(),
      emergencyContactNo: z
        .string()
        .nonempty('Emergency contact number is required')
        .trim()
        .optional(),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
      presentAddress: z.string().nonempty('Present address is required').trim().optional(),
      permanentAddress: z
        .string()
        .nonempty('Permanent address is required')
        .trim()
        .optional(),
      guardian: updateGuardianValidationSchema.optional(),
      localGuardian: updateLocalGuardianValidationSchema.optional(),
      admissionSemester: z.string().optional(),
      profileImg: z.string().optional(),
    }),
  }),
});

export const studentValidations = {
  createStudentValidationSchema,
  updateStudentValidationSchema
};
