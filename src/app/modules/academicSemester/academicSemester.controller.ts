
import sendResponse from '../../utils/sendResponse';
import HttpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { AcademicSemesterService } from './academicSemester.service';



const createAcademicSemester= catchAsync(async (req, res) => {
  //create a schema validation using zod
  const payload = req.body;

  //const zodParsedData = studentValidationSchema.parse(studentData);

  const result = await AcademicSemesterService.createAcademicSemesterIntoDb(payload)

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Academic Semester is created succesfully!!',
    data: result,
  });
});



const getAllAcademicSemester= catchAsync(async (req, res) => {

  const result = await AcademicSemesterService.getAllAcademicSemesterFromDB()

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Academic Semester is retrived succesfully!!',
    data: result,
  });
});


const getSingleAcademicSemester= catchAsync(async (req, res) => {
  
  const { semesterId } = req.params;

  const result = await AcademicSemesterService.getSingleAcademicSemesterFromDB(semesterId)

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Academic Semester is retrive succesfully!!',
    data: result,
  });
});


const updateAcademicSemester = catchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const result = await AcademicSemesterService.updateAcademicSemesterIntoDB(
    semesterId,
    req.body,
  );

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Academic semester is updated succesfully',
    data: result,
  });
});




export const AcademicSemesterControllers = {
  createAcademicSemester,
  getAllAcademicSemester,
  getSingleAcademicSemester,
  updateAcademicSemester
};
