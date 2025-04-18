
import HttpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SemesterRegistrationService } from './semesterRegistration.service';


const createSemesterRegistration= catchAsync(async (req, res) => {
  const payload = req.body;

  const result = await SemesterRegistrationService.createSemesterRegistrationIntoDb(payload)

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Semester Registration is created succesfully!!',
    data: result,
  });
});



const getAllSemesterRegistrations= catchAsync(async (req, res) => {

  const result = await SemesterRegistrationService.getAllSemesterRegistrationsFromDB(req.query)

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Register Semesters are retrived succesfully!!',
    data: result,
  });
});


const getSingleSemesterRegistration= catchAsync(async (req, res) => {
  
  const { id } = req.params;

  const result = await SemesterRegistrationService.getSingleSemesterRegistrationFromDB(id)

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Register Semester is retrive succesfully!!',
    data: result,
  });
});


const updateSemesterRegistration = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SemesterRegistrationService.updateSemesterRegistrationIntoDB(
    id,
    req.body,
  );

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Semester registration is updated succesfully',
    data: result,
  });
});




export const SemesterRegistrationControllers = {
  createSemesterRegistration,
  getAllSemesterRegistrations,
  getSingleSemesterRegistration,
  updateSemesterRegistration,
};
