import { Types } from 'mongoose';

export type TDays = 'Sat' | 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';

export type TOfferedCourse = {
  semesterRegestration: Types.ObjectId;
  academicSemester?: Types.ObjectId;
  academicFaculty: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  course: Types.ObjectId;
  faculty: Types.ObjectId;
  maxCapacity: number;
  section: number;
  days: TDays[];
  startTime: string;
  endTime: string;
};


export type TSchedule = {
  days: TDays[];
  startTime: string;
  endTime: string;
};