import { z } from 'zod';

// UserName Schema
const userNameValidationSchema = z.object({
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
const guardianValidationSchema = z.object({
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
const localGuardianValidationSchema = z.object({
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
      name: userNameValidationSchema,
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
      guardian: guardianValidationSchema,
      localGuardian: localGuardianValidationSchema,
      admissionSemester: z.string(),
      profileImg: z.string(),
    }),
  }),
});

export const studentValidations = {
  createStudentValidationSchema,
};
