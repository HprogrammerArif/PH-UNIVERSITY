import { z } from 'zod';

const userValidationSchema = z.object({
  // id: z.string(),
  password: z
    .string({invalid_type_error: 'Password must be string'})
    .min(3, { message: 'Password must be atleast 3 character!' })
    .max(20, { message: 'Password can not be no more then 20 character!!' })
    .optional(),
  //needsPasswordChange: z.boolean().optional().default(true),
  //role: z.enum(['admin', 'student', 'faculty']),
  //status: z.enum(['in-progress', 'blocked']).default('in-progress'),
  //isDeleted: z.boolean().optional().default(false)
});

export const UserValidation = {
  userValidationSchema
}
