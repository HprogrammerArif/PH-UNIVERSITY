import { z } from 'zod';
import { Days } from './OfferedCourse.Constant';

const createOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      semesterRegestration: z.string(),
      //academicSemester: z.string(), will not come from the client side
      academicFaculty: z.string(),
      academicDepartment: z.string(),
      course: z.string(),
      faculty: z.string(),
      maxCapacity: z.number(),
      section: z.number(),
      days: z.array(z.enum([...Days] as [string, ...string[]])),
      startTime: z.string().refine(
        (time) => {
          const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/; //00-09 10-19 20-23
          return regex.test(time);
        },
        {
          message: 'Invalid time format! Expected "HH:MM" in 24 hours format!',
        },
      ),

      endTime: z.string().refine(
        (time) => {
          const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/; //00-09 10-19 20-23
          return regex.test(time);
        },
        {
          message: 'Invalid time format! Expected "HH:MM" in 24 hours format!',
        },
      ),
    })
    .refine((body) => {
      //startTime: 10:30 => 1970-01-01T10:30
      //endTime: 12:30 => 1970-01-01T12:30
      const start = new Date(`1970-01-01T${body.startTime}:00`);
      const end = new Date(`1970-01-01T${body.endTime}:00`);
      return end > start;
    }, {
      message: 'Start time should be before end time!'
    }),
});

const updateOfferedCourseValidationSchema = z.object({
  body: z.object({
    faculty: z.string().optional(),
    maxCapacity: z.number().optional(),
    days: z.enum([...Days] as [string, ...string[]]).optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
  }),
});

export const OfferedCourseValidations = {
  createOfferedCourseValidationSchema,
  updateOfferedCourseValidationSchema,
};
